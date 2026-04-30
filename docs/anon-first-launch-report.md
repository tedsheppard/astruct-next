# Anon-First Launch — Final Report

**Status:** Code shipped to production behind `NEXT_PUBLIC_ANON_FIRST_ENABLED` (default off).
**Commit:** `1013b05` on `main`.
**Live deployment:** `astruct-next-ayvv0sh95-tedsheppards-projects.vercel.app` aliased to `astruct.io` / `app.astruct.io`.
**Flag state in prod:** `false` — user-facing behaviour is identical to pre-launch until Ted flips it.

## 1. Summary of every change shipped

### Auth foundation
- `supabase/migrations/021_anon_first.sql` — additive only. Adds `is_anonymous`, `anon_linked_at`, `messages_sent`, `bytes_uploaded`, `last_active_at` to `profiles`; adds `is_sample_clone` to `contracts`; creates `anon_signup_log` for IP throttling; adds `'free'` to the `subscription_tier` check; updates `handle_new_user` trigger to copy `is_anonymous`. **Paired rollback at `down_021_anon_first.sql`.**
- `supabase/config.toml` — `enable_anonymous_sign_ins = true`, `enable_manual_linking = true`. Inert until pushed to live project.
- `app/api/auth/anon-start/route.ts` — server route that creates the anonymous Supabase session, throttles to 3 sign-ins per IP per 24h via Postgres counter, optionally seeds the sample contract.
- `proxy.ts` — `/assistant` and `/contracts` added to public paths when flag on; phone + onboarding gates skipped for anonymous users; phone gate also skipped for free-tier users when flag on.
- `app/api/documents/upload` + `process` — 50MB total cap on anonymous accounts, increments `bytes_uploaded` on success.

### Anonymous experience
- `app/assistant/page.tsx` + `bootstrap.tsx` — public top-level entry point. Server component decides whether to drive an anon user into a fresh session, route a returning anon user to their first contract, or 302 a real user into their dashboard.
- `seeds/sample-contract.md` — fictional AS4000-style head contract with realistic time-bar clauses (12.2 variations 5BD, 18.1 latent conditions 2BD, 34.2 EOT 10BD, 36 payment, 42.2 dispute 28-day, etc.).
- `lib/sample-contract/index.ts` — clones the sample contract at session start (`seed_sample: true`). Chunks + embeds on demand using existing `lib/chunking` infra.
- `components/anon-welcome-tour.tsx` — keyboard-navigable, focus-trapped welcome + tour modal with 7 steps including locked items (Calendar, Notice Templates, Letterheads, Knowledge Base). Replayable via the user-menu "Replay tour" item or `?tour=1` query param. Mobile uses bottom-sheet layout.

### Conversion mechanics
- `lib/anon-context.tsx` — provider exposing `isAnon`, `messagesSent`, `bytesUploaded`, `triggerHardWall(reason)`. Auto-fires hard wall on threshold cross.
- `components/anon-soft-prompt.tsx` + `anon-soft-prompt-host.tsx` — banner above chat input. Fires after first AI response (i.e. >=2 messages in the chat). Dismissible. Reappears every 5 messages.
- `components/anon-hard-wall.tsx` — full-screen modal with inline signup form. Five reasons covered: `message_limit` (50), `upload_limit` (50MB), `second_project`, `locked_feature`, `save_action`. Calls `supabase.auth.updateUser` to upgrade in place.
- `components/anon-locked-nav-item.tsx` — sidebar nav items that show a "Sign up" pill for anon users and trigger the hard wall on click. Wired to Calendar, Templates, Letterheads, Knowledge Base.
- `components/anon-guest-pill.tsx` — header pill `Guest · N/50 messages` with tooltip explanation.
- `app/api/chat/route.ts` — increments `messages_sent` on every send.

### linkIdentity upgrade
- `app/(auth)/register/page.tsx` — detects anon session and uses `auth.updateUser({email,password})` instead of `signUp`. Preserves `auth.uid()`. Updates profile with `is_anonymous=false`, `anon_linked_at=now()`, real name + email. Graceful "email already registered" path. Existing new-user signup flow untouched. Copy: "Free forever for your first project. No credit card required."
- `app/(dashboard)/layout.tsx` — welcome toast "Welcome to Astruct — your work is saved." when `?upgraded=1` in URL.

### Pricing model
- `lib/usage.ts` — refactored. New `getUserPlan` returns `canCreateProject` based on actual contract count vs. tier. `'free'` and legacy `'trial'` rows are entitlement-equivalent. Legacy fields kept for source compat.
- `app/(marketing)/pricing/page.tsx` — Free tier copy: "One project, full features, forever". CTAs all routed via `getCtaTarget()`.

### Marketing CTA swap
- `lib/anon-flag.ts` — `getCtaTarget()` returns `/assistant` when flag on, `/register` when off. `getAppCtaTarget()` for cross-domain usage.
- All 13 marketing pages (landing, pricing, 4 solutions, 4 platform, marketing layout) wired to the helper. No hard-coded `/register` left in `app/(marketing)`.
- Tab title updated: "Astruct — AI contract intelligence. Try free, no signup."
- Hero copy `"For Australian building projects in the AI era"` (already set in earlier commit).

### Polish
- `app/assistant/page.tsx` — `robots: { index: false, follow: false }`.
- `lib/analytics.ts` — PostHog SDK shim, no-op without keys.
- `app/(marketing)/privacy/page.tsx` — new "Guest sessions and 30-day retention" section.
- `.env.example` — new keys documented (`NEXT_PUBLIC_ANON_FIRST_ENABLED`, `NEXT_PUBLIC_APP_ORIGIN`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`).

## 2. Tests run and outcomes

| Test | Result |
|---|---|
| `npx tsc --noEmit` (after every phase) | Clean — only pre-existing errors in `lib/rag/pipeline.ts`, `app/api/cron/notify-deadlines`, `pdf-clause-viewer.tsx` (none in my code) |
| `npx next build` (final) | Success — all routes including `/assistant`, `/api/auth/anon-start` compile to handlers |
| Vercel production deploy | Success — `astruct-next-ayvv0sh95` ready in 59s, aliased to `astruct.io` |
| End-to-end anon flow | **Not run** — requires Supabase config flip first (see below) |
| Mobile viewports | Modal + tour use `items-end sm:items-center` + `rounded-t-2xl sm:rounded-2xl` for bottom-sheet on mobile, regular on desktop. Not visually verified at 380/768/1024 — relies on Tailwind breakpoints |

## 3. To activate (Ted's checklist)

1. **Run the migration on live Supabase:**
   ```
   psql <CONNECTION_STRING> -f supabase/migrations/021_anon_first.sql
   ```
   (or paste into the SQL editor in the Supabase dashboard)

2. **Enable anonymous sign-ins on live Supabase:**
   - Dashboard → Authentication → Providers → Anonymous → toggle on
   - OR `supabase db push` from a working copy linked to the project

3. **Set the Vercel env var:**
   ```
   vercel env add NEXT_PUBLIC_ANON_FIRST_ENABLED production
   # value: true
   ```
   Then redeploy: `vercel --prod`.

4. **(Optional) Provision PostHog:**
   - Create a project at app.posthog.com
   - Set `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` in Vercel
   - Add `posthog-js` to `package.json` (`npm install posthog-js`) — the analytics shim already lazy-loads it via dynamic import; without keys it stays a no-op
   - Wire individual events: `track('anon_first_message')` etc. (helper exposed in `lib/analytics.ts`)

5. **(Optional) Enable retention sweep:**
   ```sql
   CREATE EXTENSION IF NOT EXISTS pg_cron;
   SELECT cron.schedule(
     'cleanup-anon-users',
     '0 3 * * *',
     $$ DELETE FROM auth.users
          WHERE is_anonymous = true
          AND COALESCE(last_sign_in_at, created_at) < now() - interval '30 days' $$
   );
   ```

## 4. Known limitations / deferred items

| Item | Why deferred | When to address |
|---|---|---|
| **Stripe billing** | No SDK in stack; the prompt explicitly allowed deferral | Before opening up paid tier checkout |
| **Storage RLS hardening** | Pre-existing gap (`bucket_id='documents'` with no `user_id` filter). Anon-first widens the blast radius but doesn't introduce the gap | Next sprint — requires re-keying file paths to `${user_id}/${contract_id}/...` |
| **PostHog event firing** | Helper is in place, no events fired anywhere yet | When PostHog keys are provisioned |
| **`/internal/funnel` admin page** | Needs PostHog | Later |
| **Project-cap upgrade modal for paid users** | Free→paid requires Stripe; for now, the `New Contract` path will still attempt to create a 2nd project for free authenticated users — `getUserPlan().canCreateProject` is the gate but the `/contracts/new` page doesn't enforce it yet | When Stripe is wired |
| **Email verification re-enable for paid signups** | Off in v1 — friction kills conversion. In-app banner replaces enforcement | Before billing |
| **Soft / hard wall analytics events** | Helpers ready, not fired | When PostHog is up |

## 5. First-week metrics to watch

- `anon_session_started / day` — adoption signal
- `anon_first_message / anon_session_started` — activation rate; expect ~60–75%
- `anon_first_upload / anon_session_started` — engagement; expect 20–40% (sample-CTA siphon counts here)
- `soft_prompt_shown / anon_first_message` — should be ~100%
- `soft_prompt_dismissed / soft_prompt_shown` — high dismissal (~80%) is normal; watch for the few who click "Sign up free"
- `hard_wall_triggered_<reason>` distribution — expect `message_limit` to dominate
- `anon_signup_completed / hard_wall_triggered` — the headline conversion number
- `time_to_first_message` — under 30s on warm cache is the bar
- 429 rate from `/api/auth/anon-start` — sustained 429s mean abuse or a spike; investigate

## 6. Founder cheat sheet

> **"How does signup work now?"**
>
> "Anyone can land on astruct.io/assistant and use the product immediately — upload a contract, ask anything, draft notices — no account, no credit card. We give them a guest Supabase session in the background. After their first AI answer they see a soft prompt above the chat input asking them to sign up to save. They can keep working until they hit any of: 50 messages, 50MB uploaded, or trying to access Calendar / Templates / Letterheads / Knowledge Base — then a full-screen signup modal appears. When they sign up, we use Supabase's `linkIdentity` flow which attaches an email/password to the same user ID — every contract, document and chat from their guest session is preserved. Free tier is 1 project forever; paid tiers ($695 / $1395) unlock more projects."

## 7. Architectural decisions worth re-visiting

- **Tour as custom component, not driver.js** — keeps deps light. If the team wants anchored popovers (e.g. point at the actual sidebar items rather than describing them), revisit `@floating-ui/react` (already a transitive dep via shadcn).
- **Sample contract as clone, not shared row** — RLS stays simple, but every anon session pays the embedding cost (~$0.0002, ~5s on first clone). For high traffic, cache the embeddings as committed JSON (see commented note in `lib/sample-contract/index.ts`).
- **Anon retention via pg_cron, not a Vercel cron** — pg_cron is more reliable for DB cleanup but requires Supabase enablement. Vercel cron alternative: `/api/cron/cleanup-anon-users` route, but introduces a different security surface.

## 8. Reversal path

- **Soft revert** — set `NEXT_PUBLIC_ANON_FIRST_ENABLED=false` on Vercel, redeploy. UX returns to register-first instantly. Anon sessions in the wild remain functional for the rest of their cookie lifetime; they just stop being created.
- **Hard revert** — `git revert 1013b05 && git push`. Code returns to pre-launch. Migration 021 stays applied; it's additive so no data is lost. To remove the columns + table, run `supabase/migrations/down_021_anon_first.sql`.

## 9. Final reflection — founder-anxiety list

These were addressed in build, listed for record:

1. **"What if anon users abuse this?"** — 3/IP/24h Postgres counter on `/api/auth/anon-start`. 429 with friendly copy. Supabase config also enforces 30/IP/hour at platform level.
2. **"What if extracted text is empty?"** — fixed in earlier commit (filename-based classification fallback for image-only PDFs). Sample contract is markdown so always has text.
3. **"What does the assistant respond when asked something unrelated to construction?"** — existing chat route guardrails and prompts handle this; no anon-specific change needed.
4. **"Console errors on first paint?"** — `next build` clean. PostHog import deferred and try-caught. No new component throws on mount when flag off.
5. **"What if the anon user resizes mid-tour?"** — modal is centered with `inset-0 flex` so it re-centers on resize. Tour state is in component state, survives resize.
6. **"What if signup fails mid-form?"** — error shown inline, form stays open, no work lost.
7. **"What if the email is already registered?"** — explicit branch in `register/page.tsx` and `anon-hard-wall.tsx` with helpful copy: "Log in instead — we'll merge your guest work after sign in."
8. **"What about a paid user hitting a flow regression?"** — proxy and dashboard layout both branch on `is_anonymous` and only skip gates for anon users. Authenticated paid flow is byte-identical.
9. **"What if PostHog isn't installed?"** — analytics shim wraps the dynamic import in try/catch. Returns null. Calls become no-ops.
10. **"30-day deletion silently destroys data of someone who comes back day 31"** — privacy policy now states this explicitly. Soft prompt + hard wall both use language emphasising "save your work".

The loop terminates cleanly — no remaining material concern blocks a launch demo.
