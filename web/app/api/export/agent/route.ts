import { NextRequest, NextResponse } from "next/server"
import { getBoxClient } from "@/lib/box"

type BeatSummary = {
  time: string
  activity: string
  activity_type: string
  location: string
  travel_mode: string | null
  travel_duration_min: number | null
  reasoning: string
}

type DaySummary = {
  date: string
  day_number: number
  diary: string
  world_event: string
  beats: BeatSummary[]
}

type Comparison = {
  time: string
  activity: string
  location: string
  otherDays: { date: string; day_number: number; activity: string; location: string }[]
}

type AgentExportPayload = {
  agentId: string
  agentName: string
  days: DaySummary[]
  comparisons?: Comparison[]
}

const FOLDER_ID = process.env.BOX_FOLDER_ID ?? "0"

function buildReadableSummary(name: string, days: DaySummary[], comparisons?: Comparison[]): string {
  let text = `Agent: ${name}\nDays tracked: ${days.length}\n\n`

  for (const day of days) {
    text += `--- Day ${day.day_number} (${day.date}) ---\n`
    if (day.world_event) text += `Weather/Event: ${day.world_event}\n`
    text += `\n`

    for (const b of day.beats) {
      const travel = b.travel_mode ? ` [${b.travel_mode}, ${b.travel_duration_min}min]` : ""
      text += `  ${b.time}\n`
      text += `    ${b.activity} @ ${b.location}${travel}\n`
      if (b.reasoning) text += `    Reason: ${b.reasoning}\n`
      text += `\n`
    }

    if (day.diary) text += `Diary: ${day.diary}\n`
    text += `\n`
  }

  if (comparisons && comparisons.length > 0) {
    text += `\n=== CROSS-DAY COMPARISONS ===\n`
    text += `(User flagged these time slots for comparison)\n\n`
    for (const c of comparisons) {
      text += `At ${c.time}: "${c.activity}" @ ${c.location}\n`
      for (const od of c.otherDays) {
        text += `  Day ${od.day_number} (${od.date}): ${od.activity} @ ${od.location}\n`
      }
      text += `\n`
    }
  }

  return text
}

async function askBoxAI(fileId: string, token: string, agentName: string): Promise<string | null> {
  try {
    const res = await fetch("https://api.box.com/2.0/ai/ask", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "single_item_qa",
        prompt: `Summarize what ${agentName} did across these days. Note any patterns, changes in routine, or unusual behavior. If there are cross-day comparisons at the end, highlight what changed at those specific times. Keep it to 4-6 sentences.`,
        items: [{ type: "file", id: fileId }],
      }),
    })

    if (!res.ok) {
      console.error("[Box AI error]", res.status, await res.text())
      return null
    }

    const data = await res.json()
    return data.answer ?? null
  } catch (err) {
    console.error("[Box AI fetch error]", err)
    return null
  }
}

async function uploadToBox(content: string, filename: string, token: string) {
  const blob = new Blob([content], { type: "text/plain" })
  const form = new FormData()
  form.append("attributes", JSON.stringify({ name: filename, parent: { id: FOLDER_ID } }))
  form.append("file", blob, filename)

  const res = await fetch("https://upload.box.com/api/2.0/files/content", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Box upload failed (${res.status}): ${text}`)
  }

  const data = await res.json()
  return data.entries[0]
}

export async function POST(req: NextRequest) {
  try {
    const payload: AgentExportPayload = await req.json()

    if (!payload.agentId || !payload.agentName || !Array.isArray(payload.days)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const exportedAt = new Date().toISOString()
    const summary = buildReadableSummary(payload.agentName, payload.days, payload.comparisons)
    const filename = `${payload.agentName.replace(/\s+/g, "-").toLowerCase()}-summary-${exportedAt.replace(/[:.]/g, "-")}.txt`

    const token = process.env.BOX_DEVELOPER_TOKEN!

    // Upload directly via Box REST API to avoid SDK stream issues
    const file = await uploadToBox(summary, filename, token)

    const aiSummary = await askBoxAI(file.id, token, payload.agentName)

    return NextResponse.json({
      success: true,
      fileId: file.id,
      fileName: file.name,
      boxUrl: `https://app.box.com/file/${file.id}`,
      aiSummary,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[Box agent export error]", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
