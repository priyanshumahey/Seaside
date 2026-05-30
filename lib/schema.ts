import { z } from "zod";

export const agentFormSchema = z.object({
  agent_id: z
    .string()
    .min(1, "Agent ID is required")
    .regex(/^sea_agent_\d{4}$/, "Format: sea_agent_0001"),
  agent_name:          z.string().min(1, "Agent name is required"),
  age: z
    .number({ message: "Age must be a number" })
    .int("Age must be a whole number")
    .min(18, "Must be at least 18")
    .max(100, "Must be under 100"),
  personality_summary: z.string().min(5, "At least 5 characters").max(500),
  interests:           z.string().max(500),
  work_location:       z.string().min(1, "Work location is required"),
  work_address:        z.string(),
  work_lat:            z.number(),
  work_lng:            z.number(),
  home_location:       z.string().min(1, "Home location is required"),
  home_address:        z.string(),
  home_lat:            z.number(),
  home_lng:            z.number(),
  occupation_context:  z.string().min(1, "Occupation context is required"),
  llm_type:            z.string().min(1, "Select an LLM type"),
  simulation_enabled:  z.boolean(),
});

export type AgentFormSchema = z.infer<typeof agentFormSchema>;
