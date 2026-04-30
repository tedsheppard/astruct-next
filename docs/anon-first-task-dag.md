# Anon-First Task DAG

```
                              ┌─────────────────────┐
                              │ P0 Discovery + ADR  │  ← done
                              │ (this doc)          │
                              └──────────┬──────────┘
                                         │
                                         ▼
                          ┌──────────────────────────┐
                          │ Ted gates:               │
                          │ • Supabase project access│
                          │ • PostHog keys (or skip) │
                          │ • Storage RLS approval   │
                          │ • Sample contract source │
                          └──────────┬───────────────┘
                                     │
                                     ▼
        ┌────────────────────────────────────────────────────────┐
        │                    PHASE 1 — sequential                 │
        │  1.1 Supabase config: enable_anonymous_sign_ins=true    │
        │  1.2 Migration 021: profiles.is_anonymous, retention,   │
        │       usage_counters columns, anon_signup_log table     │
        │  1.3 handle_new_user trigger: copy is_anonymous flag    │
        │  1.4 RLS audit pass — confirm anon JWT works on each    │
        │       user-data table (read-only test)                  │
        │  1.5 IP rate limit endpoint /api/auth/anon-start        │
        │       (creates session, throttles by hashed IP)         │
        │  1.6 50MB upload cap for is_anonymous=true users        │
        │  1.7 pg_cron: 30-day anon retention sweep (idle)        │
        └─────┬─────────────────────────────────────────────┬────┘
              │                                              │
              ▼                                              ▼
    ┌─────────────────────────┐               ┌──────────────────────────┐
    │ PHASE 2a (parallel)     │               │ PHASE 2b (parallel)      │
    │ Welcome modal +         │               │ Sample contract pipeline │
    │ /assistant route shim   │               │  • Source content        │
    │  • welcome-modal.tsx    │               │  • Pre-extract + embed   │
    │  • app/assistant/       │               │  • seeds/sample.json     │
    │       page.tsx (server) │               │  • Clone routine         │
    │  • Replace setup chain  │               │       in /api/auth/      │
    │       for anon users    │               │       anon-start         │
    └─────────────────────────┘               └──────────────────────────┘
              │                                              │
              └──────────────────┬───────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │ PHASE 2c — sequential  │
                    │ Tour:                  │
                    │  • Repurpose existing  │
                    │    walkthrough         │
                    │  • Anchor popovers     │
                    │  • Locked sidebar      │
                    │    items (Calendar,    │
                    │    Letterheads, KB,    │
                    │    Notice Templates)   │
                    │  • Replay from header  │
                    └──────────┬─────────────┘
                               │
              ┌────────────────┼─────────────────┐
              ▼                ▼                 ▼
    ┌──────────────────┐ ┌──────────────┐ ┌─────────────────────┐
    │ P3a (parallel)   │ │ P3b parallel │ │ P3c (parallel)      │
    │ Soft prompt      │ │ Hard wall    │ │ Usage counters wire │
    │ banner           │ │ modal +      │ │  • /api/chat        │
    │  • Above input   │ │ inline form  │ │       increment     │
    │  • Reappears /5  │ │  • Triggers  │ │  • upload routes    │
    │  • Dismiss in    │ │  • Inline    │ │       increment     │
    │    localStorage  │ │    Supabase  │ │  • Header pill      │
    │                  │ │    updateUser│ │       reads counters│
    └──────────────────┘ └──────────────┘ └─────────────────────┘
              │                │                  │
              └────────────────┴─────────┬────────┘
                                          ▼
                          ┌────────────────────────────┐
                          │ PHASE 4 — sequential       │
                          │ linkIdentity upgrade flow  │
                          │  • /register detects anon  │
                          │       and uses updateUser  │
                          │  • Toast + walkthrough cue │
                          │  • Error: existing email   │
                          │  • Test: existing flow     │
                          │       still works          │
                          └────────────┬───────────────┘
                                        │
              ┌─────────────────────────┼──────────────────────────┐
              ▼                         ▼                          ▼
   ┌──────────────────────┐   ┌────────────────────┐   ┌──────────────────────┐
   │ P5 (parallel)        │   │ P6 (parallel)      │   │ P7a (parallel)       │
   │ Pricing copy +       │   │ Marketing CTA      │   │ Polish 1: states     │
   │ tier semantics       │   │ swap to /assistant │   │  • loading           │
   │  • Drop "trial"      │   │  • landing         │   │  • errors            │
   │  • Drop 14-day       │   │  • solutions/*     │   │  • empty             │
   │  • Migration: trial  │   │  • platform/*      │   │  • mobile bottom     │
   │       → free         │   │  • header + footer │   │       sheet for tour │
   │  • Project-cap       │   │  • meta tags       │   │                      │
   │       enforcement    │   │                    │   │                      │
   └──────────────────────┘   └────────────────────┘   └──────────────────────┘
              │                          │                          │
              └──────────────────────────┴───────────┬──────────────┘
                                                     ▼
                                      ┌──────────────────────────┐
                                      │ PHASE 7b — parallel      │
                                      │  • a11y audit            │
                                      │  • SEO: noindex /assistant│
                                      │  • Privacy + ToS update  │
                                      │  • Console hygiene pass  │
                                      │  • PostHog events        │
                                      │       (if keys)          │
                                      └────────────┬─────────────┘
                                                   ▼
                                      ┌──────────────────────────┐
                                      │ PHASE 8 — Reflection     │
                                      │  • Founder concern list  │
                                      │  • Address or document   │
                                      │  • Final report          │
                                      └──────────────────────────┘
```

## Sequential dependencies (must respect)

- P1 must complete before any other phase (everything else needs anon auth working).
- P2c (tour) needs P2a + P2b done so the tour has things to point at.
- P3 needs P1.2 (counter columns) done.
- P4 must come before P5 (pricing copy describes the upgrade flow that P4 implements).
- P7b's PostHog events depend on having events fire from P3 + P4.

## Parallelisable boundaries

Within each phase the listed items can run in parallel via `Agent` subagents, with this caveat: anything that touches `lib/supabase/server.ts`, `proxy.ts`, or `profiles` schema must NOT run in parallel — single-writer convention to avoid merge churn.

## Phase exit gates

Each phase ends with a planner-reflection commit on a checklist:
- What shipped, what was tested
- Console-clean E2E run for the phase
- Any new task discovered, queued or addressed
- Existing-user smoke test: log in as a `tier='paid'` account, click through main flows, no regressions

## What's deferred

- Stripe checkout — separate phase post-launch
- Email verification enforcement — re-enable before billing
- Storage RLS hardening — covered if Ted greenlights in §4.4 of ADR; otherwise documented as deferred risk
- `/internal/funnel` admin page — only if PostHog keys provided
