# Current-state audit — 2026-05-02

Cross-referenced against the Section 3 Functional Scope of the ship-ready build prompt.

## Anonymous-first acquisition flow (§3.1)
| Item | State |
|---|---|
| `astruct.io` → `app.astruct.io/assistant` with anon Supabase session | ✓ working — `app/assistant/page.tsx` + `bootstrap.tsx` + `/api/auth/anon-start` |
| First-time welcome modal (Upload / Sample / Tour) | ◐ **partially working** — intro modal exists but only Upload variant; no Sample, no Tour |
| Interactive product tour (driver.js) | ✗ missing |
| Sample contract preload | ✗ missing |
| IP rate limit (3/24h) | ✓ working — `anon_signup_log` table + `MAX_SIGNUPS_PER_IP_PER_24H` constant |
| 50MB anon upload cap | ✓ working — `quick-init` enforces |
| 30-day anon retention cron | ✗ missing |

## Section 3.2 — the 18 carry-over bugs
All shipped in the previous session (commits `2dad3df`, `623f033`, `a69c1be`, `1a1290b`, `912e5dd`). Re-verified by the persona walkthroughs in `scripts/qa-persona-b1.mjs`, `qa-persona-b2.mjs`, `qa-persona-b3.mjs`.

## Section 3.3 — conversion mechanics
| Item | State |
|---|---|
| Soft prompt every-5-messages dismissible | ✓ `components/anon-soft-prompt.tsx` |
| Hard wall on message ≥50, upload ≥50MB, locked feature, 2nd contract | ✓ `components/anon-hard-wall.tsx` |
| Inline signup form on hard wall | ✓ working (email validation hardened in this session) |
| `linkIdentity` upgrade in place | ✓ `updateUser({ email, password })` — preserves `auth.uid()` |
| Telemetry events | ◐ partial — PostHog wired but not all events |

## Section 3.5 — payments (the big one)
**All greenfield.** No Stripe SDK was installed before this session. No `app/api/stripe/`. No subscriptions/usage_records/token_events tables. No pricing-tier UI beyond the stale `$695/$1395` cards in `app/(marketing)/pricing/page.tsx`. No customer portal config.

## Section 3.6 — ancillary
| Item | State |
|---|---|
| Marketing pricing page | ✗ stale (old $695 model) |
| Privacy policy | ◐ exists at `app/(marketing)/privacy/page.tsx` — needs anon disclosure check |
| Terms | ◐ exists at `app/(marketing)/terms/page.tsx` |
| Support / FAQ | ✗ FAQ missing |
| 404 / 500 styled | ◐ default Next 16 |
| Favicon / OG / Twitter cards | ◐ favicon present, OG image needs check |

## Mobile
- Hamburger drawer + sticky-bottom modals + 44px tap targets shipped this session
- Verified at 380×844 (iPhone 12 emulation) via `scripts/qa-persona-b2.mjs`
