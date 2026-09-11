#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
node -e 'const [major, minor] = process.versions.node.split(".").map(Number); if (major < 22 || (major === 22 && minor < 13)) { console.error("Use Node.js 22.13 or newer (Node 22 LTS recommended)."); process.exit(1); }'
npm ci --no-audit --no-fund
printf '%s\n' 'Dependencies installed. Read AGENTS.md and docs/CLOUD_WORK.md before starting.'
