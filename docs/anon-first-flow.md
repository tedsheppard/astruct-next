# Anon-First Flow — Architecture Decision Record

Status: **Proposed** — pending sign-off before Phase 1 mutation
Author: Claude Code (with Ted)
Last updated: 2026-04-30

## 1. Goal

Replace the signup-first flow with a ChatGPT-style anonymous-first experience: any visitor can land on the assistant, upload a contract, ask questions, and draft notices without an account. They convert via `linkIdentity` once they hit a value threshold (50 messages, 50MB uploaded, or a feature gate). Free tier becomes "1 project, forever" — not a 14-day trial.

## 2. Current state — the relevant facts

Pulled from Phase 0 discovery (5 parallel Explore agents, full reports retained in scratch).

**Auth + middleware**
- `proxy.ts` redirects all unauthenticated traffic on non-public paths to `/login`. Public path list does not include `/assistant`, `/try`, or `/contracts/*/assistant`.
- The auth chain is hard: signup → email verify → phone verify (Twilio OTP, mandatory) → `/setup` (company onboarding) → `/contracts?walkthrough=1`. There is no path to the assistant that skips any of these gates.
- Supabase `enable_anonymous_sign_ins = false` in `supabase/config.toml`. `anonymous_users = 30` rate limit per IP/hour is already configured but inert.
- `handle_new_user` trigger autocreates a `profiles` row on every `auth.users` insert. Will fire for anon users and copy `email = ''` and `name = ''`.
- `app/auth/callback/route.ts` already handles Supabase `exchangeCodeForSession` for email confirmation.

**Existing freemium scaffolding (mostly inert)**
- `lib/usage.ts` exports `TRIAL_QUERY_LIMIT=50`, `TRIAL_CONTRACT_LIMIT=1`, `TRIAL_DURATION_DAYS=14`, `getUserPlan`, `incrementQueryCount`, `incrementContractCount`. **Not called anywhere.**
- `components/usage-meter.tsx` is mounted in dashboard sidebar, reads `/api/usage`. Hidden for `tier='paid'`.
- `components/upgrade-wall.tsx` exists but is never rendered. Mentions "$249/mo Professional" — stale.
- `profiles` columns: `subscription_tier ∈ {trial, trial_expired, paid, paid_past_due, cancelled}`, `trial_started_at`, `trial_ends_at`, `trial_queries_used`, `trial_contracts_created`, `phone_*`, `stripe_customer_id`, `stripe_subscription_id`. All `stripe_*` columns unused.
- `016_freemium.sql` grandfathers all pre-existing users to `tier='paid'` + `phone_verified=true`.

**RLS posture**
- Every user-data table (contracts, documents, chunks, obligations, notices, chat_sessions, chat_messages, correspondence, review_*, notice_*, integrations, integration_sync_logs, knowledge_base_documents) gates on `auth.uid() = user_id` directly or transitively. Anon users will work natively because `auth.uid()` returns the anon user's UUID — they will only see their own rows.
- `waitlist`: open insert. Fine.
- `obligation_clause_priors`: no RLS — public read. Fine, this is reference data.
- `storage.objects` for `documents` bucket: `TO authenticated WITH CHECK (bucket_id='documents')` — does NOT filter by `user_id` or path. Any authenticated session (including anon) can read/write to any path. This is pre-existing and a real risk; mitigation in §5.

**Marketing**
- Hero copy already changed to "For Australian building projects in the AI era" (commit `20dced7`).
- Pricing page already has the new tiers (Free $0, Professional $695, Professional Max $1,395, Enterprise). Two "Start free trial" CTA labels and one "14-day free trial" string still live (in `register/page.tsx`).
- Every solution + platform CTA points at `/register`, not `/assistant`.
- No Stripe SDK. No analytics provider installed.

**Sample / demo content**
- None. No `is_sample`/`is_demo` columns. No seeded contract.

## 3. Decisions

### D1. Anon-session model: real Supabase anonymous users (not session-only)

We use `supabase.auth.signInAnonymously()`. This gives us a real `auth.users` row with `is_anonymous=true` in the JWT. RLS works natively without rewriting policies. `linkIdentity()` then attaches an email/password to the *same* `auth.users` row — `auth.uid()` is preserved, so all existing rows stay attached. No data migration on conversion.

Rejected alternative: a "guest contract" backed by a service-role-key proxy and ephemeral cookies. Avoids real auth.users rows but forces RLS rewrites for every table (or service-role queries everywhere — terrible posture). Not worth it.

### D2. Entry route: `/assistant` becomes a public top-level shim

Currently `/assistant` doesn't exist as a route. We add `app/assistant/page.tsx` (server component) which:
1. Reads the Supabase session.
2. If signed in (anon or auth) and they have ≥1 contract → 302 to `/contracts/{firstId}/assistant`.
3. If signed in but no contract → 302 to `/contracts/new` OR auto-create an empty contract and 302 to its assistant (decision deferred until Phase 2 pickup of the sample-contract pattern).
4. If not signed in → call `signInAnonymously()` server-side, write cookie, redirect as in (3).

The `/contracts/[id]/assistant` page itself stays as it is. Adding a public shim is less invasive than reworking the dashboard layout.

### D3. Sample contract: clone-on-first-visit, not read-only shared row

Anon users get a private clone of a curated AS4000-style head contract written into their own `contracts` row at session start. Reasons:
- RLS stays clean: no special "sample-shared-with-everyone" policy.
- They can ask questions and the LLM has real chunks to retrieve from.
- If they later upload their own contract, they get their second slot — the sample is their first.
- The prompt suggested either "read-only reference" or "let them choose at session start." We pick the latter, presented in the welcome modal: **"Upload my contract"** (opens upload, sample is not seeded) vs **"Try with a sample"** (seeds the sample as their first contract). Less friction, no shared-row weirdness.

The seed contract lives at `seeds/sample-contract/` (PDF + pre-extracted text + pre-computed embeddings JSON). Clone routine inserts the contract row, document row, chunk rows. Cost: ~50KB JSON ingested per anon user. Acceptable.

### D4. Pricing model: project-based, free-forever-1

`subscription_tier` semantics change:
- `'free'` (new) — 1 project, full features.
- `'paid'` — multi-project (Professional / Professional Max).
- Drop `'trial'`, `'trial_expired'`. Migration grandfathers existing `'trial'` users to `'free'`, keeps `'paid'` as-is.
- Drop `trial_started_at`, `trial_ends_at`, `trial_queries_used`, `trial_contracts_created`. (Or leave columns nullable for one release cycle — see Phase 5.)
- New: `is_anonymous BOOLEAN DEFAULT false` on profiles, kept in sync with JWT claim via the `handle_new_user` trigger (read from `NEW.is_anonymous` on auth.users).

Limit enforcement is at *project* count, not query/byte count for paid plans. Anon users have additional usage limits (50 msgs, 50MB) on top of the 1-project cap.

### D5. Conversion mechanics

- **Soft prompt** (not blocking): banner above input, fires after first AI response, dismissible, reappears every 5 messages. Implemented as a controlled component, not a modal. Driven by per-session counter in localStorage.
- **Hard wall** (blocking): full-screen modal with inline signup form. Triggers on:
  - `messages_sent >= 50`
  - `bytes_uploaded >= 52,428,800`
  - Attempt to create a 2nd contract
  - Click on Calendar / Letterheads / Notice Templates / Knowledge Base sidebar items
  - Click on any "save"-type action
- Counters in new `usage_counters` columns on `profiles`: `messages_sent INT`, `bytes_uploaded BIGINT`. Increment server-side in `/api/chat` and upload routes.

### D6. linkIdentity flow

Use `supabase.auth.updateUser({ email, password })` from the client when an anon user submits the inline signup form. Supabase converts the anon user to a permanent user, preserves `auth.uid()`. Then update profile: `is_anonymous=false`, populate `name`/`email` from form.

Email verification: **off for v1** (no `email_confirm` enforcement on the upgrade path). In-app banner prompts verification. Supabase still sends the verify email; clicking it works but isn't gated. This is a pragmatic choice — friction at conversion is the killer.

Phone verification: **dropped from the gating chain** for new flow. The proxy chain currently forces `/verify-phone` for anyone with `phone_verified=false`. We change proxy to only enforce phone for `subscription_tier='paid'` users (or skip entirely until a billing trigger). Existing users are grandfathered with `phone_verified=true` already; only new free-tier users will skip it.

### D7. Anon retention: 30 days, pg_cron job

A `cron.schedule('cleanup-anon-users', '0 3 * * *', ...)` job deletes `auth.users` rows where `is_anonymous=true AND last_sign_in_at < now() - interval '30 days'`. Cascade deletes their contracts, documents, etc. via existing FK ON DELETE CASCADE.

### D8. Walkthrough library: keep custom, don't add driver.js

`components/onboarding-walkthrough.tsx` already exists and works as a step-modal. We extend it with anchor-attached popovers for the sidebar items (a small custom positioning helper, ~50 LOC). Not worth a 30KB external dep when the existing component is stylistically close to what we want and already wired into `profiles.walkthrough_completed`.

If the popover positioning becomes painful, we revisit and pull in `@floating-ui/react` (which is what shadcn already uses for tooltips/popover — no new dep).

### D9. IP rate limiting on anon signup: Postgres-backed counter

No Upstash/Redis in stack. The existing OTP rate limiter is a non-distributed in-memory `Map` — useless on serverless. We create a tiny `anon_signup_log(ip_hash text, signed_up_at timestamptz)` table, gate `signInAnonymously` behind a server route that checks `count(*) WHERE ip_hash=? AND signed_up_at > now() - 24h < 3`. IP is sha256-hashed before storage. Returns 429 with the friendly message above the limit.

### D10. Analytics: PostHog if Ted provides keys, else defer

PostHog is the right call (cheap, GDPR-friendly, has the funnel UI we need). I'll wire the SDK and event-firing code, but leave the `NEXT_PUBLIC_POSTHOG_KEY` empty in `.env.example`. If Ted provisions a project I'll plug the key in. Without keys, events become no-ops at runtime; no breakage.

### D11. Existing constraints from prior tasks

The integrations task had a "DO NOT modify proxy.ts / lib/rag/** / app/api/chat/** / lib/obligations/** / app/api/classifier/** / app/api/obligations/** / app/api/notice-templates/** / app/(dashboard)/layout.tsx" constraint. That was task-scoped (Ted has since landed lib/rag/* changes himself).

For this anon-first work we **must** modify `proxy.ts`, `app/api/chat/route.ts`, `app/(dashboard)/layout.tsx`. I'm treating the prior constraint as expired but will flag this explicitly to Ted before pushing the first proxy/auth change.

## 4. Open questions / blockers requiring Ted's input

These are the things I'm not willing to guess on because they touch live infra or external accounts:

1. **Supabase live config flip.** `enable_anonymous_sign_ins=true` must be set on the live Supabase project. The local `config.toml` change won't propagate without a `supabase db push` against a linked project ref + a Supabase access token. **Need from Ted: Supabase project ref + access token, OR confirmation that he'll flip this in the Supabase dashboard.**

2. **PostHog account.** If we want the funnel dashboard the prompt asks for, **Ted needs to provision a PostHog project** and share `NEXT_PUBLIC_POSTHOG_KEY` + `NEXT_PUBLIC_POSTHOG_HOST`. Otherwise Phase 7's "/internal/funnel admin page" can't exist.

3. **Stripe.** Prompt explicitly allows deferral. Confirming we defer.

4. **Storage RLS hardening.** `storage.objects` for the `documents` bucket has no per-user filter. This is a pre-existing security gap that the anon-first launch doesn't *create* but does *increase the blast radius of* (anon visitors are real `authenticated`-role sessions). Tightening it requires changing the storage path scheme to be `${user_id}/${contract_id}/...` and migrating existing files. **Need from Ted: green light to do this migration in Phase 1 or accept the risk for v1.**

5. **Existing users on `tier='trial'` with stale trial dates.** Migration `016_freemium` set existing accounts to `'paid'` only if `created_at < now() - 1 minute`. Any user who registered *after* the migration is on `'trial'` with `trial_ends_at` 14 days out. The new model has no `'trial'`. We migrate these to `'free'`. **Confirming with Ted: this is the desired behaviour.**

6. **Walkthrough re-trigger for existing users.** Should existing logged-in users see the new tour? Default: no — only users with `walkthrough_completed=false`.

7. **Demo / sample contract content.** I can write a fictional AS4000-style head contract or extract from one of the existing PDFs in `qbcc-site` / `Sopal`. **Need direction: Ted writes one, I draft one for review, or we use a public-domain template like the QLD government's standard form?**

## 5. Risk register (short)

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Anon signup gets abused (3/IP/24h not enough) | Medium | Medium | Postgres counter monitors hit rate; can tighten or add per-fingerprint check later |
| Storage RLS gap exploited via anon session | Low–Med | High | §4.4 hardening before launch, or accept and add Cloudflare-level URL rate limit |
| linkIdentity fails for already-registered email | Low | Low | Catch error, show "That email is already registered. Log in?" |
| Anon user runs up our LLM bill before signup | Med | Med | Hard wall at 50 messages is the safety valve. Plus per-IP signup throttle. |
| 30-day cleanup deletes data of a user who comes back day 31 | Low | Med | Document in privacy policy; "we can't recover deleted anon work" is fine UX |
| Existing paid users hit a flow regression | Med | High | Phase-end test: log in as a known `tier='paid'` account and run end-to-end |

## 6. What I'm not deciding here

- The exact welcome-modal copy (Phase 2)
- Tour step ordering when sidebar items are hidden vs locked-with-icon (Phase 2)
- The exact funnel events list (Phase 3 — covered in DAG)
- Stripe wiring (deferred)
- Server-side anon session creation in middleware vs client-side at first paint (Phase 1 — leaning client-side via `lib/supabase/client.ts` for simplicity, but server-side via `proxy.ts` is also viable)
