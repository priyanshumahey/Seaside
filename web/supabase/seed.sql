-- Seed: 5 Seattle pseudo-agents from Seaside/pseudo_agents CSVs
-- Run AFTER migration_001_add_coordinates.sql
-- Safe to re-run (uses ON CONFLICT DO NOTHING keyed on agent_id column which
-- we add here as a stable text slug; falls back to name if already present).

-- Ensure we have a stable slug column so seeds are idempotent
ALTER TABLE agents ADD COLUMN IF NOT EXISTS agent_id text UNIQUE;

INSERT INTO agents
  (agent_id, name, age, job_description,
   location_home, home_lat, home_lng,
   location_work, work_lat, work_lng,
   interests, occupation_context, personality,
   profile_pic)
VALUES
  -- ── Charlie ─────────────────────────────────────────────────────────────
  ('sea_agent_0001',
   'Charlie', 22,
   'Data Analyst at GE Healthcare — Bellevue. Healthcare Technology industry.',
   'Capitol Hill, Seattle',  47.6254, -122.3192,
   'GE Healthcare — Bellevue', 47.6149, -122.2006,
   'bouldering; café culture; open source software; education & mentoring',
   'Data Analyst at GE Healthcare Bellevue. Commutes Capitol Hill → Bellevue on the 545 express bus.',
   'Analytical, Data-driven, Passionate. Finds problem-solving in climbing walls like debugging code.',
   '{"sex":"man","faceColor":"#F9C9B6","earSize":"small","hairColor":"#090806","hairStyle":"thick","hatStyle":"none","eyeStyle":"oval","glassesStyle":"round","noseStyle":"short","mouthStyle":"smile","shirtStyle":"polo","shirtColor":"#5562B9","bgColor":"#FFEDEF","earRing":"none","shape":"circle"}'::jsonb),

  -- ── Anna ─────────────────────────────────────────────────────────────────
  ('sea_agent_0002',
   'Anna', 21,
   'CS Student & Teaching Assistant at Seattle University — First Hill.',
   'Redmond', 47.6740, -122.1215,
   'Seattle University — First Hill', 47.6059, -122.3199,
   'Thai cuisine; Gasworks Park; education & mentoring; environmental sustainability; accessible design',
   'CS student at Seattle University. Reverse-commutes from Redmond to First Hill. TA for Intro Programming.',
   'Creative, Community-focused, Adaptable. Loves pad see ew at Pestle Rock Ballard. Gasworks Park weekends.',
   '{"sex":"woman","faceColor":"#F9C9B6","earSize":"small","hairColor":"#090806","hairStyle":"womanLong","hatStyle":"none","eyeStyle":"smile","glassesStyle":"none","noseStyle":"short","mouthStyle":"laugh","shirtStyle":"short","shirtColor":"#FF8F6B","bgColor":"#D2EFF3","earRing":"stud","shape":"circle"}'::jsonb),

  -- ── Connor ───────────────────────────────────────────────────────────────
  ('sea_agent_0003',
   'Connor Thibault', 24,
   'Software Engineer I at Amazon AWS EC2 — South Lake Union.',
   'Fremont, Seattle', 47.6506, -122.3501,
   'Amazon HQ — South Lake Union', 47.6174, -122.3371,
   'kayaking Lake Union; hiking Cascades; open source software; environmental sustainability',
   'SWE I at Amazon AWS EC2 team. South Lake Union campus. UW CS class of 2024. Pacific Northwest native.',
   'Analytical, Adaptable, Collaborative. Kayaks Lake Union on weekends. Hikes the Issaquah Alps.',
   '{"sex":"man","faceColor":"#F9C9B6","earSize":"big","hairColor":"#D2B344","hairStyle":"mohawk","hatStyle":"none","eyeStyle":"circle","glassesStyle":"none","noseStyle":"long","mouthStyle":"peace","shirtStyle":"hoody","shirtColor":"#4CAF50","bgColor":"#FFEDEF","earRing":"none","shape":"circle"}'::jsonb),

  -- ── Valeria ──────────────────────────────────────────────────────────────
  ('sea_agent_0004',
   'Valeria Bravo', 25,
   'Marketing Coordinator at Nordstrom HQ — Downtown Seattle.',
   'Columbia City, Seattle', 47.5597, -122.2907,
   'Nordstrom HQ — Downtown Seattle', 47.6116, -122.3341,
   'salsa dancing; Columbia City Farmers Market; social justice; arts & culture; Latin community',
   'Marketing Coordinator at Nordstrom HQ, Downtown Seattle. Bilingual English/Spanish. South Seattle local.',
   'Strategic, Community-focused, Communicative. Born and raised South Seattle. Salsa dancer, farmers market regular.',
   '{"sex":"woman","faceColor":"#D78774","earSize":"small","hairColor":"#090806","hairStyle":"womanShort","hatStyle":"none","eyeStyle":"oval","glassesStyle":"none","noseStyle":"short","mouthStyle":"smile","shirtStyle":"short","shirtColor":"#E91E8C","bgColor":"#FFEBA4","earRing":"hoop","shape":"circle"}'::jsonb),

  -- ── Lily ─────────────────────────────────────────────────────────────────
  ('sea_agent_0005',
   'Lily', 26,
   'UX Designer II at Microsoft Teams — Redmond Campus.',
   'Bellevue', 47.6101, -122.2015,
   'Microsoft Campus — Redmond', 47.6423, -122.1301,
   'accessibility design; Bellevue Botanical Garden; K-drama screenwriting; photography; Korean-American community',
   'UX Designer II at Microsoft Teams. Korean-American. Focuses on cross-cultural and accessibility design. CHI award winner.',
   'Creative, Methodical, Empathetic. Bellevue Botanical Garden regular. K-drama screenwriter as a hobby.',
   '{"sex":"woman","faceColor":"#F2D3B1","earSize":"small","hairColor":"#090806","hairStyle":"womanLong","hatStyle":"none","eyeStyle":"smile","glassesStyle":"round","noseStyle":"short","mouthStyle":"smile","shirtStyle":"short","shirtColor":"#9C27B0","bgColor":"#E0F7FA","earRing":"stud","shape":"circle"}'::jsonb)

ON CONFLICT (agent_id) DO NOTHING;
