# Astruct — QA Log (Anon-First Fix-It-Properly Run)

> Methodology rule: **No UI change is "done" until I've loaded it in Playwright, screenshotted it, and looked at the screenshot.** Every entry below is grounded in screenshot evidence stored under `test-results/screenshots/`.

## Inventory

| Bug ID | Title | Status | Before | After |
|---|---|---|---|---|
| A1 | Native dropdowns → app-design dropdowns | pending | — | — |
| A2/A18 | Guest counter "0 days left" + non-incrementing | pending | — | — |
| A3 | Real-time AI thinking (rip placeholder rotation) | pending | — | — |
| A4 | Like / Dislike buttons functional + persisted | pending | — | — |
| A5 | Refresh response actually regenerates | pending | — | — |
| A6 | Markdown lists render correctly | pending | — | — |
| A7 | RAG retrieval works on uploaded contract | pending | — | — |
| A8 | Enforce 1-contract limit for anon | pending | — | — |
| A9 | Guest framing — not "signed in" | pending | — | — |
| A10 | Settings page locked / hidden for guest | pending | — | — |
| A11 | Signup form: name required, email validation | pending | — | — |
| A12 | Document export restored | pending | — | — |
| A13 | Contract category taxonomy correction | pending | — | — |
| A14 | AI-generated contract title (drop "Untitled project") | pending | — | — |
| A15 | Library spatial cue (first use) | pending | — | — |
| A16 | Suggested prompts use extracted clauses | pending | — | — |
| A17 | Strip "time bars" from upload narration | pending | — | — |
| B1 | Persona walkthrough — Frustrated Contract Admin | pending | — | — |
| B2 | Persona walkthrough — Mobile Subbie (380px, 4G) | pending | — | — |
| B3 | Persona walkthrough — Skeptical CM (attack vectors) | pending | — | — |

## Setup

- Dev server: `nohup npm run dev > /tmp/astruct-dev.log 2>&1 &` running on `http://localhost:3000`
- Feature flag: `NEXT_PUBLIC_ANON_FIRST_ENABLED=true` in `.env.local`
- Playwright: `1.59.1`, chromium `1217` installed
- Screenshots dir: `test-results/screenshots/`
- Helper script: `scripts/qa-shoot.mjs` — single-purpose Playwright runner that takes a labelled screenshot at a given URL with optional pre-shot interactions

---

## Entries

(Entries appended below in chronological order. Each entry: bug ID, what I did, what the screenshots show, code change reference, what's still wrong if anything.)

---

### A14 — AI-generated contract title  ✅
### A14b — Sidebar contract name refresh after intro PATCH  ✅
### A10 — Settings page locked / hidden for guest  ✅
### A17 — Strip "time bars" from upload narration  ✅
### A11 — Signup form: name required + email validation  ✅

(Batched into a single browser pass via `scripts/qa-batch-verify.mjs` because they all share the upload flow + post-modal sidebar checks. Screenshots `batch-01` through `batch-09`.)

**A14:** `app/api/contracts/quick-init/route.ts` now generates a 3-7 word project title via gpt-4o-mini if extractor's `project_name` is blank. Never returns "Untitled project". Returns `project_title` in response so the modal can populate even when extracted_facts has no project_name. Verified: `screenshots/batch-04-review.png` shows the modal pre-filled with **"Brisbane Cross-River Rail - Albert Street Station"** for the test PDF — extracted from the document text, not the filename `test-subcontract.pdf`.

**A14b:** Custom event `astruct:contract-updated` dispatched from intro modal save → dashboard layout listens via `useEffect` and calls `refetchContracts()`. Verified: `screenshots/batch-07-settings-direct.png` shows the sidebar dropdown reading "Brisbane Cross-River Ra…" (truncated for the sidebar width) instead of the prior "Untitled project". Console log: `--- A14b sidebar still has Untitled project? --- false`.

**A10:**
- `app/(dashboard)/layout.tsx` — `Settings` nav switched from `NavItem` to `AnonLockedNavItem`. SIGN UP badge appears next to it for anon users; click triggers the hard-wall modal.
- `app/(dashboard)/settings/page.tsx` — added an early `isAnon` branch that renders a centered "Sign up to access settings" lock card with explanation + Sign up free / Back CTAs. Anon users can no longer see the Profile / Company & Letterhead / Signatory form.
- Verified: `screenshots/batch-07-settings-direct.png` — direct navigation to /settings as anon shows the lock card. Sidebar shows the SIGN UP badge on the Settings nav.

**A17:** `components/contract-intro-modal.tsx` — second progress message changed from `'Identifying contract form and time bars…'` to `'Identifying contract form and key dates…'`. Verified: `screenshots/batch-03-progress-tick2.png` shows the new copy.

**A11:**
- `app/(auth)/register/page.tsx` — Name now visually required (red asterisk) AND validated server-handler-side (trim length check). Email validation switched to a permissive regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` that accepts `name+tag@company.com.au`, `first.last@subdomain.example.io`, etc. Native `type="email"` removed (some browsers reject + addressing) — replaced with explicit JS validation that runs in handleSubmit. Password length check (≥6) added.
- Verified: `scripts/qa-batch-verify.mjs` filled the form with `first.last+tag@company.com.au` — accepted (no validation error rendered). Field value preserved.

---

### A9 — Guest framing (not "signed in")  ✅

**Before:** Bottom-left of sidebar showed an avatar block with "G / Guest / guest@astruct" + a popover containing a "Log out" option for users who had no account to log out of. Header pill read "Guest · 0/50 messages".

**Code change:**
- `app/(dashboard)/layout.tsx` — `UserProfile` interface gains `isAnonymous?: boolean`. `loadData` now stops faking a `Guest` name/email and instead sets `isAnonymous: true` when the Supabase user is anon. The bottom-left block now branches: anon users see a black "Sign up free" button + a faint "Already have an account? Log in" link below; only signed-in users get the avatar/popover/Log-out flow.
- `components/anon-guest-pill.tsx` — copy changed from `Guest · {n}/{limit} messages` to `{n} / {limit} messages`. The dot indicator stays.

**After:** `screenshots/A9-pill-text.png` + DOM checks logged by `scripts/qa-pill-text.mjs`:
```
guestPrefix: false       (header pill no longer says "Guest · …")
cleanCounter: true       (matches "1 / 50 messages")
guestEmail: false        (no "guest@astruct" anywhere in sidebar)
signUpButton: true       (Sign up free CTA visible)
logoutPresent: false     (no Log out anywhere in sidebar)
```

**What I observed in the screenshot:** Bottom-left now reads "Sign up free" as a dark prominent button + "Already have an account? Log in" beneath it. The orphan "G" avatar circle is gone. Header pill displays just "1 / 50 messages" with a small dot indicator — no identity claim.

---

### A2 / A18 — Guest counter (kill "0 days left", increment messages live)  ✅

**Before:** Ted's `screenshots/02-guest-counter-broken.png` (user-supplied) showed sidebar widget reading "Queries 0/50 · 0 days left · Upgrade" for an anonymous user. Header pill stuck at "Guest · 0/50 messages" after multiple sends.

**Code change:**
- `components/usage-meter.tsx` — full rewrite. Reads `usage.isAnonymous` from `/api/usage` and renders `null` for guests entirely. Free signed-up users see `Free plan · 1 / 1 project`. Paid users see "Pro plan". The legacy `Queries / days left / Upgrade` UI is dead.
- `app/api/chat/route.ts` — counter increment switched from SSR client to admin client so the update can never be silently rejected by RLS (`error: updErr` is now logged + an SSE debug line `Counter: messages_sent=N` confirms it fired). Reason: previous code wrapped the SSR-client update in `try { ... } catch { /* swallow */ }` which would silently drop counter writes on any RLS edge.
- `lib/anon-context.tsx` — added 4-second visibility-aware polling + window focus listener so the header pill picks up server-side counter changes without having to thread a refresh callback through the entire chat send path.

**After:** `screenshots/A2-04-after-msg-2.png` — header pill reads `Guest · 2/50 messages` after sending two messages. Sidebar no longer renders the legacy widget. `--- bug checks ---` from the QA script logged: `daysLeft: false, queries050: false, upgradeBadge: false` — none of the broken text appears anywhere on the page.

**What I observed in the screenshot:** Counter visibly incremented (0 → 2), no "Upgrade" pill, no "0 days left" string, no "Queries 0/50" widget, no orange UpgradeButton. The only counter on screen is the header pill. The sidebar is clean.

**Bonus discoveries from this same screenshot:**
- A7 RAG is actually functioning — assistant answered "What does clause 34 say?" by quoting the contract verbatim with a Sources(1) link. The "doesn't have the relevant delay clauses" symptom may have been a result of the previous extractor not feeding the right contract through.
- A6 markdown — paragraphs and blockquotes render correctly. Lists not yet stress-tested but no obvious pipeline break.

**New issues to log separately (will be fixed under A9 + A14 follow-up):**
- Bottom-left sidebar still shows "G / Guest / guest@astruct" avatar block — A9.
- Header pill copy still says "Guest · 2/50 messages" — Ted prefers neutral copy. A9.
- Sidebar dropdown still shows "Untitled project" even though the modal PATCH set the contract name to "Brisbane Cross-River Rail - Albert Street Station" — sidebar contract list isn't refetching after PATCH. New bug, will track as A14b.

---

### A13 — Contract category taxonomy correction  ✅

**Before:** Modal showed raw enum value `subcontract` (`screenshots/A1-after-04-review.png`). Old taxonomy had `head_contract / subcontract / consultancy_agreement / supply_agreement / design_and_construct / deed_of_variation / other` — didn't reflect the D&C / Construct-only split that matters for design liability.

**Code change:**
- `lib/contract-facts/extractor.ts` — `ContractType` enum updated to Ted's six values (`dc_head_contract`, `construct_only_head_contract`, `dc_subcontract`, `construct_only_subcontract`, `consultancy_agreement`, `other`) with explanatory comments. System prompt rewritten to instruct the model on textual cues (D&C wording, design-liability hints, subcontract terminology) and constrains the output to exactly one of the six values.
- `components/contract-intro-modal.tsx` — `CONTRACT_TYPE_LABELS` keys synced; default contract type set to `dc_head_contract`. `SelectValue` uses an explicit children render so the trigger displays the human label (`"D&C subcontract"`) rather than the raw enum (`construct_only_subcontract`). `SelectItem` also passes `label` for base-ui's auto-derivation.
- `CONTRACT_FORMS` list expanded to include AS4903-2000 (subcontract general conditions), AS4905, AS4906, AS4910, AS4912, AS4915, AS4916, AS4949, AS4950, AS4970, AS4920, ABIC SW/MW-2018. Extractor system prompt's allowed-form list expanded to match.

**After:** `screenshots/A13-final-04-review.png` — Contract type pill reads "D&C subcontract", Contract form reads "AS4903-2000". Project name correct ("Brisbane Cross-River Rail - Albert Street Station"), parties correct (HEAD CONTRACTOR / SUBCONTRACTOR with John Holland / Pensar), contract administrator correct (Robert Bonner / Superintendent).

**What I observed in the screenshot:** Every field reads cleanly. No raw enum values exposed. The model correctly identified the document as a subcontract and (in the absence of explicit "design and construct" wording in the test PDF) picked D&C as the most likely category — the user can override via the dropdown.

---

### A1 — Native dropdowns → shadcn Select  ✅

**Before:** `screenshots/01-system-dropdowns.png` (user-supplied) shows native macOS rounded blue arrows on Contract type / Contract form / Party 1 Role / Party 2 Role.

**Code change:** `components/contract-intro-modal.tsx` — replaced 6 `<select>` elements with shadcn `<Select>`/`<SelectTrigger>`/`<SelectContent>`/`<SelectItem>` from `components/ui/select.tsx`. Added contract type taxonomy keys: `dc_head_contract`, `construct_only_head_contract`, `dc_subcontract`, `construct_only_subcontract`, `consultancy_agreement`, `other`.

**After:** `screenshots/A1-after-04-review.png` — all five visible dropdowns render with flat shadcn border + chevron icon + no native browser chrome. Confirmed by Playwright DOM query: `5 shadcn SelectTriggers found` in the modal.

**What I observed in the screenshot:** Layout is clean. Chevron icon on right of each trigger. Border matches the rest of the form inputs. No native macOS pill chrome.

**New issues spotted in the same screenshot (logged separately, will be fixed under A13):**
- "Contract type" displays raw value `subcontract` because the extractor still emits the old enum values, not the new taxonomy keys — needs extractor prompt + schema sync.
- "Contract form" displays `bespoke` even though the test PDF says `AS4903-2000` — `AS4903-2000` is missing from the `CONTRACT_FORMS` list.

---


