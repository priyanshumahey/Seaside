export interface Coordinates {
  lat: number;
  lng: number;
  address: string;
  label?: string;
}

export interface WorkExperience {
  title: string;
  company: string;
  start_date: string;
  end_date: string | null;
  duration_months: number;
  is_current: boolean;
  description?: string;
}

export interface Education {
  school: string;
  degree?: string;
  field?: string;
  graduation_year: number;
  activities?: string;
  description?: string;
}

export interface VolunteerEntry {
  role: string;
  organization: string;
  cause?: string;
  description?: string;
  duration_months?: number;
}

export interface ProjectEntry {
  name: string;
  description?: string;
  skills?: string[];
}

export interface LinkedInProfile {
  id: string;
  url: string;
  name: string;
  headline: string;
  current_role: string;
  company: string;
  raw_location: string;
  industry: string;
  skills: string[];
  experience_summary: string;
  profile_image: string;
  connections?: number;
  personal_summary?: string;

  work_experience: WorkExperience[];
  education: Education[];
  volunteering: VolunteerEntry[];
  projects: ProjectEntry[];

  resolved_home: ResolvedLocation;
  resolved_work: ResolvedLocation;

  computed_age: number;
  graduation_year: number;
  graduation_age: 21 | 22;

  raw?: Record<string, unknown>;
}

export interface ResolvedLocation {
  display_name: string;
  address: string;
  coordinates: Coordinates;
  source: "linkedin_raw" | "greater_seattle_default" | "company_hq" | "manual";
}

export interface AgentFormValues {
  agent_id: string;
  agent_name: string;
  age: number;
  personality_summary: string;
  interests: string;
  work_location: string;
  work_address: string;
  work_lat: number;
  work_lng: number;
  home_location: string;
  home_address: string;
  home_lat: number;
  home_lng: number;
  occupation_context: string;
  llm_type: string;
  simulation_enabled: boolean;
}

export interface CreateAgentPayload {
  agent_id: string;
  linkedin_profile: Partial<LinkedInProfile>;
  metadata: {
    age: number;
    personality_summary: string;
    interests: string;
    agent_name: string;
    occupation_context: string;
    llm_type: string;
    simulation_enabled: boolean;
  };
  spatial_anchors: {
    home_location: string;
    home_address: string;
    home_coordinates: Coordinates;
    work_location: string;
    work_address: string;
    work_coordinates: Coordinates;
  };
}

export interface ScrapeResponse {
  success: boolean;
  profiles: LinkedInProfile[];
  errors?: { url: string; message: string }[];
}

export interface CreateAgentResponse {
  success: boolean;
  agent_id: string;
  message: string;
}
