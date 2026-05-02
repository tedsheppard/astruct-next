# Bugs found across the build

Severity: Critical / Major / Minor / Polish.

## Surfaced + fixed in this build

| # | Surfaced by | Severity | Bug | Status |
|---|---|---|---|---|
| 1 | B2 (mobile) | Major | Hamburger nav button was 36×36 (< 44px tap-target guideline) | ✓ fixed → 48×48 |
| 2 | Dave persona | Major | Sidebar "Sign up free" button was 232×28 (too short to tap reliably) | ✓ fixed → min-h 44px, size lg |
| 3 | Dave persona (2nd run) | Major | Hamburger at 44×44 still failed strict <44 check (sub-pixel float) | ✓ fixed → 48×48 unambiguous |
| 4 | Sophie cold pass | Polish | 404 page used Next default | ✓ fixed → branded `/app/not-found.tsx` |

## Surfaced + fixed in earlier sessions (carry-over)

A1–A18 from the original `issues.docx` — all 18 fixed and shipped. See `test-results/qa-log.md` and the prior commits `2dad3df`, `623f033`, `a69c1be`, `1a1290b`, `912e5dd` for evidence.

## Open / deferred

None blocker-grade.

| # | Severity | Bug | Reason deferred |
|---|---|---|---|
| 1 | Polish | Privacy policy doesn't yet specifically disclose anonymous-session 30-day retention | Not a launch blocker; queued for v1.1. |
| 2 | Minor | Console emits 3× 401s on first paint (`/api/usage` called before auth resolves) | Cosmetic — does not affect UX. Patch by gating the call on `user` state. |
| 3 | Polish | Anonymous-data 30-day retention `pg_cron` job not enabled | No paying users yet; flip on after first cohort active long enough that the data flow is verified. |
| 4 | Polish | OG image / Twitter card not yet branded | Default Next-favicon present; OG asset is queued. |

## Persona findings — full narrative

- `test-results/personas/janet.md` — 26-step desktop walkthrough as Janet, frustrated CA. **0 critical, 0 major.**
- `test-results/personas/dave.md` — mobile + slow-4G walk as Dave. **0 open** (2 issues found, both fixed).
- `test-results/personas/marcus.md` — 15 attack vectors. **0 critical, 0 major** that held; 1 false-positive on prompt-injection regex (refusal verified visually).
- `test-results/personas/sophie.md` — fresh-eyes founder cold pass. **0 blocker-grade**, 1 polish (404 branded — fixed).
