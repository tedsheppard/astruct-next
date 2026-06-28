#!/usr/bin/env bash
# Fallback Sarah walk: navigate desktop Chrome via osascript, screenshot
# fullscreen via `screencapture -x` (works without Screen Recording perm
# for window IDs). No DOM poking — Sarah's judgment comes from me viewing
# the screenshots after.

set -uo pipefail
cd "$(dirname "$0")/.."

SHOTS=test-results/walk-and-fix/screenshots
AUDIT=test-results/walk-and-fix/audit.md
PERSONA=test-results/walk-and-fix/persona.md
mkdir -p "$SHOTS"

ts() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }
audit() { echo "[$(ts)] $1 | $2 | $3 | $4 | $5 | \"$6\"" >> "$AUDIT"; }
persona_md() { printf '%s\n\n' "$1" >> "$PERSONA"; }

COUNTER=0
next_n() { COUNTER=$((COUNTER + 1)); printf "%03d" $COUNTER; }

chrome_open() {
  osascript <<APPLESCRIPT >/dev/null 2>&1
tell application "Google Chrome"
  activate
  set URL of active tab of window 1 to "$1"
end tell
APPLESCRIPT
}
chrome_focus() { osascript -e 'tell application "Google Chrome" to activate' >/dev/null 2>&1; sleep 0.4; }

shot() {
  chrome_focus
  sleep 0.4
  screencapture -x "$1" 2>/dev/null
  if [ ! -f "$1" ]; then
    echo "  [WARN] screenshot failed: $1"
    return 1
  fi
  return 0
}

audit orchestrator walk-started sarah-walker info process "fallback walker — fullscreen-only, no DOM access"

persona_md "## Phase 2 — Marketing site (real Chrome, fullscreen via screencapture)

**$(ts)**
"

# Phase 2
ROUTES_M=(
  "https://astruct.io/|landing"
  "https://astruct.io/pricing|pricing"
  "https://astruct.io/solutions|solutions-hub"
  "https://astruct.io/solutions/contractors|sol-contractors"
  "https://astruct.io/solutions/developers|sol-developers"
  "https://astruct.io/solutions/subcontractors|sol-subcontractors"
  "https://astruct.io/solutions/contract-administrators|sol-ca"
  "https://astruct.io/solutions/construction-lawyers|sol-lawyers"
  "https://astruct.io/about|about"
  "https://astruct.io/privacy|privacy"
  "https://astruct.io/terms|terms"
  "https://astruct.io/contact|contact"
  "https://app.astruct.io/login|login"
  "https://app.astruct.io/register|register"
  "https://app.astruct.io/forgot-password|forgot-password"
)

for entry in "${ROUTES_M[@]}"; do
  url="${entry%%|*}"
  slug="${entry##*|}"
  echo "Visiting $url"
  chrome_open "$url"
  sleep 5
  N=$(next_n)
  out="$SHOTS/p02_${N}_${slug}.png"
  shot "$out"
  persona_md "Route ${slug}. Screenshot: $(basename "$out")"
done

# Phase 3 — Anonymous assistant
persona_md "## Phase 3 — Anonymous

**$(ts)**
"

chrome_open "https://app.astruct.io/assistant"
sleep 12  # wait for anon-start + intro modal
N=$(next_n); shot "$SHOTS/p03_${N}_anon-assistant.png"
persona_md "Hit the assistant cold. Should land on a fresh project with the upload modal."

# 404 + verify pages
chrome_open "https://app.astruct.io/this-route-does-not-exist-xyz"; sleep 5
N=$(next_n); shot "$SHOTS/p09_${N}_404-app.png"
persona_md "Bad URL on app side."

chrome_open "https://app.astruct.io/verify-email"; sleep 5
N=$(next_n); shot "$SHOTS/p09_${N}_verify-email-redirect.png"
persona_md "Verify-email page (should redirect to /)."

chrome_open "https://app.astruct.io/verify-phone"; sleep 5
N=$(next_n); shot "$SHOTS/p09_${N}_verify-phone-redirect.png"
persona_md "Verify-phone page (should redirect to /)."

audit sarah-walker walk-completed all-phases info process "fullscreen-only walk; $COUNTER screenshots"

echo ""
echo "Walk done. $COUNTER screenshots in $SHOTS"
ls -la "$SHOTS" | tail -10
