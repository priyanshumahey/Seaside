"use client";

import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Bot, CheckCircle2, AlertTriangle, Cpu, Link2, User, Zap, ChevronRight, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LinkedInInput } from "./LinkedInInput";
import { ProfileCard, ProfileCardSkeleton } from "./ProfileCard";
import { AgentEditor } from "./AgentEditor";
import { PayloadPreview } from "./PayloadPreview";
import { PrebuiltProfiles } from "./PrebuiltProfiles";
import { scrapeLinkedInProfiles, createAgent, buildAgentPayload } from "@/lib/api";
import { LinkedInProfile } from "@/lib/types";
import type { AgentFormSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4;

function StepIndicator({
  step, current, label, icon: Icon,
}: {
  step: Step; current: Step; label: string; icon: React.ElementType;
}) {
  const done = current > step;
  const active = current === step;
  return (
    <div className={cn("flex items-center gap-2 text-sm", done || active ? "text-foreground" : "text-muted-foreground")}>
      <div className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold transition-colors",
        done && "bg-primary text-primary-foreground",
        active && "bg-primary/15 text-primary ring-2 ring-primary",
        !done && !active && "bg-muted text-muted-foreground"
      )}>
        {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
      </div>
      <span className={cn("hidden sm:block font-medium", active && "text-primary")}>{label}</span>
    </div>
  );
}

export function CreateAgentPage() {
  const [currentStep, setCurrentStep]         = useState<Step>(1);
  const [profiles, setProfiles]               = useState<LinkedInProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<LinkedInProfile | null>(null);
  const [formValues, setFormValues]           = useState<AgentFormSchema | null>(null);
  const [successResult, setSuccessResult]     = useState<{ agent_id: string; message: string } | null>(null);

  const scrapeMutation = useMutation({
    mutationFn: scrapeLinkedInProfiles,
    onSuccess: (data) => {
      setProfiles(data.profiles);
      if (data.profiles.length === 1) { setSelectedProfile(data.profiles[0]); setCurrentStep(3); }
      else setCurrentStep(2);
    },
  });

  const createMutation = useMutation({
    mutationFn: createAgent,
    onSuccess: (data) => { setSuccessResult({ agent_id: data.agent_id, message: data.message }); setCurrentStep(4); },
  });

  const handleFormChange = useCallback((values: AgentFormSchema) => setFormValues(values), []);

  const payload = formValues && selectedProfile ? buildAgentPayload(formValues, selectedProfile) : null;

  function handleSelectProfile(profile: LinkedInProfile) { setSelectedProfile(profile); setCurrentStep(3); }

  function handlePrebuiltSelect(profile: LinkedInProfile) {
    setProfiles([profile]);
    setSelectedProfile(profile);
    setCurrentStep(3);
  }

  function handleCreateAgent() { if (payload) createMutation.mutate(payload); }

  function reset() {
    setCurrentStep(1); setProfiles([]); setSelectedProfile(null); setFormValues(null); setSuccessResult(null);
    scrapeMutation.reset(); createMutation.reset();
  }

  if (successResult) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Agent Created</h2>
            <p className="text-muted-foreground mt-1">{successResult.message}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border font-mono text-sm">{successResult.agent_id}</div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1" onClick={reset}>Create Another</Button>
            <Button className="flex-1">View Agent Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-semibold leading-none">SEA Agent Dashboard</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Seattle Simulation Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            {([
              { step: 1 as Step, label: "LinkedIn", icon: Link2 },
              { step: 2 as Step, label: "Preview",  icon: User  },
              { step: 3 as Step, label: "Configure",icon: Cpu   },
              { step: 4 as Step, label: "Create",   icon: Zap   },
            ] as const).map(({ step, label, icon }, i, arr) => (
              <div key={step} className="flex items-center gap-1 sm:gap-3">
                <StepIndicator step={step} current={currentStep} label={label} icon={icon} />
                {i < arr.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* ── Prebuilt Profiles ─────────────────────────────────────── */}
        <PrebuiltProfiles
          onSelect={handlePrebuiltSelect}
          selectedId={selectedProfile?.id}
        />

        <Separator />

        {/* ── Section 1 — LinkedIn Input ────────────────────────────── */}
        <section className={cn(
          "rounded-2xl border bg-card p-6 space-y-4 transition-opacity",
          currentStep > 1 && "opacity-60 hover:opacity-100"
        )}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Link2 className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <h2 className="font-semibold">Analyze a New LinkedIn Profile</h2>
              <p className="text-xs text-muted-foreground">Paste one or more URLs — the scraper will extract and resolve all fields</p>
            </div>
            {currentStep > 1 && profiles.length > 0 && (
              <Badge variant="secondary" className="ml-auto text-xs">{profiles.length} scraped</Badge>
            )}
          </div>

          {scrapeMutation.isError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {(scrapeMutation.error as Error)?.message ?? "Scrape failed. Try again."}
            </div>
          )}

          <LinkedInInput onScrape={(urls) => scrapeMutation.mutate(urls)} isLoading={scrapeMutation.isPending} />
        </section>

        {/* ── Section 2 — Profile Preview ───────────────────────────── */}
        {(scrapeMutation.isPending || profiles.length > 0) && (
          <>
            <Separator />
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-violet-500" />
                </div>
                <div>
                  <h2 className="font-semibold">Scraped Profiles</h2>
                  <p className="text-xs text-muted-foreground">Grad year → age, company → Seattle office coordinates, personality from volunteering &amp; projects</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {scrapeMutation.isPending
                  ? Array.from({ length: 3 }).map((_, i) => <ProfileCardSkeleton key={i} />)
                  : profiles.map((profile) => (
                      <ProfileCard
                        key={profile.id}
                        profile={profile}
                        isSelected={selectedProfile?.id === profile.id}
                        onSelect={handleSelectProfile}
                      />
                    ))}
              </div>
            </section>
          </>
        )}

        {/* ── Section 3 — Agent Editor ──────────────────────────────── */}
        {(currentStep >= 3 || selectedProfile) && (
          <>
            <Separator />
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Cpu className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <h2 className="font-semibold">AI Agent Configuration</h2>
                  <p className="text-xs text-muted-foreground">All fields auto-filled from scraped data — edit before creating</p>
                </div>
                {selectedProfile && (
                  <Badge variant="outline" className="ml-auto text-xs gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Auto-filled from {selectedProfile.name}
                  </Badge>
                )}
              </div>
              <AgentEditor profile={selectedProfile} onChange={handleFormChange} />
            </section>
          </>
        )}

        {/* ── Section 4 — Create Agent ──────────────────────────────── */}
        {currentStep >= 3 && (
          <>
            <Separator />
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <h2 className="font-semibold">Create Agent</h2>
                  <p className="text-xs text-muted-foreground">Review the normalized payload, then deploy to the simulation engine</p>
                </div>
              </div>

              {payload && <PayloadPreview payload={payload} />}

              {createMutation.isError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {(createMutation.error as Error)?.message ?? "Creation failed. Try again."}
                </div>
              )}

              <Button size="lg" className="w-full gap-2 text-base" onClick={handleCreateAgent}
                disabled={!payload || createMutation.isPending}>
                {createMutation.isPending ? (
                  <><div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> Creating Agent…</>
                ) : (
                  <><Bot className="h-5 w-5" /> Create AI Agent</>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                {process.env.NEXT_PUBLIC_USE_MOCK !== "false"
                  ? "Running in mock mode — no real API calls made"
                  : `Targeting ${process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000"}`}
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
