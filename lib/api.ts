import { CreateAgentPayload, CreateAgentResponse, ScrapeResponse } from "./types";
import { getMockProfileForUrl, MOCK_PROFILES } from "./mock-data";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function scrapeLinkedInProfiles(urls: string[]): Promise<ScrapeResponse> {
  if (USE_MOCK) {
    await sleep(1400 + Math.random() * 600);
    const knownUrls = MOCK_PROFILES.map((p) => p.url);
    const profiles = urls.map((url) => {
      const known = MOCK_PROFILES.find((p) => p.url === url || knownUrls.some((k) => k === url));
      return known ?? getMockProfileForUrl(url);
    });
    return { success: true, profiles };
  }

  const res = await fetch(`${API_BASE}/scrape-linkedin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urls }),
  });
  if (!res.ok) throw new Error(`Scrape failed: ${res.statusText}`);
  return res.json();
}

export async function createAgent(payload: CreateAgentPayload): Promise<CreateAgentResponse> {
  if (USE_MOCK) {
    await sleep(800);
    return { success: true, agent_id: payload.agent_id, message: `Agent ${payload.agent_id} created successfully (mock).` };
  }

  const res = await fetch(`${API_BASE}/agents/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Create agent failed: ${res.statusText}`);
  return res.json();
}

export function buildAgentPayload(
  form: import("./schema").AgentFormSchema,
  profile: Partial<import("./types").LinkedInProfile>
): CreateAgentPayload {
  return {
    agent_id: form.agent_id,
    linkedin_profile: profile,
    metadata: {
      age: form.age,
      personality_summary: form.personality_summary,
      interests: form.interests,
      agent_name: form.agent_name,
      occupation_context: form.occupation_context,
      llm_type: form.llm_type,
      simulation_enabled: form.simulation_enabled,
    },
    spatial_anchors: {
      home_location: form.home_location,
      home_address: form.home_address,
      home_coordinates: {
        lat: form.home_lat,
        lng: form.home_lng,
        address: form.home_address,
        label: form.home_location,
      },
      work_location: form.work_location,
      work_address: form.work_address,
      work_coordinates: {
        lat: form.work_lat,
        lng: form.work_lng,
        address: form.work_address,
        label: form.work_location,
      },
    },
  };
}
