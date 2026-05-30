/**
 * Generates CSV exports for all 5 prebuilt agent profiles.
 * Run with:  node scripts/generate-csvs.mjs
 *
 * Output files (all written to data/):
 *   agents_all.csv           – all 5 agents, one row each (bulk import)
 *   agents_spatial.csv       – spatial anchors only (map/simulation use)
 *   agents_personality.csv   – personality + interests (LLM prompt use)
 *   agent_charlie.csv        – individual agent CSVs
 *   agent_anna.csv
 *   agent_connor.csv
 *   agent_valeria.csv
 *   agent_lily.csv
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "data");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

// ---------------------------------------------------------------------------
// Profile data (mirrors lib/mock-data.ts — kept in sync manually)
// ---------------------------------------------------------------------------
const PROFILES = [
  {
    agent_id:            "sea_agent_0001",
    agent_name:          "Charlie",
    real_name:           "Rupak Ghosh",
    linkedin_url:        "https://www.linkedin.com/in/rupak-ghosh-339847239/",
    age:                 22,
    graduation_year:     2025,
    graduation_age:      21,
    current_role:        "Data Analyst",
    company:             "GE Healthcare",
    industry:            "Healthcare Technology",
    home_location:       "Capitol Hill, Seattle",
    home_address:        "Broadway & E Pike St, Seattle, WA 98122",
    home_lat:            47.6254,
    home_lng:            -122.3192,
    work_location:       "GE Healthcare — Bellevue",
    work_address:        "500 108th Ave NE, Bellevue, WA 98004",
    work_lat:            47.6149,
    work_lng:            -122.2006,
    skills:              "Python; SQL; Data Analysis; Excel; Tableau; Machine Learning; Healthcare IT",
    personality_summary: "Analytical, Data-driven, Passionate",
    interests:           "bouldering; café culture; open source software; education & mentoring",
    occupation_context:  "Data Analyst at GE Healthcare Bellevue. Healthcare Technology industry. Commutes from Capitol Hill to Bellevue.",
    llm_type:            "gpt-4o",
    simulation_enabled:  true,
    volunteering:        "Tech Mentor @ Year Up (Education)",
    projects:            "Seattle Bouldering Route Tracker; Café Crawl Map",
    personal_summary:    "Loves bouldering and café culture. Morning café → 545 bus to Bellevue. Finds problem-solving in climbing walls like debugging code.",
    connections:         182,
  },
  {
    agent_id:            "sea_agent_0002",
    agent_name:          "Anna",
    real_name:           "Tanishka",
    linkedin_url:        "https://www.linkedin.com/in/reachtanishka/",
    age:                 21,
    graduation_year:     2026,
    graduation_age:      21,
    current_role:        "Student / Teaching Assistant",
    company:             "Seattle University",
    industry:            "Education / Technology",
    home_location:       "Redmond",
    home_address:        "15600 NE 8th St, Redmond, WA 98052",
    home_lat:            47.6740,
    home_lng:            -122.1215,
    work_location:       "Seattle University — First Hill",
    work_address:        "901 12th Ave, Seattle, WA 98122",
    work_lat:            47.6059,
    work_lng:            -122.3199,
    skills:              "Java; Python; React; UI/UX Design; Figma; HTML/CSS; Git",
    personality_summary: "Creative, Community-focused, Adaptable",
    interests:           "Thai cuisine; Gasworks Park; education & mentoring; environmental sustainability; accessible design",
    occupation_context:  "CS student at Seattle University. Reverse commutes from Redmond to First Hill. TA for Intro Programming.",
    llm_type:            "gpt-4o",
    simulation_enabled:  true,
    volunteering:        "Digital Literacy Instructor @ Asian Counseling and Referral Service; Gasworks Park Cleanup @ Seattle Parks Foundation",
    projects:            "Thai Restaurant Finder — Seattle; Accessible Campus Map",
    personal_summary:    "Loves Thai food (pad see ew — Pestle Rock Ballard) and Gasworks Park weekends. Reverse commuter from Redmond.",
    connections:         143,
  },
  {
    agent_id:            "sea_agent_0003",
    agent_name:          "Connor Thibault",
    real_name:           "Connor Thibault",
    linkedin_url:        "https://www.linkedin.com/in/connor-thibault-uw/",
    age:                 24,
    graduation_year:     2024,
    graduation_age:      22,
    current_role:        "Software Engineer I",
    company:             "Amazon",
    industry:            "Technology",
    home_location:       "Fremont, Seattle",
    home_address:        "3501 Fremont Ave N, Seattle, WA 98103",
    home_lat:            47.6506,
    home_lng:            -122.3501,
    work_location:       "Amazon HQ — South Lake Union",
    work_address:        "410 Terry Ave N, Seattle, WA 98109",
    work_lat:            47.6174,
    work_lng:            -122.3371,
    skills:              "Java; TypeScript; React; AWS; Docker; REST APIs; Distributed Systems; Python",
    personality_summary: "Analytical, Adaptable, Collaborative",
    interests:           "kayaking Lake Union; hiking Cascades; open source software; environmental sustainability",
    occupation_context:  "SWE I at Amazon AWS EC2 team. South Lake Union campus. UW CS 2024 grad.",
    llm_type:            "gpt-4o",
    simulation_enabled:  true,
    volunteering:        "Trail Crew Volunteer @ Washington Trails Association (Environment)",
    projects:            "Lake Union Paddling Conditions API",
    personal_summary:    "Pacific Northwest native. Kayaks Lake Union on weekends, hikes the Issaquah Alps. Fremont resident.",
    connections:         321,
  },
  {
    agent_id:            "sea_agent_0004",
    agent_name:          "Valeria Bravo",
    real_name:           "Valeria Bravo",
    linkedin_url:        "https://www.linkedin.com/in/valeria-bravo-4243ab32b/",
    age:                 25,
    graduation_year:     2022,
    graduation_age:      21,
    current_role:        "Marketing Coordinator",
    company:             "Nordstrom",
    industry:            "Consumer Technology / Retail",
    home_location:       "Columbia City, Seattle",
    home_address:        "4801 Rainier Ave S, Seattle, WA 98118",
    home_lat:            47.5597,
    home_lng:            -122.2907,
    work_location:       "Nordstrom HQ — Downtown Seattle",
    work_address:        "1617 6th Ave, Seattle, WA 98101",
    work_lat:            47.6116,
    work_lng:            -122.3341,
    skills:              "Content Strategy; Social Media; Adobe Creative Suite; Canva; Copywriting; Email Marketing; Spanish (native); Community Engagement",
    personality_summary: "Strategic, Community-focused, Communicative",
    interests:           "salsa dancing; Columbia City Farmers Market; social justice; arts & culture; Latin community",
    occupation_context:  "Marketing Coordinator at Nordstrom HQ, Downtown Seattle. Bilingual English/Spanish. South Seattle local.",
    llm_type:            "gpt-4o",
    simulation_enabled:  true,
    volunteering:        "Social Media Volunteer @ El Centro de la Raza; Salsa Dance Instructor @ Columbia City Arts",
    projects:            "South Seattle Business Spotlight blog",
    personal_summary:    "Born and raised South Seattle. Salsa dancer, farmers market regular, long runs along Lake Washington Blvd.",
    connections:         267,
  },
  {
    agent_id:            "sea_agent_0005",
    agent_name:          "Lily",
    real_name:           "Suyeon Cha",
    linkedin_url:        "https://www.linkedin.com/in/suyeoncha/",
    age:                 26,
    graduation_year:     2021,
    graduation_age:      21,
    current_role:        "UX Designer II",
    company:             "Microsoft",
    industry:            "Technology",
    home_location:       "Bellevue",
    home_address:        "10500 NE 8th St, Bellevue, WA 98004",
    home_lat:            47.6101,
    home_lng:            -122.2015,
    work_location:       "Microsoft Campus — Redmond",
    work_address:        "1 Microsoft Way, Redmond, WA 98052",
    work_lat:            47.6423,
    work_lng:            -122.1301,
    skills:              "UX Design; Figma; Prototyping; User Research; Interaction Design; Accessibility; Korean (native); HTML/CSS",
    personality_summary: "Creative, Methodical, Empathetic",
    interests:           "accessibility design; Bellevue Botanical Garden; K-drama screenwriting; photography; Korean-American community",
    occupation_context:  "UX Designer II at Microsoft Teams. Korean-American. Focuses on cross-cultural and accessibility design.",
    llm_type:            "gpt-4o",
    simulation_enabled:  true,
    volunteering:        "Design Mentor @ Korean Women in Tech Seattle; Garden Volunteer @ Bellevue Botanical Garden",
    projects:            "Halmoni UI (CHI Award winner); K-drama Script Archive",
    personal_summary:    "Korean-American designer. Bellevue Botanical Garden regular. K-drama screenwriter as a hobby. Long walks around Lake Sammamish.",
    connections:         408,
  },
];

// ---------------------------------------------------------------------------
// CSV helpers
// ---------------------------------------------------------------------------
function escape(val) {
  const s = String(val ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCsv(rows, columns) {
  const header = columns.join(",");
  const lines = rows.map((row) => columns.map((col) => escape(row[col])).join(","));
  return [header, ...lines].join("\n");
}

function write(filename, content) {
  const fp = path.join(OUT_DIR, filename);
  fs.writeFileSync(fp, content, "utf8");
  console.log(`  ✓  data/${filename}  (${content.split("\n").length - 1} row(s))`);
}

// ---------------------------------------------------------------------------
// 1. agents_all.csv  — full master sheet, all 5 agents
// ---------------------------------------------------------------------------
const ALL_COLUMNS = [
  "agent_id", "agent_name", "real_name", "linkedin_url",
  "age", "graduation_year", "graduation_age",
  "current_role", "company", "industry",
  "home_location", "home_address", "home_lat", "home_lng",
  "work_location", "work_address", "work_lat", "work_lng",
  "personality_summary", "interests", "occupation_context",
  "skills", "volunteering", "projects", "personal_summary",
  "llm_type", "simulation_enabled", "connections",
];
write("agents_all.csv", toCsv(PROFILES, ALL_COLUMNS));

// ---------------------------------------------------------------------------
// 2. agents_spatial.csv  — for map / simulation engine
// ---------------------------------------------------------------------------
const SPATIAL_COLUMNS = [
  "agent_id", "agent_name",
  "home_location", "home_address", "home_lat", "home_lng",
  "work_location", "work_address", "work_lat", "work_lng",
  "simulation_enabled",
];
write("agents_spatial.csv", toCsv(PROFILES, SPATIAL_COLUMNS));

// ---------------------------------------------------------------------------
// 3. agents_personality.csv  — for LLM prompt injection
// ---------------------------------------------------------------------------
const PERSONALITY_COLUMNS = [
  "agent_id", "agent_name",
  "age", "current_role", "company", "industry",
  "personality_summary", "interests", "personal_summary",
  "occupation_context", "skills", "volunteering", "projects",
  "llm_type",
];
write("agents_personality.csv", toCsv(PROFILES, PERSONALITY_COLUMNS));

// ---------------------------------------------------------------------------
// 4. agents_payload.csv  — mirrors the POST /agents/create JSON structure
// ---------------------------------------------------------------------------
const PAYLOAD_COLUMNS = [
  "agent_id", "agent_name", "linkedin_url",
  "age", "personality_summary", "interests", "occupation_context",
  "home_location", "home_address", "home_lat", "home_lng",
  "work_location", "work_address", "work_lat", "work_lng",
  "llm_type", "simulation_enabled",
];
write("agents_payload.csv", toCsv(PROFILES, PAYLOAD_COLUMNS));

// ---------------------------------------------------------------------------
// 5. Individual CSVs — one per agent, vertical key/value layout
// ---------------------------------------------------------------------------
const NAMES = ["charlie", "anna", "connor", "valeria", "lily"];
PROFILES.forEach((p, i) => {
  const lines = ["field,value", ...ALL_COLUMNS.map((col) => `${col},${escape(p[col])}`)];
  write(`agent_${NAMES[i]}.csv`, lines.join("\n"));
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log(`\nAll CSVs written to: ${OUT_DIR}\n`);
console.log("Files:");
console.log("  agents_all.csv         — master sheet (all 5 agents × all fields)");
console.log("  agents_spatial.csv     — coordinates only (for map / simulation)");
console.log("  agents_personality.csv — personality + interests (for LLM prompts)");
console.log("  agents_payload.csv     — API payload fields (for POST /agents/create)");
console.log("  agent_charlie.csv      — individual vertical sheet");
console.log("  agent_anna.csv");
console.log("  agent_connor.csv");
console.log("  agent_valeria.csv");
console.log("  agent_lily.csv");
