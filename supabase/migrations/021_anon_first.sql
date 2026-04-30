-- Anon-first launch: additive schema for anonymous users + usage counters + signup throttle.
-- All changes are additive. No DROPs, no destructive UPDATEs. Rollback in down_021_anon_first.sql.
--
-- Live config flip required separately: in supabase/config.toml set enable_anonymous_sign_ins=true,
-- then push to live project (or flip in Supabase dashboard).

-- ─── Profiles: anon flag + usage counters ──────────────────────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_anonymous boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS anon_linked_at timestamptz;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS messages_sent integer DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bytes_uploaded bigint DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_active_at timestamptz DEFAULT now();

-- ─── New 'free' tier value, keep existing values valid ─────────────────────
-- The current CHECK constraint is on values: trial, trial_expired, paid, paid_past_due, cancelled.
-- We add 'free' without dropping the others (so existing rows are unaffected).
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_subscription_tier_check
  CHECK (subscription_tier IN ('free', 'trial', 'trial_expired', 'paid', 'paid_past_due', 'cancelled'));

-- ─── handle_new_user trigger: copy is_anonymous from auth.users ────────────
-- Supabase sets auth.users.is_anonymous=true on signInAnonymously().
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, is_anonymous, last_active_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.is_anonymous, false),
    now()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger already exists (created in 001_initial_schema); the CREATE OR REPLACE above swaps the function body.

-- ─── Anon signup throttle log (3 / IP / 24h) ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.anon_signup_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text NOT NULL,
  user_agent_hash text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS anon_signup_log_ip_created_idx
  ON public.anon_signup_log(ip_hash, created_at DESC);

ALTER TABLE public.anon_signup_log ENABLE ROW LEVEL SECURITY;
-- No SELECT policies — only service-role reads via /api/auth/anon-start.

-- ─── Sample contract marker ───────────────────────────────────────────────
ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS is_sample_clone boolean DEFAULT false;

-- ─── Optional: pg_cron retention sweep (deferred — apply manually) ────────
-- Uncomment + run in Supabase SQL editor with pg_cron extension enabled:
--
--   CREATE EXTENSION IF NOT EXISTS pg_cron;
--   SELECT cron.schedule(
--     'cleanup-anon-users',
--     '0 3 * * *',
--     $$ DELETE FROM auth.users
--          WHERE is_anonymous = true
--          AND COALESCE(last_sign_in_at, created_at) < now() - interval '30 days' $$
--   );
-- The deletion cascades to public.profiles and downstream user-data tables via existing FK ON DELETE CASCADE.
