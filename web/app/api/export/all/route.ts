import { NextRequest, NextResponse } from "next/server"

const FOLDER_ID = process.env.BOX_FOLDER_ID ?? "0"

type AgentSummary = {
  name: string
  diary: string
  stops: number
  locations: string
}

type AllExportPayload = {
  date: string
  day_number: number
  agentCount: number
  summaries: AgentSummary[]
}

function buildReport(payload: AllExportPayload): string {
  let text = `City Daily Report — Day ${payload.day_number} (${payload.date})\n`
  text += `Agents: ${payload.agentCount}\n`
  text += `${"=".repeat(50)}\n\n`

  for (const agent of payload.summaries) {
    text += `${agent.name}\n`
    text += `  ${agent.diary}\n`
    text += `  Stops: ${agent.stops} | Places: ${agent.locations}\n`
    text += `\n`
  }

  return text
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

async function askBoxAI(fileId: string, token: string): Promise<string | null> {
  try {
    const res = await fetch("https://api.box.com/2.0/ai/ask", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "single_item_qa",
        prompt: "Summarize the city's activity for this day. Which agents stood out? Any patterns across the group? Keep it to 3-5 sentences.",
        items: [{ type: "file", id: fileId }],
      }),
    })

    if (!res.ok) return null
    const data = await res.json()
    return data.answer ?? null
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload: AllExportPayload = await req.json()

    if (!payload.summaries || !Array.isArray(payload.summaries)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const token = process.env.BOX_DEVELOPER_TOKEN!
    const exportedAt = new Date().toISOString()
    const report = buildReport(payload)
    const filename = `city-report-day${payload.day_number}-${exportedAt.replace(/[:.]/g, "-")}.txt`

    const file = await uploadToBox(report, filename, token)
    const aiSummary = await askBoxAI(file.id, token)

    return NextResponse.json({
      success: true,
      fileId: file.id,
      fileName: file.name,
      boxUrl: `https://app.box.com/file/${file.id}`,
      aiSummary,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[Box all-agents export error]", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
