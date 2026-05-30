"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw, Navigation, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { agentFormSchema, type AgentFormSchema } from "@/lib/schema";
import { LinkedInProfile } from "@/lib/types";
import { cn, generateAgentId, inferPersonalityFromProfile } from "@/lib/utils";

const LLM_OPTIONS = [
  { value: "gpt-4o",              label: "GPT-4o (OpenAI)" },
  { value: "gpt-4o-mini",         label: "GPT-4o Mini (OpenAI)" },
  { value: "claude-3-5-sonnet",   label: "Claude 3.5 Sonnet (Anthropic)" },
  { value: "claude-3-haiku",      label: "Claude 3 Haiku (Anthropic)" },
  { value: "gemini-1.5-pro",      label: "Gemini 1.5 Pro (Google)" },
  { value: "llama-3.1-70b",       label: "LLaMA 3.1 70B (Meta / local)" },
  { value: "mistral-large",       label: "Mistral Large" },
];

interface AgentEditorProps {
  profile: LinkedInProfile | null;
  onChange: (values: AgentFormSchema) => void;
}

function mapsLink(lat: number, lng: number) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

function CoordRow({
  label,
  latName,
  lngName,
  lat,
  lng,
  register,
  errors,
}: {
  label: string;
  latName: keyof AgentFormSchema;
  lngName: keyof AgentFormSchema;
  lat: number;
  lng: number;
  register: ReturnType<typeof useForm<AgentFormSchema>>["register"];
  errors: ReturnType<typeof useForm<AgentFormSchema>>["formState"]["errors"];
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Lat</Label>
        <Input
          type="number"
          step="0.0001"
          {...register(latName, { valueAsNumber: true })}
          className={cn("font-mono text-xs h-8", errors[latName] && "border-destructive")}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Lng</Label>
        <div className="flex gap-1">
          <Input
            type="number"
            step="0.0001"
            {...register(lngName, { valueAsNumber: true })}
            className={cn("font-mono text-xs h-8", errors[lngName] && "border-destructive")}
          />
          {lat !== 0 && lng !== 0 && (
            <a
              href={mapsLink(lat, lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center justify-center w-8 h-8 rounded-md border border-input bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title={`Open ${label} on map`}
            >
              <Navigation className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function AgentEditor({ profile, onChange }: AgentEditorProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AgentFormSchema>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      agent_id: generateAgentId(),
      agent_name: "",
      age: 34,
      personality_summary: "",
      interests: "",
      work_location: "",
      work_address: "",
      work_lat: 0,
      work_lng: 0,
      home_location: "",
      home_address: "",
      home_lat: 0,
      home_lng: 0,
      occupation_context: "",
      llm_type: "gpt-4o",
      simulation_enabled: true,
    },
  });

  useEffect(() => {
    if (!profile) return;
    const inferred = inferPersonalityFromProfile({
      headline: profile.headline,
      skills: profile.skills,
      industry: profile.industry,
      personal_summary: profile.personal_summary,
      education: profile.education,
      volunteering: profile.volunteering,
      projects: profile.projects,
      work_experience: profile.work_experience,
    });

    setValue("agent_name",       profile.name);
    setValue("age",              profile.computed_age);
    setValue("personality_summary", inferred.summary);
    setValue("interests",        inferred.interests);
    setValue("occupation_context", `${profile.current_role} at ${profile.company}. ${profile.industry} industry. Key skills: ${profile.skills.slice(0, 5).join(", ")}.`);

    setValue("home_location",   profile.resolved_home.display_name);
    setValue("home_address",    profile.resolved_home.address);
    setValue("home_lat",        profile.resolved_home.coordinates.lat);
    setValue("home_lng",        profile.resolved_home.coordinates.lng);

    setValue("work_location",   profile.resolved_work.display_name);
    setValue("work_address",    profile.resolved_work.address);
    setValue("work_lat",        profile.resolved_work.coordinates.lat);
    setValue("work_lng",        profile.resolved_work.coordinates.lng);
  }, [profile, setValue]);

  const values = watch();
  useEffect(() => { onChange(values); }, [values, onChange]);

  const simulationEnabled = watch("simulation_enabled");
  const selectedLlm = watch("llm_type");
  const homeLat = watch("home_lat");
  const homeLng = watch("home_lng");
  const workLat = watch("work_lat");
  const workLng = watch("work_lng");

  function fieldClass(error?: { message?: string }) {
    return cn(error && "border-destructive focus-visible:ring-destructive");
  }

  return (
    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
      {/* Identity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="agent_name">Agent Name</Label>
          <Input id="agent_name" placeholder="Alex Chen" {...register("agent_name")} className={fieldClass(errors.agent_name)} />
          {errors.agent_name && <p className="text-xs text-destructive">{errors.agent_name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="agent_id">Agent ID</Label>
          <div className="flex gap-2">
            <Input id="agent_id" {...register("agent_id")} className={cn("font-mono text-sm", fieldClass(errors.agent_id))} />
            <button type="button" onClick={() => setValue("agent_id", generateAgentId())} title="Generate new ID"
              className="shrink-0 p-2 rounded-md border border-input hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          {errors.agent_id && <p className="text-xs text-destructive">{errors.agent_id.message}</p>}
        </div>
      </div>

      {/* Age + LLM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="age">
            Age
            {profile && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                (grad {profile.graduation_year} at {profile.graduation_age} + work history)
              </span>
            )}
          </Label>
          <Input id="age" type="number" min={18} max={100}
            {...register("age", { valueAsNumber: true })}
            className={fieldClass(errors.age)} />
          {errors.age && <p className="text-xs text-destructive">{errors.age.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="llm_type">LLM Type</Label>
          <Select value={selectedLlm} onValueChange={(v) => setValue("llm_type", v ?? "")}>
            <SelectTrigger id="llm_type" className={fieldClass(errors.llm_type)}>
              <SelectValue placeholder="Select LLM…" />
            </SelectTrigger>
            <SelectContent>
              {LLM_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.llm_type && <p className="text-xs text-destructive">{errors.llm_type.message}</p>}
        </div>
      </div>

      {/* Home Location */}
      <div className="space-y-2 p-3 rounded-lg border bg-rose-500/5 border-rose-500/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-400" />
          <Label className="text-sm font-medium">Home Location</Label>
          {homeLat !== 0 && (
            <a href={mapsLink(homeLat, homeLng)} target="_blank" rel="noopener noreferrer"
              className="ml-auto text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
              <ExternalLink className="h-3 w-3" /> Map
            </a>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Neighborhood / Display</Label>
            <Input {...register("home_location")} placeholder="Capitol Hill" className={cn("text-sm", fieldClass(errors.home_location))} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Full Address</Label>
            <Input {...register("home_address")} placeholder="1700 Westlake Ave N..." className={cn("text-sm", fieldClass(errors.home_address))} />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Coordinates</Label>
          <CoordRow label="home" latName="home_lat" lngName="home_lng"
            lat={homeLat} lng={homeLng} register={register} errors={errors} />
        </div>
      </div>

      {/* Work Location */}
      <div className="space-y-2 p-3 rounded-lg border bg-blue-500/5 border-blue-500/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <Label className="text-sm font-medium">Work Location</Label>
          {workLat !== 0 && (
            <a href={mapsLink(workLat, workLng)} target="_blank" rel="noopener noreferrer"
              className="ml-auto text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
              <ExternalLink className="h-3 w-3" /> Map
            </a>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Neighborhood / Display</Label>
            <Input {...register("work_location")} placeholder="South Lake Union" className={cn("text-sm", fieldClass(errors.work_location))} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Full Address</Label>
            <Input {...register("work_address")} placeholder="410 Terry Ave N..." className={cn("text-sm", fieldClass(errors.work_address))} />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Coordinates</Label>
          <CoordRow label="work" latName="work_lat" lngName="work_lng"
            lat={workLat} lng={workLng} register={register} errors={errors} />
        </div>
      </div>

      {/* Occupation */}
      <div className="space-y-1.5">
        <Label htmlFor="occupation_context">Occupation Context</Label>
        <Textarea id="occupation_context" rows={2} {...register("occupation_context")}
          className={cn("resize-none", fieldClass(errors.occupation_context))} />
        {errors.occupation_context && <p className="text-xs text-destructive">{errors.occupation_context.message}</p>}
      </div>

      {/* Personality */}
      <div className="space-y-1.5">
        <Label htmlFor="personality_summary">Personality Summary</Label>
        <Textarea id="personality_summary" rows={2} {...register("personality_summary")}
          className={cn("resize-none", fieldClass(errors.personality_summary))} />
        {errors.personality_summary && <p className="text-xs text-destructive">{errors.personality_summary.message}</p>}
      </div>

      {/* Interests */}
      <div className="space-y-1.5">
        <Label htmlFor="interests">
          Interests &amp; Hobbies
          <span className="ml-2 text-xs font-normal text-muted-foreground">(from volunteering, projects, college bio)</span>
        </Label>
        <Textarea id="interests" rows={2} {...register("interests")}
          className={cn("resize-none", fieldClass(errors.interests))} />
        {errors.interests && <p className="text-xs text-destructive">{errors.interests.message}</p>}
      </div>

      {/* Simulation Toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
        <div>
          <p className="text-sm font-medium">Simulation Enabled</p>
          <p className="text-xs text-muted-foreground">Agent will participate in active spatial simulation</p>
        </div>
        <Switch id="simulation_enabled" checked={simulationEnabled}
          onCheckedChange={(v) => setValue("simulation_enabled", v)} />
      </div>
    </form>
  );
}
