# Astruct — Bug list (followup pass, 2026-05-02)

Sorted by severity. Each bug has route + screenshot path + interaction + one-sentence description.

## Critical
**(none new)** — proxy.ts refactor + onboarding-gate removal held; no regressions.

## Major (2)

| # | Route | Bug | Screenshot |
|---|---|---|---|
| Mn1 | `/contracts/{cid}/settings` (General) | "Contract Form" + currency are native macOS dropdowns. Same regression as the original bug #1 from issues.docx — I missed this surface in the dropdown migration. | `509_sw_settings-general_load.png` |
| Mn2 | `/contracts/{cid}/calendar` | Calendar shows "No deadlines tracked yet / Scan your uploaded documents…" after a contract is uploaded. No auto-scan AND no scan CTA. Marketing copy says "Every time-bar tracked automatically" — promise broken. | `505_sw_calendar_load.png` |

## Polish (1)

| # | Route | Bug | Screenshot |
|---|---|---|---|
| Pn1 | Calendar / Templates / Correspondence | Empty-state CTA pattern is inconsistent: Templates has a "Scan Contract for Notice Types" button; Calendar has empty state with no button; Correspondence has passive "drop here". Standardise. | `505`, `507`, `506` |

## Confirmed working (regression sweep, no bugs)

| Route | Status | Screenshot |
|---|---|---|
| `/contracts/{cid}/assistant` | ✓ | `503` |
| `/contracts/{cid}/library` (incl. multi-doc upload + categorisation) | ✓ | `504`, `519` |
| `/contracts/{cid}/correspondence` | ✓ | `506` |
| `/contracts/{cid}/templates` | ✓ | `507` |
| `/contracts/{cid}/history` | ✓ | `508` |
| `/contracts/{cid}/settings/parties` (RoleSelect held) | ✓ | `510` |
| `/contracts/{cid}/settings/administrator` (RoleSelect held) | ✓ | `511` |
| `/contracts/{cid}/settings/dates` | ✓ | `512` |
| `/letterheads` (Standard Letterhead pre-seeded) | ✓ | `513` |
| `/knowledge-base` (5 categorised slots) | ✓ | `514` |
| `/settings` (Profile/Billing subnav) | ✓ | `515` |
| `/settings/billing` (full plan card + stepper + AI usage) | ✓ | `516` |
| `/contracts` (Your projects) | ✓ | `517` |
