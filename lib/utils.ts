import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { WorkExperience, Education, VolunteerEntry, ProjectEntry } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let counter = 1;
export function generateAgentId(): string {
  const id = String(counter).padStart(4, "0");
  counter += 1;
  return `sea_agent_${id}`;
}

// ---------------------------------------------------------------------------
// Age Inference
// ---------------------------------------------------------------------------

/**
 * Calculates age from graduation year using the following logic:
 * 1. Pick age at graduation: 21 or 22 (seeded random based on name)
 * 2. Calculate current year from graduation
 * 3. Add only non-overlapping work months (prefer longer role on overlaps)
 */
export function computeAgeFromProfile(
  experience: WorkExperience[],
  education: Education[],
  nameSeed: string
): { age: number; graduation_year: number; graduation_age: 21 | 22 } {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Find earliest graduation year
  const sortedEdu = [...education].sort((a, b) => a.graduation_year - b.graduation_year);
  const gradYear = sortedEdu[0]?.graduation_year ?? currentYear - 8;

  // Seed-deterministic choice of 21 or 22
  const seedSum = nameSeed.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const gradAge: 21 | 22 = seedSum % 2 === 0 ? 21 : 22;

  // Resolve non-overlapping experience months
  const nonOverlappingMonths = resolveNonOverlappingExperience(experience);

  // Base age = what age they were at grad + years since grad
  const yearsSinceGrad = currentYear - gradYear + (currentMonth / 12);
  const computedAge = Math.round(gradAge + yearsSinceGrad);

  return {
    age: Math.max(22, Math.min(70, computedAge)),
    graduation_year: gradYear,
    graduation_age: gradAge,
  };
}

/**
 * Resolves overlapping work experience by keeping the longer role
 * in any overlap window, then summing total months.
 */
export function resolveNonOverlappingExperience(experience: WorkExperience[]): number {
  if (experience.length === 0) return 0;

  // Convert to timeline segments [startMonths, endMonths, duration]
  const base = new Date("2000-01-01").getTime();
  type Segment = { start: number; end: number; duration: number };

  const segments: Segment[] = experience
    .map((e) => {
      const start = parseMonthOffset(e.start_date, base);
      const end = e.is_current
        ? (Date.now() - base) / (1000 * 60 * 60 * 24 * 30.44)
        : parseMonthOffset(e.end_date ?? e.start_date, base);
      return { start, end, duration: e.duration_months };
    })
    .sort((a, b) => a.start - b.start);

  // Merge overlapping segments keeping longer
  const merged: Segment[] = [];
  for (const seg of segments) {
    const last = merged[merged.length - 1];
    if (last && seg.start < last.end) {
      // Overlap — keep the segment that ends later (longer)
      if (seg.end > last.end) merged[merged.length - 1] = { start: last.start, end: seg.end, duration: seg.end - last.start };
      // else discard the shorter overlapping role
    } else {
      merged.push({ ...seg });
    }
  }

  return Math.round(merged.reduce((sum, s) => sum + (s.end - s.start), 0));
}

function parseMonthOffset(dateStr: string, base: number): number {
  const d = new Date(dateStr + "-01");
  return (d.getTime() - base) / (1000 * 60 * 60 * 24 * 30.44);
}

// ---------------------------------------------------------------------------
// Personality Inference
// ---------------------------------------------------------------------------

export interface InferredPersonality {
  summary: string;
  interests: string;
  traits: string[];
}

export function inferPersonalityFromProfile(profile: {
  headline: string;
  skills: string[];
  industry: string;
  personal_summary?: string;
  education: Education[];
  volunteering: VolunteerEntry[];
  projects: ProjectEntry[];
  work_experience: WorkExperience[];
}): InferredPersonality {
  const traits: string[] = [];
  const interests: string[] = [];

  const h = (profile.headline ?? "").toLowerCase();
  const s = (profile.skills ?? []).join(" ").toLowerCase();
  const summary = (profile.personal_summary ?? "").toLowerCase();
  const eduActivities = (profile.education ?? []).map((e) => (e.activities ?? "") + " " + (e.description ?? "")).join(" ").toLowerCase();
  const volText = (profile.volunteering ?? []).map((v) => (v.role ?? "") + " " + (v.cause ?? "") + " " + (v.description ?? "")).join(" ").toLowerCase();
  const projText = (profile.projects ?? []).map((p) => (p.name ?? "") + " " + (p.description ?? "")).join(" ").toLowerCase();
  const allText = [h, s, summary, eduActivities, volText, projText].join(" ");

  // Core personality traits from role/headline
  if (h.includes("senior") || h.includes("staff") || h.includes("principal") || h.includes("lead")) traits.push("analytical");
  if (h.includes("product") || h.includes("strategy") || h.includes("growth")) traits.push("strategic");
  if (h.includes("research") || h.includes("scientist") || h.includes("phd")) traits.push("methodical");
  if (h.includes("founder") || h.includes("ceo") || h.includes("entrepreneur")) traits.push("entrepreneurial");
  if (h.includes("design") || h.includes("ux") || h.includes("creative")) traits.push("creative");
  if (h.includes("manager") || h.includes("director") || h.includes("vp")) traits.push("leadership-oriented");

  // Skills-based traits
  if (s.includes("python") || s.includes("data") || s.includes("ml") || s.includes("ai")) traits.push("data-driven");
  if (s.includes("public speaking") || s.includes("communication")) traits.push("communicative");
  if (s.includes("mentoring") || s.includes("coaching")) traits.push("mentorship-oriented");
  if (s.includes("agile") || s.includes("scrum")) traits.push("adaptable");

  // Summary / personal bio traits
  if (summary.includes("passion") || summary.includes("love") || summary.includes("excited")) traits.push("passionate");
  if (summary.includes("community") || summary.includes("impact")) traits.push("community-focused");
  if (summary.includes("curious") || summary.includes("learn")) traits.push("intellectually curious");

  // Volunteering-based interests
  if (volText.includes("environment") || volText.includes("climate") || volText.includes("sustainab")) {
    interests.push("environmental sustainability");
    traits.push("socially conscious");
  }
  if (volText.includes("education") || volText.includes("teach") || volText.includes("tutor")) {
    interests.push("education & mentoring");
  }
  if (volText.includes("food") || volText.includes("hunger") || volText.includes("community kitchen")) {
    interests.push("food security & community");
  }
  if (volText.includes("art") || volText.includes("music") || volText.includes("theater")) {
    interests.push("arts & culture");
  }
  if (volText.includes("animal") || volText.includes("rescue") || volText.includes("shelter")) {
    interests.push("animal welfare");
  }

  // Project/side-project interests
  if (projText.includes("open source") || projText.includes("github")) interests.push("open source software");
  if (projText.includes("urban") || projText.includes("city") || projText.includes("transit")) interests.push("urban planning & transit");
  if (projText.includes("fitness") || projText.includes("health") || projText.includes("wellness")) interests.push("health & fitness");
  if (projText.includes("game") || projText.includes("gaming")) interests.push("gaming");
  if (projText.includes("music")) interests.push("music");
  if (projText.includes("photography") || projText.includes("photo")) interests.push("photography");
  if (projText.includes("travel") || projText.includes("hiking") || projText.includes("outdoor")) interests.push("travel & outdoors");

  // Education activities
  if (eduActivities.includes("debate") || eduActivities.includes("model un")) interests.push("debate & public policy");
  if (eduActivities.includes("sport") || eduActivities.includes("athlet")) interests.push("sports & athletics");
  if (eduActivities.includes("club") || eduActivities.includes("society")) traits.push("socially engaged");

  // Deduplicate
  const uniqueTraits = [...new Set(traits)].slice(0, 5);
  const uniqueInterests = [...new Set(interests)].slice(0, 4);

  if (uniqueTraits.length < 3) uniqueTraits.push("collaborative", "socially selective");

  const personalitySummary = uniqueTraits
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
    .join(", ");

  const interestsSummary =
    uniqueInterests.length > 0
      ? uniqueInterests.join("; ")
      : "professional development, community engagement";

  return {
    summary: personalitySummary,
    interests: interestsSummary,
    traits: uniqueTraits,
  };
}

// ---------------------------------------------------------------------------
// Legacy shim (used in mock data helpers)
// ---------------------------------------------------------------------------
export function inferPersonality(profile: { headline: string; skills: string[]; industry: string }): string {
  return inferPersonalityFromProfile({
    ...profile,
    education: [],
    volunteering: [],
    projects: [],
    work_experience: [],
  }).summary;
}

export function inferAge(experienceSummary: string): number {
  const yearsMatch = experienceSummary.match(/(\d+)\s+year/i);
  if (yearsMatch) {
    const years = parseInt(yearsMatch[1], 10);
    return Math.min(65, Math.max(22, 22 + years));
  }
  return 34;
}

export function extractLocation(location: string): { home: string; work: string } {
  const parts = location.split(",").map((s) => s.trim());
  return { home: parts[0] ?? location, work: parts[0] ?? location };
}
