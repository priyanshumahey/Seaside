"use client";

import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, Check, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LinkedInProfile } from "@/lib/types";
import { PREBUILT_PROFILES } from "@/lib/mock-data";

interface PrebuiltProfilesProps {
  onSelect: (profile: LinkedInProfile) => void;
  selectedId?: string;
}

const INDUSTRY_COLORS: Record<string, string> = {
  "Technology":                    "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "Real Estate Technology":        "bg-violet-500/10 text-violet-600 border-violet-500/20",
  "Travel Technology":             "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "Consumer Technology / Retail":  "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

export function PrebuiltProfiles({ onSelect, selectedId }: PrebuiltProfilesProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-amber-500/10 transition-colors text-left"
      >
        <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Prebuilt Seattle Profiles</p>
          <p className="text-xs text-muted-foreground">5 ready-to-use agent archetypes — click to load instantly</p>
        </div>
        {expanded
          ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
          : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {PREBUILT_PROFILES.map((profile) => {
            const isSelected = selectedId === profile.id;
            const industryClass = INDUSTRY_COLORS[profile.industry] ?? "bg-muted text-muted-foreground border-border";

            return (
              <button
                key={profile.id}
                onClick={() => onSelect(profile)}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-center transition-all duration-150 hover:shadow-sm",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                    : "border-border bg-background hover:border-border/80"
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}

                {profile.profile_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.profile_image}
                    alt={profile.name}
                    className="w-12 h-12 rounded-full border-2 border-border bg-muted"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full border-2 border-border bg-muted flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}

                <div className="space-y-1 w-full">
                  <p className="text-xs font-semibold leading-tight">{profile.name}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">
                    {profile.current_role}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">{profile.company}</p>

                  <span className={cn("inline-block text-[10px] px-2 py-0.5 rounded-full border font-medium", industryClass)}>
                    {profile.industry.split(" / ")[0]}
                  </span>

                  <div className="pt-1 flex flex-col gap-0.5 text-[9px] text-muted-foreground font-mono">
                    <span>🏠 {profile.resolved_home.coordinates.lat.toFixed(4)}, {profile.resolved_home.coordinates.lng.toFixed(4)}</span>
                    <span>💼 {profile.resolved_work.coordinates.lat.toFixed(4)}, {profile.resolved_work.coordinates.lng.toFixed(4)}</span>
                    <span className="text-foreground/60">Age {profile.computed_age} · Grad {profile.graduation_year}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
