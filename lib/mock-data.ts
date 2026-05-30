import { LinkedInProfile } from "./types";
import { resolveHomeLocation, resolveCompanyLocation } from "./geocoding";
import { computeAgeFromProfile, inferPersonalityFromProfile } from "./utils";

function buildProfile(
  raw: Omit<LinkedInProfile, "resolved_home" | "resolved_work" | "computed_age" | "graduation_year" | "graduation_age">
): LinkedInProfile {
  const home = resolveHomeLocation(raw.raw_location);
  const work = resolveCompanyLocation(raw.company);
  const { age, graduation_year, graduation_age } = computeAgeFromProfile(
    raw.work_experience,
    raw.education,
    raw.name
  );
  return { ...raw, resolved_home: home, resolved_work: work, computed_age: age, graduation_year, graduation_age };
}

// ---------------------------------------------------------------------------
// Agent 1 — Charlie (Rupak Ghosh)
// linkedin.com/in/rupak-ghosh-339847239
// 22 yrs old · Seattle → GE Healthcare Bellevue · bouldering · cafes
// ---------------------------------------------------------------------------
const CHARLIE: LinkedInProfile = buildProfile({
  id: "agent_001",
  url: "https://www.linkedin.com/in/rupak-ghosh-339847239/",
  name: "Charlie",
  headline: "Aspiring Data & Analytics Professional | GE Healthcare | Seattle",
  current_role: "Analyst",
  company: "GE Healthcare",
  raw_location: "Capitol Hill, Seattle, WA",
  industry: "Healthcare Technology",
  skills: ["Python", "SQL", "Data Analysis", "Excel", "Tableau", "Machine Learning", "Healthcare IT"],
  experience_summary:
    "22-year-old early-career data professional at GE Healthcare's Bellevue office. Commutes daily from Capitol Hill to Bellevue. Passionate about applying data science to real-world healthcare problems.",
  profile_image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Charlie&backgroundColor=b6e3f4",
  connections: 182,
  personal_summary:
    "I love the challenge of bouldering — every wall is a problem to solve, just like debugging a pipeline. You'll find me at a cozy Capitol Hill café most mornings before catching the 545 to Bellevue. Big believer that the best ideas come between a latte and a campus-style whiteboard.",
  work_experience: [
    {
      title: "Data Analyst",
      company: "GE Healthcare",
      start_date: "2025-07",
      end_date: null,
      duration_months: 11,
      is_current: true,
      description: "Analytics and reporting for medical device performance dashboards. Bellevue WA office.",
    },
    {
      title: "Data Science Intern",
      company: "GE Healthcare",
      start_date: "2024-06",
      end_date: "2024-08",
      duration_months: 3,
      is_current: false,
      description: "Summer internship — built ML model for predictive maintenance of imaging equipment.",
    },
  ],
  education: [
    {
      school: "University of Washington",
      degree: "B.S.",
      field: "Informatics",
      graduation_year: 2025,
      activities: "Climbing Club, Data Science Club, Undergraduate Research Assistant",
      description: "Capstone project: predictive readmission risk model for UW Medicine using EHR data.",
    },
  ],
  volunteering: [
    {
      role: "Tech Mentor",
      organization: "Year Up",
      cause: "Education",
      description: "Mentors young adults from underrepresented backgrounds in tech skills every other Saturday.",
    },
  ],
  projects: [
    {
      name: "Seattle Bouldering Route Tracker",
      description: "Personal app to log and rate indoor bouldering problems across Seattle gyms (Vertical World, Stone Gardens).",
      skills: ["Python", "SQLite", "Streamlit"],
    },
    {
      name: "Café Crawl Map",
      description: "Personal map of every Capitol Hill café ranked by pour-over quality and work-friendliness.",
      skills: [],
    },
  ],
});

// ---------------------------------------------------------------------------
// Agent 2 — Anna (Tanishka)
// linkedin.com/in/reachtanishka
// Seattle University student · lives in Redmond · Thai food · Gasworks
// ---------------------------------------------------------------------------
const ANNA: LinkedInProfile = buildProfile({
  id: "agent_002",
  url: "https://www.linkedin.com/in/reachtanishka/",
  name: "Anna",
  headline: "CS Student @ Seattle University | Software & Design | Redmond",
  current_role: "Student",
  company: "Seattle University",
  raw_location: "Redmond, WA",
  industry: "Education / Technology",
  skills: ["Java", "Python", "React", "UI/UX Design", "Figma", "HTML/CSS", "Git"],
  experience_summary:
    "Undergraduate computer science student at Seattle University commuting from Redmond. Passionate about human-centered design and accessible software. Weekend explorer — Gasworks Park is a regular spot.",
  profile_image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Anna&backgroundColor=ffd5dc",
  connections: 143,
  personal_summary:
    "Redmond girl studying in the city — I do the reverse commute most students don't. On weekends you'll find me at Gasworks watching the skyline, or hunting down the best pad see ew in Seattle (current leader: Pestle Rock in Ballard). I care deeply about making technology feel human.",
  work_experience: [
    {
      title: "Software Engineering Intern",
      company: "Microsoft",
      start_date: "2025-06",
      end_date: "2025-08",
      duration_months: 3,
      is_current: false,
      description: "Teams accessibility features — intern on the Inclusive Design team. Redmond campus.",
    },
    {
      title: "Student Teaching Assistant",
      company: "Seattle University",
      start_date: "2024-09",
      end_date: null,
      duration_months: 9,
      is_current: true,
      description: "TA for Intro to Programming (CS 1410). Hold weekly office hours.",
    },
  ],
  education: [
    {
      school: "Seattle University",
      degree: "B.S.",
      field: "Computer Science",
      graduation_year: 2026,
      activities: "Women in Tech Club, SU Hackathon Organizer, Southeast Asian Student Association",
      description: "Minor in Design. Member of the Redhawk Social Impact Lab.",
    },
  ],
  volunteering: [
    {
      role: "Digital Literacy Instructor",
      organization: "Asian Counseling and Referral Service",
      cause: "Education / Community",
      description: "Teaches basic computer skills and online safety to recent immigrants in the Redmond–Bellevue corridor.",
    },
    {
      role: "Gasworks Park Cleanup Volunteer",
      organization: "Seattle Parks Foundation",
      cause: "Environment",
      description: "Monthly park cleanup at Gasworks — her favorite park and her way of giving back to it.",
    },
  ],
  projects: [
    {
      name: "Thai Restaurant Finder — Seattle",
      description: "Personal React web app cataloging every Thai restaurant in Seattle with neighborhood filters and 'khao man gai score'.",
      skills: ["React", "Mapbox API", "Node.js"],
    },
    {
      name: "Accessible Campus Map",
      description: "Hackathon project — interactive accessibility map of Seattle University campus for wheelchair users.",
      skills: ["Figma", "React", "GeoJSON"],
    },
  ],
});

// ---------------------------------------------------------------------------
// Agent 3 — Connor Thibault
// linkedin.com/in/connor-thibault-uw
// UW connection · Seattle area
// ---------------------------------------------------------------------------
const CONNOR: LinkedInProfile = buildProfile({
  id: "agent_003",
  url: "https://www.linkedin.com/in/connor-thibault-uw/",
  name: "Connor Thibault",
  headline: "Software Engineer | UW CS '24 | Seattle",
  current_role: "Software Engineer",
  company: "Amazon",
  raw_location: "Fremont, Seattle, WA",
  industry: "Technology",
  skills: ["Java", "TypeScript", "React", "AWS", "Docker", "REST APIs", "Distributed Systems", "Python"],
  experience_summary:
    "Recent UW Computer Science grad now at Amazon. Pacific Northwest native who stayed local. Builds backend services by day and canoe-kayaks Lake Union on weekends.",
  profile_image: "https://api.dicebear.com/9.x/avataaars/svg?seed=ConnorThibault&backgroundColor=d1fae5",
  connections: 321,
  personal_summary:
    "Grew up in Bellingham, came down to UW, and never left Seattle — the mountains and the lakes keep me here. I work on AWS distributed services. Weekends: kayaking Lake Union, hiking the Issaquah Alps, and cooking elaborate Sunday breakfasts.",
  work_experience: [
    {
      title: "Software Engineer I",
      company: "Amazon",
      start_date: "2024-08",
      end_date: null,
      duration_months: 10,
      is_current: true,
      description: "AWS EC2 team — placement and scheduling backend services. South Lake Union campus.",
    },
    {
      title: "SDE Intern",
      company: "Amazon",
      start_date: "2023-06",
      end_date: "2023-09",
      duration_months: 3,
      is_current: false,
      description: "EC2 intern — built monitoring dashboard for instance health metrics.",
    },
  ],
  education: [
    {
      school: "University of Washington",
      degree: "B.S.",
      field: "Computer Science",
      graduation_year: 2024,
      activities: "Husky Sailing Club, CSE Undergrad Advisory Board, Intramural Soccer",
      description: "Emphasis in systems and distributed computing. Dean's List 2022–2024.",
    },
  ],
  volunteering: [
    {
      role: "Trail Crew Volunteer",
      organization: "Washington Trails Association",
      cause: "Environment",
      description: "Quarterly trail maintenance days in the Cascades. Started during freshman year.",
    },
  ],
  projects: [
    {
      name: "Lake Union Paddling Conditions API",
      description: "Hobby project pulling NOAA wind/wave data to give paddlers a quick daily conditions summary for Lake Union and Lake Washington.",
      skills: ["Python", "FastAPI", "NOAA API"],
    },
  ],
});

// ---------------------------------------------------------------------------
// Agent 4 — Valeria Bravo
// linkedin.com/in/valeria-bravo-4243ab32b
// ---------------------------------------------------------------------------
const VALERIA: LinkedInProfile = buildProfile({
  id: "agent_004",
  url: "https://www.linkedin.com/in/valeria-bravo-4243ab32b/",
  name: "Valeria Bravo",
  headline: "Marketing & Communications | Seattle | Community Storytelling",
  current_role: "Marketing Coordinator",
  company: "Nordstrom",
  raw_location: "Columbia City, Seattle, WA",
  industry: "Consumer Technology / Retail",
  skills: ["Content Strategy", "Social Media", "Adobe Creative Suite", "Canva", "Copywriting", "Email Marketing", "Spanish (native)", "Community Engagement"],
  experience_summary:
    "Marketing coordinator with a passion for authentic storytelling and community-driven campaigns. Bilingual (English / Spanish). Active in South Seattle arts and Latino cultural organizations.",
  profile_image: "https://api.dicebear.com/9.x/avataaars/svg?seed=ValeriaBravo&backgroundColor=fed7aa",
  connections: 267,
  personal_summary:
    "I tell stories that make brands feel human. Born and raised in South Seattle — Columbia City is home. I'm most proud of campaigns that center the communities they're speaking to, not just speaking at. Off the clock: salsa dancing, the Columbia City Farmers Market, and long runs along Lake Washington Blvd.",
  work_experience: [
    {
      title: "Marketing Coordinator",
      company: "Nordstrom",
      start_date: "2024-03",
      end_date: null,
      duration_months: 15,
      is_current: true,
      description: "Social media and email marketing for Nordstrom.com. Downtown Seattle HQ.",
    },
    {
      title: "Marketing Assistant",
      company: "Starbucks",
      start_date: "2022-09",
      end_date: "2024-02",
      duration_months: 17,
      is_current: false,
      description: "Supported regional community and cause marketing campaigns across the Pacific Northwest.",
    },
  ],
  education: [
    {
      school: "University of Washington",
      degree: "B.A.",
      field: "Communications & Marketing",
      graduation_year: 2022,
      activities: "Latina Leadership Network, UW Marketing Club, Volunteer Interpreter at Harborview Medical Center",
      description: "Thesis on Spanish-language social media strategy for Pacific Northwest small businesses.",
    },
  ],
  volunteering: [
    {
      role: "Social Media Volunteer",
      organization: "El Centro de la Raza",
      cause: "Social Justice / Latino Community",
      description: "Manages Instagram and Facebook for South Seattle's flagship Latino community center.",
    },
    {
      role: "Salsa Dance Instructor",
      organization: "Columbia City Arts",
      cause: "Arts & Culture",
      description: "Teaches beginner salsa/bachata classes on Friday evenings at the Columbia City community space.",
    },
  ],
  projects: [
    {
      name: "South Seattle Business Spotlight",
      description: "Personal blog series featuring immigrant-owned small businesses in Columbia City, Rainier Valley, and Beacon Hill.",
      skills: ["Squarespace", "Photography", "Copywriting"],
    },
  ],
});

// ---------------------------------------------------------------------------
// Agent 5 — Lily (Suyeon Cha)
// linkedin.com/in/suyeoncha
// ---------------------------------------------------------------------------
const LILY: LinkedInProfile = buildProfile({
  id: "agent_005",
  url: "https://www.linkedin.com/in/suyeoncha/",
  name: "Lily",
  headline: "UX Designer | Human-Computer Interaction | Seattle",
  current_role: "UX Designer",
  company: "Microsoft",
  raw_location: "Bellevue, WA",
  industry: "Technology",
  skills: ["UX Design", "Figma", "Prototyping", "User Research", "Interaction Design", "Accessibility", "Korean (native)", "HTML/CSS"],
  experience_summary:
    "UX designer specializing in cross-cultural design and accessible interfaces. Korean-American, fluent in English and Korean. Based in Bellevue, works on the Microsoft Teams design team.",
  profile_image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Lily&backgroundColor=c0aede",
  connections: 408,
  personal_summary:
    "I design for humans who don't look like Silicon Valley engineers — which is most people. Korean-American, grew up between Seoul and Bellevue. I care about accessibility not as a spec requirement but as a design philosophy. Outside work: K-drama screenwriting as a hobby, the Bellevue Botanical Garden, and very long walks around Lake Sammamish.",
  work_experience: [
    {
      title: "UX Designer II",
      company: "Microsoft",
      start_date: "2023-01",
      end_date: null,
      duration_months: 29,
      is_current: true,
      description: "Teams collaboration features — focused on meeting accessibility and East Asian language UX.",
    },
    {
      title: "UX Designer I",
      company: "Microsoft",
      start_date: "2021-08",
      end_date: "2022-12",
      duration_months: 16,
      is_current: false,
      description: "Microsoft Edge browser — cross-cultural UI patterns and localization UX.",
    },
    {
      title: "UX Research Intern",
      company: "Google",
      start_date: "2020-06",
      end_date: "2020-09",
      duration_months: 3,
      is_current: false,
      description: "Research intern on Google Translate — Korean-language UX study.",
    },
  ],
  education: [
    {
      school: "Carnegie Mellon University",
      degree: "B.Des.",
      field: "Communication Design",
      graduation_year: 2021,
      activities: "Korean Student Association, CMU Design Club, Accessibility Research Lab, Photography Club",
      description: "Senior thesis: Adapting gesture-based UI for Korean elderly users on mobile devices.",
    },
  ],
  volunteering: [
    {
      role: "Design Mentor",
      organization: "Korean Women in Tech — Seattle Chapter",
      cause: "Education / Diversity",
      description: "Monthly 1:1 mentorship sessions for Korean-American women entering UX and product roles.",
    },
    {
      role: "Garden Volunteer",
      organization: "Bellevue Botanical Garden",
      cause: "Environment",
      description: "Weekend volunteer in the Northwest Perennial Alliance garden — finds it meditative.",
    },
  ],
  projects: [
    {
      name: "Halmoni UI",
      description: "Personal project: redesigning a Korean banking app for elderly users. Won a CHI Student Design Award.",
      skills: ["Figma", "Prototyping", "User Research"],
    },
    {
      name: "K-drama Script Archive",
      description: "Hobby — writes short-form K-drama screenplays exploring immigrant identity in the Pacific Northwest.",
      skills: [],
    },
  ],
});

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
export const PREBUILT_PROFILES: LinkedInProfile[] = [
  CHARLIE,
  ANNA,
  CONNOR,
  VALERIA,
  LILY,
];

export const MOCK_PROFILES: LinkedInProfile[] = PREBUILT_PROFILES;

export function getMockProfileForUrl(url: string): LinkedInProfile {
  const slug = url.split("/in/")[1]?.replace(/[^a-z0-9]/gi, "").slice(0, 16) ?? "unknown";
  return buildProfile({
    id: `mock_${slug}`,
    url,
    name: `Profile (${slug})`,
    headline: "Professional @ Company | Industry Expert",
    current_role: "Senior Analyst",
    company: "Tech Corp",
    raw_location: "Greater Seattle Area",
    industry: "Technology",
    skills: ["Analysis", "Strategy", "Communication"],
    experience_summary: "Experienced professional.",
    profile_image: `https://api.dicebear.com/9.x/avataaars/svg?seed=${slug}&backgroundColor=d1fae5`,
    connections: 300,
    work_experience: [
      { title: "Senior Analyst", company: "Tech Corp", start_date: "2020-06", end_date: null, duration_months: 48, is_current: true },
    ],
    education: [
      { school: "University of Washington", degree: "B.S.", field: "Business", graduation_year: 2020, activities: "" },
    ],
    volunteering: [],
    projects: [],
  });
}
