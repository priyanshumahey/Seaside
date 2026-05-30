"use client"

import dynamic from "next/dynamic"
import * as React from "react"
import {
  ArrowsClockwise,
  User,
  X,
  Lightning,
} from "@phosphor-icons/react/dist/ssr"
import { genConfig } from "react-nice-avatar"
import type { AvatarFullConfig, NiceAvatarProps } from "react-nice-avatar"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

const Avatar = dynamic(() => import("react-nice-avatar"), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse rounded-full bg-muted/40" />,
}) as React.ComponentType<NiceAvatarProps>

// ---------------------------------------------------------------------------
// Prebuilt profiles — pulled from pseudo_agents CSVs
// ---------------------------------------------------------------------------
const PREBUILT = [
  {
    label: "Charlie",
    name: "Charlie",
    age: "22",
    jobDescription: "Data Analyst at GE Healthcare Bellevue. Healthcare Technology.",
    locationHome: "Capitol Hill, Seattle",
    locationWork: "GE Healthcare — Bellevue",
    personality: "Analytical, Data-driven, Passionate. Loves bouldering and café culture.",
  },
  {
    label: "Anna",
    name: "Anna",
    age: "21",
    jobDescription: "CS Student & TA at Seattle University. Education / Technology.",
    locationHome: "Redmond, WA",
    locationWork: "Seattle University — First Hill",
    personality: "Creative, Community-focused, Adaptable. Thai food enthusiast, Gasworks Park regular.",
  },
  {
    label: "Connor",
    name: "Connor Thibault",
    age: "24",
    jobDescription: "Software Engineer I at Amazon AWS EC2. South Lake Union.",
    locationHome: "Fremont, Seattle",
    locationWork: "Amazon HQ — South Lake Union",
    personality: "Analytical, Adaptable, Collaborative. Kayaks Lake Union on weekends.",
  },
  {
    label: "Valeria",
    name: "Valeria Bravo",
    age: "25",
    jobDescription: "Marketing Coordinator at Nordstrom HQ. Consumer Technology / Retail.",
    locationHome: "Columbia City, Seattle",
    locationWork: "Nordstrom HQ — Downtown Seattle",
    personality: "Strategic, Community-focused, Communicative. Salsa dancer, farmers market regular.",
  },
  {
    label: "Lily",
    name: "Lily",
    age: "26",
    jobDescription: "UX Designer II at Microsoft Teams. Cross-cultural & accessibility design.",
    locationHome: "Bellevue, WA",
    locationWork: "Microsoft Campus — Redmond",
    personality: "Creative, Methodical, Empathetic. Bellevue Botanical Garden regular.",
  },
] as const

interface AgentCreationPanelProps {
  onClose: () => void
  onCreated: () => void
}

export function AgentCreationPanel({ onClose, onCreated }: AgentCreationPanelProps) {
  const [name, setName]                     = React.useState("")
  const [personality, setPersonality]       = React.useState("")
  const [jobDescription, setJobDescription] = React.useState("")
  const [locationWork, setLocationWork]     = React.useState("")
  const [locationHome, setLocationHome]     = React.useState("")
  const [age, setAge]                       = React.useState("")
  const [config, setConfig]                 = React.useState<AvatarFullConfig>(() => genConfig())
  const [saving, setSaving]                 = React.useState(false)
  const [success, setSuccess]               = React.useState<string | null>(null)

  const canDeploy = name.trim().length > 0

  function loadPrebuilt(p: (typeof PREBUILT)[number]) {
    setName(p.name)
    setAge(p.age)
    setJobDescription(p.jobDescription)
    setLocationHome(p.locationHome)
    setLocationWork(p.locationWork)
    setPersonality(p.personality)
    setConfig(genConfig())
  }

  const handleCreate = async () => {
    if (!canDeploy) return
    setSaving(true)
    const { error } = await supabase.from("agents").insert({
      name: name.trim(),
      profile_pic: config,
      job_description: jobDescription.trim() || null,
      location_work: locationWork.trim() || null,
      location_home: locationHome.trim() || null,
      age: age ? parseInt(age) : null,
      personality: personality.trim() || null,
    })
    setSaving(false)
    if (error) { alert("Failed: " + error.message); return }
    setSuccess(name)
    onCreated()
    setTimeout(() => {
      setSuccess(null)
      setName(""); setPersonality(""); setJobDescription("")
      setLocationWork(""); setLocationHome(""); setAge("")
      setConfig(genConfig())
    }, 2000)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden border-l border-border/60 bg-background text-foreground">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-4 py-3">
        <span className="text-[10px] uppercase tracking-[0.18em] text-foreground">
          New Agent
        </span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-sm p-1 text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground"
          aria-label="Close panel"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Quick Load */}
        <div className="border-b border-border/60 px-4 py-3">
          <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Quick Load
          </p>
          <div className="flex flex-wrap gap-1.5">
            {PREBUILT.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => loadPrebuilt(p)}
                className="flex items-center gap-1 rounded border border-border/60 bg-card/60 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition hover:border-foreground/40 hover:bg-secondary/60 hover:text-foreground"
              >
                <Lightning size={9} weight="fill" />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4 border-b border-border/60 px-4 py-4">
          <div className="size-14 shrink-0 overflow-hidden rounded-full border border-border/60 bg-muted/30">
            <Avatar style={{ width: "100%", height: "100%" }} {...config} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Agent avatar</p>
            <button
              type="button"
              onClick={() => setConfig(genConfig())}
              className="mt-1 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
            >
              <ArrowsClockwise size={11} />
              Randomize
            </button>
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-4 px-4 py-4">
          <Field>
            <FieldLabel className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Agent name"
              className="h-8 text-xs"
            />
          </Field>

          <Field>
            <FieldLabel className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Age
            </FieldLabel>
            <Input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="28"
              className="h-8 text-xs"
            />
          </Field>

          <Field>
            <FieldLabel className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Job Description
            </FieldLabel>
            <Input
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Software engineer at a startup"
              className="h-8 text-xs"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Home Location
              </FieldLabel>
              <Input
                value={locationHome}
                onChange={(e) => setLocationHome(e.target.value)}
                placeholder="Capitol Hill"
                className="h-8 text-xs"
              />
            </Field>
            <Field>
              <FieldLabel className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Work Location
              </FieldLabel>
              <Input
                value={locationWork}
                onChange={(e) => setLocationWork(e.target.value)}
                placeholder="South Lake Union"
                className="h-8 text-xs"
              />
            </Field>
          </div>

          <Field>
            <FieldLabel className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Personality
            </FieldLabel>
            <Textarea
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="Describe how this agent should behave, their interests, traits…"
              rows={4}
              className="resize-none text-xs"
            />
          </Field>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border/60 px-4 py-3">
        {success ? (
          <div className="flex items-center justify-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 py-2">
            <span className="inline-block size-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_0_#34d399]" />
            <span className="text-[10px] uppercase tracking-[0.18em] text-emerald-400">
              {success} deployed
            </span>
          </div>
        ) : (
          <Button
            size="sm"
            className="w-full text-[10px] uppercase tracking-[0.18em]"
            disabled={!canDeploy || saving}
            onClick={handleCreate}
          >
            {saving ? "Deploying." : "Deploy Agent"}
          </Button>
        )}
      </div>
    </div>
  )
}
