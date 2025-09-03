// scripts/sync-tokens.js
// Sync latest design tokens from a Git repo into this project.
// Supports public or private repos via GITHUB_TOKEN env.
// Usage: node scripts/sync-tokens.js

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const TOKENS_REPO = process.env.TOKENS_REPO || "https://github.com/your-org/symbiosoai-design-tokens.git";
const TOKENS_BRANCH = process.env.TOKENS_BRANCH || "main";
const DEST_DIR = "tokens"; // where tokens should end up in the app

const TMP_DIR = ".tmp_tokens_repo";

function sh(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

function withAuth(url) {
  const token = process.env.GITHUB_TOKEN || process.env.PAT || "";
  if (!token) return url;
  // inject token into https URL: https://<token>@github.com/...
  return url.replace("https://", `https://${token}@`);
}

function main() {
  console.log("🔄 Syncing design tokens...");
  const repoUrl = withAuth(TOKENS_REPO);

  // Clean temp dir
  if (fs.existsSync(TMP_DIR)) fs.rmSync(TMP_DIR, { recursive: true, force: true });

  // Clone shallow
  sh(`git clone --depth 1 --branch ${TOKENS_BRANCH} ${repoUrl} ${TMP_DIR}`);

  // Determine source paths in the repo
  const candidates = [
    "tokens",
    "design-tokens",
    "dist/tokens",
  ];

  let srcPath = null;
  for (const c of candidates) {
    const p = path.join(TMP_DIR, c);
    if (fs.existsSync(p)) {
      srcPath = p;
      break;
    }
  }

  if (!srcPath) {
    console.error("❌ Could not find a tokens folder in the repo. Looked for:", candidates.join(", "));
    process.exit(1);
  }

  // Ensure destination
  if (!fs.existsSync(DEST_DIR)) fs.mkdirSync(DEST_DIR, { recursive: true });

  // Copy files
  fs.cpSync(srcPath, DEST_DIR, { recursive: true });
  console.log("✅ Tokens synced to", DEST_DIR);

  // Clean
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
}

main();
