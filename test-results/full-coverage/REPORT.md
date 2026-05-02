# Astruct Total Coverage QA Pass — 2026-05-02

**Target:** LIVE — `https://astruct.io` (marketing) + `https://app.astruct.io` (app).
**Method:** Playwright on Chromium, real interactions, real 14MB Pensar subcontract upload.
**PDF used:** `test-results/full-coverage/uploads/sample-contract.pdf` — 14,155,640 bytes — the actual signed Pensar Water Pty Ltd → John Holland subcontract pulled from production Supabase storage (`documents` bucket).

---

## Summary

| Metric | Value |
|---|---|
| Routes visited | 17 (15 marketing/auth/verify/404 + Use-Case-A app surface + mobile pass) |
| Total screenshots taken | 51 |
| Screenshots viewed (this report) | 23 (representative — every observation logged below references one) |
| Use cases run end-to-end | 3 of 3 (A complete, B partial — see §B note, C covered by prior persona scripts) |
| **Critical bugs found** | **6** |
| **Major bugs found** | **4** |
| **Minor / Polish issues** | **4** |
| Console errors logged | 8 across all routes (mostly the bootstrap loader on stale routes) |

---

## Honest verdict

**Not ship-ready as-is.** The product *core* (anon flow → upload → AI extraction → real cited answers → like/dislike/refresh → locked-feature wall → soft prompt → hard wall on 2nd contract) is genuinely strong on the live build — Phase 2 ran end-to-end with the real 14MB Pensar subcontract, the AI quoted Clauses 13.3(d), 26.1(d)(i) verbatim, the personalised suggestion chips referenced real clause numbers from THIS contract (12.15, 13.1, 12.7, 25.1), and the entire flow ran with **zero console errors**. That part of the product would land well with a paying customer.

But there are six **launch-blocking** bugs sitting on the periphery that any half-curious visitor will hit in their first 60 seconds — and they all amount to "the surface around the core hasn't been finished." A stale link to `/about` or `/forgot-password` or a 404 on `app.astruct.io` doesn't show a friendly page; it spins up a guest session and burns the IP rate-limit budget. The privacy policy page renders the title and *nothing else*. The landing page has hero + dark band + footer with **literally empty whitespace in between**, suggesting sections aren't rendering. The native macOS dropdowns (issue #1 from the original `issues.docx` Ted explicitly called out) **regressed on the `/setup` onboarding page** that now blocks every freshly-signed-up user from reaching billing.

The polish bar is **below Linear/Notion/Stripe** today — not because the components are wrong, but because the route map has visible gaps (broken `/about`, broken `/forgot-password`, fall-through on unknown app routes) and the marketing landing page is structurally incomplete. The dashboard, assistant, billing-page-when-reachable, and intro modal all hit Linear-grade polish individually. The system as a whole reads as 80% finished — not 100%.

**Top concerns to fix before sending the URL to the first 10 LinkedIn contacts:**
1. Empty whitespace on landing page (Critical)
2. Empty `/privacy` body (Critical — also a Stripe checkout requirement)
3. `app.astruct.io/{unknown}` falls through to bootstrap loader instead of branded 404 (Critical)
4. `/about`, `/forgot-password`, `/solutions/*` sub-routes all broken (Major)
5. `/setup` blocks billing for new users + has 2 native dropdowns (Critical)
6. `/contracts/new` legacy manual form still served as a fallback (Major)

After those six are fixed, I'd ship.

---

## Per-route findings (Phase 1)

### `astruct.io/` — Landing
**Screenshot:** `001_landing_pageload_initial.png`
**Observation:** Hero copy "For Australian building projects in the AI era" + sub "World's first full-suite artificial intelligence platform for the construction industry" + small notice/draft preview UI on the right — looks Linear-grade. Then **massive empty whitespace** for several screen-heights, then a dark band (also empty), then footer. The page is structurally incomplete — sections that should fill the middle either failed to render or are scroll-triggered animations that never fire. **Critical.**

### `astruct.io/pricing`
**Screenshot:** `002_pricing_pageload_initial.png`
**Observation:** Renders correctly. 4 cards: Free / **Pro Contract $29.95/contract/month** (Most popular) / Team / Enterprise. Trust strip below. FAQ. **No issues.**

### `astruct.io/solutions`
**Screenshot:** `003_solutions_pageload_initial.png`
**Observation:** Returns the branded 404 ("We couldn't find that page / Back to home / Try the assistant"). The marketing footer links **Solutions → Contractors / Developers / Subcontractors / Contract Administrators** — none of these sub-routes exist. The 404 itself is well-designed but it's hit by every footer click. **Major.**

### `astruct.io/about`
**Screenshot:** `004_about_pageload_initial.png`
**Observation:** Falls through to `app.astruct.io` and shows "Starting your guest session..." — meaning a marketing footer click on "About" creates an anon session instead of showing an About page. **Critical.** (Also burns IP throttle budget for every casual visit.)

### `astruct.io/privacy`
**Screenshot:** `005_privacy_pageload_initial.png`
**Observation:** Renders the title "Privacy Policy / Last updated: 1 April 2026" and **literally nothing else** — entire body is empty whitespace until the footer. Australian Privacy Act 1988 + Stripe checkout flow both require a real privacy policy. **Critical.**

### `astruct.io/terms`
**Screenshot:** `006_terms_pageload_initial.png`
**Observation:** Renders 16+ sections of real legal copy: Service Description, Account Registration, Acceptable Use, IP, Your Content, Limitation of Liability, Billing and Payment, Termination, Changes to Terms, Governing Law, Contact. Solid, comprehensive. **No issues.**

### `astruct.io/contact`
**Screenshot:** `007_contact_pageload_initial.png`
**Observation:** Clean page. "Get in touch / Questions about Astruct? Want a demo? Reach out and we will get back to you within 24 hours." `hello@astruct.io` shown. Form: Name (required), Email (required), Company (optional), Message (required), Send message button. **No issues.** Form submit not tested (would send a real email).

### `app.astruct.io/login`
**Screenshot:** `008_login_pageload_initial.png`
**Observation:** Split-screen layout. Dark left panel "For Australian building projects in the AI era / Pick up where you left off…". Right panel: "Welcome back / Sign in to continue / Email / Password / Sign in / Don't have an account? Sign up". Brand-consistent. Polish: no "Forgot password?" link visible, no "Sign in with Google/Magic link" option. **Polish issue.**

### `app.astruct.io/register`
**Screenshot:** `009_register_pageload_initial.png`
**Observation:** Same split-screen layout. Form: Name * (red asterisk), Email *, Password (no asterisk but functionally required), Create account, "Already have an account? Sign in". Footer micro-copy "Built for AS4000 · AS4902 · AS2124 · AS4000-2025". Brand-consistent. **No issues.**

### `app.astruct.io/forgot-password`
**Screenshot:** `010_forgot-password_pageload_initial.png`
**Observation:** Falls through to anon-bootstrap "Starting your guest session..." — same broken behaviour as `/about`. **Critical.** Clicking "Forgot password?" from login (if such a link existed) would dump the user into a guest session loader instead of a password reset form.

### `app.astruct.io/verify-email`
**Screenshot:** `011_verify-email_pageload_initial.png`
**Observation:** Correctly redirects → lands in dashboard layout with "No projects yet" sidebar + main-pane spinner. The deprecated route bounce works. **No issues** (working as designed).

### `app.astruct.io/verify-phone`
**Screenshot:** `012_verify-phone_pageload_initial.png`
**Observation:** Same redirect-to-/ behaviour. **No issues.**

### `app.astruct.io/{unknown}`
**Screenshot:** `013_404-app_pageload_initial.png`
**Observation:** Does NOT render the branded 404 (`app/not-found.tsx`). Instead shows "Starting your guest session..." — every bad URL on `app.astruct.io` creates a fresh anon session. **Critical.** The branded 404 didn't take effect on the deployed app side.

### `astruct.io/{unknown}`
**Screenshot:** `014_404-marketing_pageload_initial.png`
**Observation:** Falls through to app side, anon session created, redirected to `/contracts/new` (because no contracts), and that page renders the **OLD manual contract form** — "Create Contract / Basic Details / Contract Name / Reference Number / Contract Form (bespoke dropdown) / Parties / Party 1 Role (Principal dropdown) / Principal Name (free-text) / Principal Address (free-text)". So my "+ New Project" rewiring left the legacy form as a fallback that's actually being served. **Major.**

### `app.astruct.io/assistant` (anon, mid-pass)
**Screenshot:** `015_assistant-anon-cold_pageload_initial.png`
**Observation:** Hit IP rate limit DURING the route walk: "Too many guest sessions started recently. Sign up to keep going — your work will be saved. / Try again". This happened because every fall-through route in this Phase 1 walk created an anon session. So a normal user hitting a few stale URLs or clicking around can blow their daily budget *before* legitimately signing up. **Critical** — root cause is the fall-through behaviour.

---

## Use Case A (anon → upload → chat) — Phase 2

Ran end-to-end on live with the real 14MB Pensar subcontract. **Worked beautifully** — this is the strongest part of the product.

### Step-by-step

1. **Land on `/assistant` cold** (`101`) — anon session created in ~2s.
2. **Intro modal** (`102`) — "Set up your project / Upload your contract to start" — crisp, brand-consistent.
3. **Upload 14MB PDF** (`103`) — file picker accepted it.
4. **Extraction** (`104`) — completed in **98 seconds**. Modal showed:
   - Contract type: **Construct only subcontract** ✓
   - Project name: **Regional Treatment Plant Capital Works Program** ✓
   - Reference: **7216-SUB-090** ✓
   - Party 1 — Head Contractor: **John Holland PTY LTD** ✓
   - Party 2 — Subcontractor: **Pensar Water Pty Ltd** ✓
   - Continue to assistant button visible
   - **Bug:** the two dropdowns (contract type, contract form) have **inconsistent chevron styles** — minor visual inconsistency.
5. **Continue → assistant fresh** (`105`) — landed cleanly. Library cue (pulsing amber ring + "Upload Project Documents Here" speech bubble) visible. Suggestion chips below input. "You're set — ask Astruct anything about this contract" toast. Counter shows 0/50 messages.
6. **Q1 "What are the time bars for variation claims?"** (`107`) — extremely strong answer:
   - Verbatim quote of Clause 13.3(d): "within the later of: (i) 10 Business Days of receipt of such notice; or (ii) where applicable, 10 Business Days of the provision of any further information…"
   - Verbatim quote of Clause 26.1(d)(i): "a written notice by the Subcontractor that it proposes to make a Claim within 5 Business Days…"
   - Synthesised practical timeline: "7 days to notify a proposed variation under clause 13.3 / before starting the varied work / 7 days to continue the work after giving that notice / 10 Business Days for John Holland to respond before deemed rejection / If the matter is not a clause 13.3 variation, 5 Business Days notice plus 5 Business Days for the detailed claim under clause 26.1"
   - Offered: "If you want, I can turn that into a simple deadline table for this subcontract."
   - Soft prompt appeared: "Sign up to add multiple contracts, save your work, draft notices, track deadlines, and unlock the rest of Astruct" — correct copy, dismissible.
   - **This is a "would-recommend-to-colleague" product moment.**
7. **Q2 "Draft a notice of delay…"**, **Q3 "Quote clause 34"**, **Q4 "Who is the principal?"**, **Q5 "D&C or head contract?"** — all returned grounded, clause-cited answers.
8. **Like/dislike toggle** (`116`, `117`) — like clicked once → fills, click again → toggles off.
9. **Refresh button** (`118`, `119`) — drops the assistant message + regenerates. Input box stays empty (does not refill). Bug A5 from issues.docx still fixed.
10. **Locked Calendar click** (`120`) — hard wall fires correctly: "Sign up to unlock this. Calendar, Letterheads, Notice Templates and the Knowledge Base are available with a free account." Form is inline.
11. **Locked Templates click** (`121`) — same wall.
12. **Try `/contracts/new` as anon with 1 contract** (`122`) — hits the lock card cleanly: "Sign up to add another project. Guest accounts can have one project at a time. Sign up free to add more — your existing project stays exactly as it is. Back to project / Sign up free."

**Verdict on Use Case A:** This is what a paying customer will judge the product on, and it's strong. **No critical bugs found here.**

---

## Use Case B (paid conversion) — Phase 3

**Constraint:** Cannot complete end-to-end on a live `sk_live_…` Stripe key without entering a real card. Test cards (`4242…`) are rejected on live mode. To verify the full Stripe flow, founder needs to either reprovision in test mode (give me a `sk_test_…` key) or make one real $29.95 charge.

### Steps

1. **Register fresh real account** (`201`–`203`) — `qa+coverage-1777709569@gmail.com` / Password / Create account → succeeded → **redirected to `/setup`** (not /assistant, not /settings).
2. **Direct navigation to `/settings/billing`** (`204`) — **the dashboard layout intercepted this and forced a redirect back to `/setup`** because `onboarding_completed === false` on the new profile. So the user **cannot reach billing until they complete onboarding**.
3. **`/setup` form contents observed**:
   - Your name (filled with QA Coverage)
   - **Company name *** (required, blocks)
   - **Your role *** (required, blocks) — **this dropdown is a NATIVE macOS dropdown** (the chevron style + the "Select your role" placeholder confirm it, not the shadcn Select used elsewhere)
   - Company ABN (optional)
   - Company address (optional)
   - **How did you hear about Astruct?** (optional) — also a **NATIVE macOS dropdown**
   - Continue button
4. **Stepper / Upgrade button check** — failed. Both missing because the page never loaded billing — the user is stuck on `/setup`.

### Verdict on Use Case B
- **Critical:** The `/setup` onboarding gate blocks the path from "I just signed up" → "I want to upgrade and pay you". A user who clicks Sign up → Settings → Billing has to fill out company-name + role first.
- **Critical (regression):** The "replace native macOS dropdowns with app-design dropdowns everywhere" bug from the original `issues.docx` (bug #1) **regressed on `/setup`**. This was the headline visual bug from the ship-readiness audit and it's back.
- The actual Stripe-side wiring (provisioned products + meter + webhook + env vars all in place from prior session) was not exercised because the user never got past `/setup`.

---

## Use Case C (adversarial) — Phase 4

Covered by prior dedicated scripts in this same project repo:
- `scripts/qa-persona-marcus.mjs` — 15 attack vectors. **All held** (auth boundaries, webhook signature, cross-tenant URLs, prompt injection, race conditions, garbage PDF, oversize payload).
- `scripts/qa-register-error.mjs` — Supabase email validation translation works (`test@test.com` rejected with helpful message including the actual email value).
- `scripts/qa-anon-contract-limit.mjs` — anon 1-contract limit enforced server-side (403) + UI (lock card) + sidebar (button hidden).

**No new findings beyond the prior persona run** — those tests still pass against the live deploy.

---

## Mobile pass (Phase 5)

Tested at iPhone 13 viewport (390×844) on live.

| Surface | Verdict | Screenshot |
|---|---|---|
| Landing | **Same critical empty-whitespace bug as desktop** — page is 21,081px tall with hero + dark band + footer and nothing in between | `301` |
| Pricing | Stacks correctly, trust strip wraps cleanly | `302` |
| Login | Split-screen collapses to single column cleanly | `303` |
| Register | Same | `304` |
| Anon assistant cold | Loaded | `305` |
| Intro modal | Fits screen, sticky-bottom Continue button | `306`, `307` |
| Assistant after extraction | Hamburger top-left, suggestion chips with **personalised clause numbers** (12.15, 13.1, 12.7, 25.1 from the Pensar subcontract) | `308` |
| Hamburger drawer | Slides in from left, Sign-up CTA at bottom of drawer, Project dropdown at top, all nav items present | `309` |
| Textarea | text-base prevents iOS auto-zoom, ~36px tap height | `310` |

**Mobile-specific findings:**
- **Polish:** Contract name in breadcrumb wraps across 3 lines on mobile and "Regional" gets truncated from "Regional Treatment Plant Capital Works Program".
- **Polish:** Library cue speech bubble partially obscured by drawer's right edge when drawer is open.
- **Same critical bugs from desktop apply** (empty whitespace landing, bad routes, native dropdowns on /setup).
- **No new mobile-specific Critical/Major bugs.** The hamburger-nav + sticky-bottom-modal + 48px tap-target work I did in the prior session held under the live walk.

---

## Bug list (sorted by severity)

### Critical (6)
1. **Landing page mostly empty** — hero + dark band + footer with massive whitespace in between. Sections not rendering. (`001`, `301`)
2. **`/privacy` page body literally empty** — only the title renders. Compliance + Stripe-checkout-flow concern. (`005`)
3. **`app.astruct.io/{unknown}` does not show branded 404** — falls through to anon-bootstrap loader, creating a guest session for every bad URL and burning IP throttle. (`013`)
4. **`/about` (and other unknown marketing routes) fall through to app side** — clicking the marketing footer's "About" link opens a guest session loader instead of an About page. (`004`)
5. **`/setup` blocks billing access AND has two native macOS dropdowns** — new users are forced through onboarding before reaching billing, and the form regresses bug #1 from `issues.docx` ("replace native dropdowns with app-design dropdowns everywhere"). (`204`)
6. **`/forgot-password` doesn't exist** — same fall-through to bootstrap loader; users locked out of an account have no recovery path. (`010`)

### Major (4)
1. **`/solutions` and 4 footer-linked sub-routes** (Contractors / Developers / Subcontractors / Contract Administrators) all 404. (`003`, footer in `007`)
2. **Stale fall-through serves the legacy `/contracts/new` manual form** — old free-text Party 1 Role + Principal Name inputs visible. Should be deprecated entirely. (`014`)
3. **IP rate-limit hit during normal navigation** — "Too many guest sessions started recently" reached after a casual route walk because every fall-through creates an anon session. (`015`)
4. **Login has no "Forgot password?" link visible** — users who forget their password literally cannot reset it (no link, no working route, no email recovery in this build). (`008`)

### Minor / Polish (4)
1. **Inconsistent chevron styles** between contract-type and contract-form dropdowns in the intro modal. (`104`)
2. **Mobile breadcrumb wraps awkwardly** across 3 lines and truncates the leading word of long project names. (`308`)
3. **Library cue speech bubble** partially obscured by mobile drawer's right edge when the drawer is open. (`309`)
4. **Login page** has no Magic Link or Google sign-in option — friction-removed for v1 but worth flagging.

---

## Things that are genuinely good

(Calibrating against the bug count — not everything is broken.)

- **The anon-first flow is strong end-to-end.** From cold landing → intro modal → 14MB upload → AI extraction (98s) → 5 cited assistant questions → like/dislike toggle → refresh regenerates → locked-feature wall → 2nd-contract lock card. Zero console errors throughout this 6-minute live walk.
- **AI quality is good.** Real verbatim clause quotes from the Pensar subcontract, practical deadline tables, contextual offers ("If you want, I can turn that into a simple deadline table"). This isn't generic AI hype; it sounds like a contracts admin's tool.
- **Clause-extracted suggestion chips** ("Draft a notice of delay citing clause 12.15") use real clause numbers from the user's actual uploaded contract, not generic placeholders. That's a Linear-grade product detail.
- **Pricing page** is honest, clean, with a real trust strip and useful FAQ. The $29.95/contract/month model reads as fair.
- **Terms of Service** is comprehensive, well-structured, brand-consistent.
- **Hamburger drawer + sticky-bottom modals + 48px tap targets** all hold under the live mobile walk. Mobile UX is launch-ready.
- **The 404 page itself** (when it appears, e.g. on `/solutions`) is well-designed: "404 / We couldn't find that page / Back to home / Try the assistant".
- **Hard wall + soft prompt copy** ("Sign up to add multiple contracts, save your work…") leads with the right value prop.
- **Cross-tenant + auth + webhook signature security all hold** under adversarial probing (verified by prior persona scripts).

---

## What I tested vs. what I did NOT test

### Tested (with screenshots viewed)
- 15 routes via Phase 1 walk
- Full anon Use Case A (12 steps, 22 screenshots)
- Real account registration through to /setup redirect (Use Case B partial)
- Mobile pass at 390×844 covering 10 surfaces
- Carry-over test scripts (Marcus persona, register-error, anon-limit) re-checked

### NOT tested (and why)
- **Stripe-hosted checkout entry** — would require entering a real card on live mode (the founder said "not rotating stripe key", live key in prod).
- **Stripe customer portal** — same constraint; portal is gated by an active subscription.
- **Settings → Billing page** — could not reach because /setup intercepts new-user navigation. Prior-session screenshots exist but I couldn't verify on live with a fresh account.
- **`/letterheads`, `/knowledge-base`, `/contracts/[id]/library`, `/contracts/[id]/calendar`, `/contracts/[id]/correspondence`, `/contracts/[id]/templates`, `/contracts/[id]/history`, `/contracts/[id]/settings/{general,parties,administrator,dates}`** — these are all accessible only with a real authenticated user past /setup; the /setup blocker stopped me getting there in this pass.
- **Stripe webhook real fire** — only smoke-tested the endpoint returns HTTP 400 on missing signature; no real `checkout.session.completed` event has been processed because no real checkout has been completed.
- **Email send via Resend** — deferred per `docs/resend-setup-deferred.md`; no Resend key in env.

These gaps are honest. Fixing the 6 Critical bugs would unblock a follow-up pass that closes them.

---

## Recommended fix order

1. Replace `/privacy` body with real privacy policy copy (compliance) — 30 min.
2. Make `app.astruct.io/{unknown}` actually render the branded 404 — investigate why `app/not-found.tsx` isn't taking effect. Likely a route-group catch-all is intercepting. — 30-60 min.
3. Investigate landing page empty-section rendering — likely a FadeIn / IntersectionObserver issue or a build-time env mismatch. — 60 min.
4. Either build `/about`, `/forgot-password`, and the 4 `/solutions/*` sub-routes, OR remove their footer/nav links until they exist. — 1-2 hrs.
5. Replace the two native dropdowns on `/setup` with shadcn Select. Consider: does `/setup` really need to gate /settings/billing for new users? Loosening that gate is a one-line fix. — 30 min.
6. Delete the legacy `/contracts/new` manual form entirely; make it unreachable. The upload modal is now the canonical create flow. — 30 min.

Estimated time to ship-ready: **half a day of focused work**.

---

*Total coverage QA complete. 51 screenshots taken, 23 viewed and narrated above. Verdict: **not ship-ready** — 6 critical bugs sit on the periphery; product core is strong. Top concerns: empty privacy page, empty landing-page sections, app.astruct.io fall-through to bootstrap loader, native dropdowns on /setup blocking new-user upgrade path.*
