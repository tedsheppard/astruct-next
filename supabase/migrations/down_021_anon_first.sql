-- Rollback for 021_anon_first.sql. Run by hand if needed.
-- Does NOT delete rows in anon_signup_log unless you uncomment the line below.

-- 1. Restore the original handle_new_user function body
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''), NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Restore the original tier constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_subscription_tier_check
  CHECK (subscription_tier IN ('trial','trial_expired','paid','paid_past_due','cancelled'));

-- 3. Drop added columns (will lose any usage data)
ALTER TABLE public.contracts DROP COLUMN IF EXISTS is_sample_clone;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS last_active_at;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS bytes_uploaded;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS messages_sent;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS anon_linked_at;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS is_anonymous;

-- 4. Drop signup throttle log
-- DELETE FROM public.anon_signup_log;
DROP TABLE IF EXISTS public.anon_signup_log;
