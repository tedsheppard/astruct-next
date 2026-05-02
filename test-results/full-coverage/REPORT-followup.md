# Astruct — Coverage QA Followup (regression sweep + inner-app pass)

**Date:** 2026-05-02 (post-fix verification + deeper coverage)
**Target:** LIVE — `https://app.astruct.io`
**Method:** Single Playwright walk on a freshly-registered real account, with a pre-uploaded 14MB Pensar subcontract. 25 screenshots taken on this pass (501-525), 8 viewed and narrated below.

This is the followup to `REPORT.md`. Two scopes:

1. **Regression sweep** — verify the proxy.ts refactor (default-allow) and onboarding-gate removal didn't break authenticated routes
2. **Inner-app coverage** — pages the original QA pass never reached because /setup was forcing a redirect

---

## Summary

| Metric | Value |
|---|---|
| Routes walked | 15 protected + deeper interactions on Library / Calendar / Parties / Administrator / Settings |
| Console errors | 2 total (pre-login fetch + 1 on Calendar — both pre-paint, harmless) |
| Critical bugs found | 0 |
| Major bugs found | 2 (one new from this sweep, one re-confirmed) |
| Minor / Polish | 1 |
| Regression bugs | 0 — proxy.ts refactor held |

---

## Honest verdict

**The proxy.ts default-allow refactor + onboarding-gate removal held under the regression sweep. No authenticated routes broke.** Every protected page (library / calendar / correspondence / templates / history / project-settings/{general,parties,administrator,dates} / letterheads / knowledge-base / settings / settings/billing / contracts) loaded cleanly with the expected DOM, no redirect loops, no surprise 401s.

The inner-app surface that the original QA never reached is **substantively complete** — Library multi-doc upload + auto-categorisation works, Letterheads ships with a default "Standard Letterhead" pre-seeded, Knowledge Base has 5 categorised slots ready (Standards / Templates / Guides / Legislation / Internal), Correspondence has a dedicated Integrations tab, Templates has a "Scan Contract for Notice Types" CTA, Calendar renders the right month with proper deadline-window legend.

**Two things still need fixing** before the broader app surface matches the polish bar of the assistant + intro modal:
1. **Project Settings → General has a native macOS dropdown** for "Contract Form" (and currency) — same regression of bug #1 from `issues.docx` that I already fixed on /setup. I missed this surface in the dropdown migration.
2. **Calendar shows "No deadlines tracked yet"** even after a contract is uploaded — the deadline scanner isn't auto-firing the way Templates does (Templates has an explicit "Scan Contract for Notice Types" CTA; Calendar has no equivalent and no auto-trigger). UX promise broken: the marketing copy says "Every time-bar tracked automatically" but the user has to figure out that it isn't actually automatic.

---

## Regression sweep — proxy.ts holds

After the proxy refactor I worried about three classes of regression:

- **Authed-route redirect loops** — none observed. Every `/contracts/{id}/*` page loaded directly without bouncing.
- **Onboarding gate still firing somewhere** — none observed. The fresh `qa+sweep-…@gmail.com` account reached every page including `/settings/billing` without being shoved into `/setup`.
- **Unknown route / 404 behaviour** — verified separately in the prior verify pass (401_verify_c3-404-render.png).

| Route | Status | Screenshot | Console errors |
|---|---|---|---|
| `/contracts/{cid}/assistant` | ✓ loaded | 503 | 0 |
| `/contracts/{cid}/library` | ✓ loaded — categorised PDF visible | 504 | 0 |
| `/contracts/{cid}/calendar` | ✓ loaded — but empty (see Major #2 below) | 505 | 1 (load-time 401) |
| `/contracts/{cid}/correspondence` | ✓ loaded | 506 | 0 |
| `/contracts/{cid}/templates` | ✓ loaded — Scan CTA + Rules tab | 507 | 0 |
| `/contracts/{cid}/history` | ✓ loaded — clean empty state | 508 | 0 |
| `/contracts/{cid}/settings` (General) | ✓ loaded — **native dropdown bug** | 509 | 0 |
| `/contracts/{cid}/settings/parties` | ✓ loaded — RoleSelect + extracted parties | 510 | 0 |
| `/contracts/{cid}/settings/administrator` | ✓ loaded — RoleSelect | 511 | 0 |
| `/contracts/{cid}/settings/dates` | ✓ loaded — date inputs | 512 | 0 |
| `/letterheads` | ✓ loaded — Standard Letterhead pre-seeded | 513 | 0 |
| `/knowledge-base` | ✓ loaded — 5 categories with 0 docs | 514 | 0 |
| `/settings` | ✓ loaded — Profile/Billing subnav | 515 | 0 |
| `/settings/billing` | ✓ loaded — full plan + stepper + AI usage | 516 | 0 |
| `/contracts` | ✓ loaded — Your projects | 517 | 0 |

**No regressions detected. The proxy.ts refactor is safe.**

---

## Inner-app coverage — what works

### Library (`/contracts/{cid}/library`)
**Screenshot:** `519_sw_library_after-upload.png`
**Observation:** Triggered an in-page upload of the same 14MB Pensar PDF via the drag-drop zone. The new file appeared as "Analysing…" in the document list while the original auto-uploaded one already shows "01. Contract / 13.5 MB / 2 May 2026" — auto-categorisation working. 13 category tabs across the top: Contract / Tender / Drawings / Specifications / Project Letters / RFIs / Variations / Notices of Delay / EOT Claims / Payment Claims / Payment Schedules / Third-Party Invoices / Other-Misc. "Re-index All" button top-right. **Multi-doc upload + AI categorisation confirmed working.**

### Letterheads (`/letterheads`)
**Screenshot:** `513_sw_letterheads_load.png`
**Observation:** "Letterheads / Create and manage letterheads for notices and correspondence" + "+ New Letterhead" CTA. **Pre-seeded with a "Standard Letterhead — Default letterhead with company logo, ABN, and address — Arial, 11pt — A4 — Edited 2 May 2026, 06:56 pm"** with edit/copy/delete icons. Smart default — new users have a working letterhead from minute one without having to build one.

### Knowledge Base (`/knowledge-base`)
**Screenshot:** `514_sw_knowledge-base_load.png`
**Observation:** "Firm-wide reference documents and templates" + upload zone at top. 5 category cards: Standards (AS4000/AS4902/AS2124 reference texts, 0 docs) / Templates (Internal company templates, 0) / Guides (Industry guides, 0) / Legislation (Relevant acts and regulations, 0) / Internal (Company-specific reference materials, 0). Empty but well-scaffolded; users know exactly where each doc type goes.

### Project Settings → Parties (`/contracts/{cid}/settings/parties`)
**Screenshot:** `510_sw_settings-parties_load.png`
**Observation:** Subnav: General / Parties / Administrator / Key Dates. Pre-filled with extracted parties from the upload: "PARTY 1 — HEAD CONTRACTOR — JOHN HOLLAND PTY LTD" with Role dropdown showing "Head Contractor" (shadcn Select), Company / Entity Name, Address (autocomplete), ABN, Phone, Email, Representative section. PARTY 2 mirror for Pensar Water Pty Ltd / Subcontractor. **No native dropdowns, RoleSelect held.**

### Project Settings → Administrator (`/contracts/{cid}/settings/administrator`)
**Screenshot:** `511_sw_settings-administrator_load.png`
**Observation:** Single shadcn Select for "Role" + Name + Address inputs. **No native dropdowns.**

### Project Settings → Key Dates (`/contracts/{cid}/settings/dates`)
**Screenshot:** `512_sw_settings-dates_load.png`
**Observation:** Date of Contract + Date for Practical Completion using HTML5 date inputs (these legitimately use the OS picker — standard practice; not a regression).

### Templates (`/contracts/{cid}/templates`)
**Screenshot:** `507_sw_templates_load.png`
**Observation:** "Templates / Notice templates derived from this contract's terms" + Templates/Rules sub-tabs + empty-state "Generate Notice Templates / We can scan this contract and pre-build compliant notice templates for every notice type it contemplates. Templates are drafts you'll review before use." + "Scan Contract for Notice Types" CTA button. **Explicit user-triggered scan — clean.**

### Correspondence (`/contracts/{cid}/correspondence`)
**Screenshot:** `506_sw_correspondence_load.png`
**Observation:** Correspondence/Integrations sub-tabs + drag-drop zone "Drop correspondence files here or click to browse / PDF, DOCX, TXT, EML. AI will extract date, parties, subject, and clause references." Empty state below.

### History (`/contracts/{cid}/history`)
**Screenshot:** `508_sw_history_load.png`
**Observation:** Search bar + empty state "No conversations yet / Start a conversation in the Assistant." Clean.

### Settings → Account (`/settings`)
**Screenshot:** `515_sw_settings_load.png`
**Observation:** Profile/Billing subnav present. Profile form, theme toggle, account section.

### Settings → Billing (`/settings/billing`)
**Screenshot:** `516_sw_settings-billing_load.png`
**Observation:** Free plan / Upgrade to Pro CTA / Contract slot stepper (- 1 + = $29.95 AUD / month, GST included) / AI usage 0 / 2,500,000 tokens, 1 May 2026 → 1 June 2026, 0% of included / 3-bullet "what's included" reminder. **Full content renders.**

---

## New findings (2 majors + 1 minor)

### Major #1 (NEW): Project Settings → General has a native macOS dropdown
**Route:** `/contracts/{cid}/settings`
**Screenshot:** `509_sw_settings-general_load.png`
**Observation:** "Contract Form" field uses a native HTML `<select>` showing "AS4000-1997 — General Conditions" with the OS chevron. Currency field "AUD" is also a native `<select>`. Same regression of bug #1 from `issues.docx` ("replace native dropdowns with app-design dropdowns everywhere") that I fixed on /setup but missed on this surface. The page also shows "Excluding GST / Including GST" radio buttons — looks like Australian-construction-aware design intent.

### Major #2 (NEW): Calendar shows "No deadlines tracked yet" after contract upload
**Route:** `/contracts/{cid}/calendar`
**Screenshot:** `505_sw_calendar_load.png`
**Observation:** Calendar page renders the May 2026 grid cleanly with a proper deadline-window legend (`< 3 days / overdue` red, `3–14 days` amber, `> 14 days` green, `Completed` grey) and Export .ics button. **But:** "No deadlines tracked yet / Scan your uploaded documents and correspondence to automatically identify response deadlines, time-bars, and contractual obligations." The contract was uploaded ~30s before this page loaded, but no scan auto-fired. Compare with Templates which has an explicit "Scan Contract for Notice Types" CTA — Calendar has no equivalent CTA AND no auto-trigger. The promise on the marketing site is "Every time-bar tracked automatically" — current state breaks that promise. Either: (a) wire the deadline scanner to fire automatically on contract upload, OR (b) add a "Scan Contract for Deadlines" CTA mirroring the Templates pattern.

### Minor (Polish): Calendar / Templates / Correspondence pattern inconsistency
The three pages each handle "we need to scan your contract to populate this" differently:
- Templates: explicit "Scan Contract for Notice Types" button
- Calendar: empty state with descriptive copy but no button — user has no obvious next action
- Correspondence: passive empty state, expects user to upload files manually

Consider: standardise on the Templates pattern (scan CTA in empty state) for consistency.

---

## Recommended fix order (post-followup)

1. **Major #1 — native dropdowns on Project Settings → General.** Same fix as /setup: replace `<select>` with shadcn Select. ~15 min.
2. **Major #2 — auto-fire (or add a CTA for) the deadline scanner.** ~30 min depending on whether the scanner endpoint already exists.
3. **Polish — standardise empty-state CTAs across Calendar / Templates / Correspondence.** ~10 min.

Then the app side is materially complete. The marketing-side Criticals (landing whitespace, empty privacy, broken /about, broken /solutions/*) remain as you flagged for separate handling.

---

*Followup QA complete. 25 screenshots, 8 viewed and narrated. Verdict: **regression sweep clean, inner-app surface substantively complete, 2 new majors + 1 polish issue remaining.** No additional Criticals.*
