/**
 * Pushes all CSV files from data/ to priyanshumahey/sealantir
 * under web/app/pseudo_agents/ via the GitHub API (using gh auth token).
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR  = path.join(__dirname, "..", "data");
const REPO      = "priyanshumahey/sealantir";
const DEST_PATH = "web/app/pseudo_agents";

// Get token from gh CLI
const token = execSync("gh auth token", { encoding: "utf8" }).trim();

const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".csv"));

async function uploadFile(filename) {
  const content = fs.readFileSync(path.join(DATA_DIR, filename), "utf8");
  const b64     = Buffer.from(content, "utf8").toString("base64");
  const apiPath = `${DEST_PATH}/${filename}`;

  // Check if file already exists (need its SHA to update)
  let sha = undefined;
  const checkRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${apiPath}`,
    { headers: { Authorization: `Bearer ${token}`, "User-Agent": "sea-agent-dashboard" } }
  );
  if (checkRes.ok) {
    const existing = await checkRes.json();
    sha = existing.sha;
  }

  const body = {
    message: sha
      ? `chore: update pseudo_agents/${filename}`
      : `feat: add pseudo_agents/${filename}`,
    content: b64,
    ...(sha ? { sha } : {}),
  };

  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${apiPath}`,
    {
      method: "PUT",
      headers: {
        Authorization:  `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent":   "sea-agent-dashboard",
      },
      body: JSON.stringify(body),
    }
  );

  if (res.ok) {
    const data = await res.json();
    console.log(`  ✓  ${filename}  →  ${data.content.html_url}`);
  } else {
    const err = await res.text();
    console.error(`  ✗  ${filename}  [${res.status}]  ${err}`);
    process.exitCode = 1;
  }
}

console.log(`\nUploading ${files.length} CSVs to github.com/${REPO}/${DEST_PATH}/\n`);
for (const file of files) {
  await uploadFile(file);
}
console.log("\nDone.\n");
