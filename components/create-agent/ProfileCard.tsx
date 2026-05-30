"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Cpu,
  Navigation,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LinkedInProfile } from "@/lib/types";
import { googleMapsUrl } from "@/lib/geocoding";

interface ProfileCardProps {
  profile: LinkedInProfile;
  isSelected: boolean;
  onSelect: (profile: LinkedInProfile) => void;
}

function CoordPill({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  return (
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[10px] font-mono bg-muted/80 hover:bg-muted border border-border/60 rounded px-1.5 py-0.5 text-muted-foreground hover:text-foreground transition-colors"
      title={`Open ${label} on Google Maps`}
    >
      <Navigation className="h-2.5 w-2.5 shrink-0" />
      {lat.toFixed(4)}, {lng.toFixed(4)}
    </a>
  );
}

export function ProfileCard({ profile, isSelected, onSelect }: ProfileCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { resolved_home, resolved_work, computed_age, graduation_year, graduation_age } = profile;

  return (
    <div
      className={cn(
        "relative rounded-xl border-2 bg-card transition-all duration-200 overflow-hidden",
        isSelected
          ? "border-primary shadow-md shadow-primary/10"
          : "border-border hover:border-border/80 hover:shadow-sm"
      )}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
          <Check className="h-3 w-3" />
          Selected
        </div>
      )}

      <div className="p-4">
        <div className="flex gap-3">
          <div className="shrink-0">
            {profile.profile_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.profile_image}
                alt={profile.name}
                className="w-14 h-14 rounded-full border-2 border-border bg-muted"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              <div className="w-14 h-14 rounded-full border-2 border-border bg-muted flex items-center justify-center">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight">{profile.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{profile.headline}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="text-xs">{profile.current_role}</Badge>
              <Badge variant="outline" className="text-xs">{profile.industry}</Badge>
            </div>
          </div>
        </div>

        {/* Core computed info — always visible */}
        <div className="mt-3 space-y-1.5 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="h-3.5 w-3.5 shrink-0 text-violet-400" />
            <span>
              Graduated {graduation_year} · Age {graduation_age} → computed age{" "}
              <span className="font-semibold text-foreground">{computed_age}</span>
            </span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-rose-400 mt-0.5" />
            <div className="min-w-0">
              <span className="text-muted-foreground">Home: </span>
              <span className="text-foreground">{resolved_home.display_name}</span>
              <div className="mt-0.5">
                <CoordPill lat={resolved_home.coordinates.lat} lng={resolved_home.coordinates.lng} label="home" />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Briefcase className="h-3.5 w-3.5 shrink-0 text-blue-400 mt-0.5" />
            <div className="min-w-0">
              <span className="text-muted-foreground">Work: </span>
              <span className="text-foreground">{resolved_work.display_name}</span>
              <div className="mt-0.5">
                <CoordPill lat={resolved_work.coordinates.lat} lng={resolved_work.coordinates.lng} label="work" />
              </div>
            </div>
          </div>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 space-y-3 border-t pt-3">
            {profile.personal_summary && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Summary</p>
                <p className="text-xs text-foreground/80 leading-relaxed">{profile.personal_summary}</p>
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Skills</p>
              <div className="flex flex-wrap gap-1">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs font-normal">{skill}</Badge>
                ))}
              </div>
            </div>

            {profile.work_experience.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                  <Briefcase className="inline h-3 w-3 mr-1" />Work History
                </p>
                <div className="space-y-1.5">
                  {profile.work_experience.map((exp, i) => (
                    <div key={i} className="text-xs">
                      <span className="font-medium">{exp.title}</span>
                      <span className="text-muted-foreground"> @ {exp.company}</span>
                      <span className="text-muted-foreground/60"> · {exp.duration_months}mo{exp.is_current ? " (current)" : ""}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile.education.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                  <GraduationCap className="inline h-3 w-3 mr-1" />Education
                </p>
                {profile.education.map((edu, i) => (
                  <div key={i} className="text-xs">
                    <span className="font-medium">{edu.school}</span>
                    {edu.degree && <span className="text-muted-foreground"> · {edu.degree} {edu.field}</span>}
                    <span className="text-muted-foreground/60"> · {edu.graduation_year}</span>
                    {edu.activities && <p className="text-muted-foreground/70 mt-0.5">{edu.activities}</p>}
                  </div>
                ))}
              </div>
            )}

            {profile.volunteering.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                  <Heart className="inline h-3 w-3 mr-1 text-rose-400" />Volunteering
                </p>
                <div className="space-y-1.5">
                  {profile.volunteering.map((v, i) => (
                    <div key={i} className="text-xs">
                      <span className="font-medium">{v.role}</span>
                      <span className="text-muted-foreground"> @ {v.organization}</span>
                      {v.cause && <Badge variant="outline" className="ml-1.5 text-[10px] py-0">{v.cause}</Badge>}
                      {v.description && <p className="text-muted-foreground/70 mt-0.5">{v.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile.projects.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                  <Cpu className="inline h-3 w-3 mr-1" />Projects
                </p>
                <div className="space-y-1.5">
                  {profile.projects.map((p, i) => (
                    <div key={i} className="text-xs">
                      <span className="font-medium">{p.name}</span>
                      {p.description && <p className="text-muted-foreground/80 mt-0.5">{p.description}</p>}
                      {p.skills && p.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {p.skills.map((s) => <Badge key={s} variant="outline" className="text-[10px] py-0">{s}</Badge>)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <a
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              View on LinkedIn
            </a>
          </div>
        )}
      </div>

      <div className="flex border-t">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex-1 flex items-center justify-center gap-1 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          {expanded ? <><ChevronUp className="h-3.5 w-3.5" /> Less</> : <><ChevronDown className="h-3.5 w-3.5" /> Details</>}
        </button>
        <div className="w-px bg-border" />
        <button
          onClick={() => onSelect(profile)}
          className={cn(
            "flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium transition-colors",
            isSelected
              ? "text-primary bg-primary/5 hover:bg-primary/10"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          {isSelected ? <><Check className="h-3.5 w-3.5" /> Selected</> : "Use for Agent"}
        </button>
      </div>
    </div>
  );
}

export function ProfileCardSkeleton() {
  return (
    <div className="rounded-xl border-2 border-border bg-card p-4 space-y-3 animate-pulse">
      <div className="flex gap-3">
        <div className="w-14 h-14 rounded-full bg-muted shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-3/4" />
          <div className="flex gap-1.5 mt-1">
            <div className="h-5 bg-muted rounded-full w-20" />
            <div className="h-5 bg-muted rounded-full w-16" />
          </div>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-3 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-4/5" />
        <div className="h-3 bg-muted rounded w-2/3" />
      </div>
    </div>
  );
}
