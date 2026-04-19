-- Freemium tier columns on profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'trial' CHECK (subscription_tier IN ('trial','trial_expired','paid','paid_past_due','cancelled'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trial_started_at timestamptz DEFAULT now();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz DEFAULT (now() + interval '14 days');
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trial_queries_used int DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trial_contracts_created int DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_verified boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_verification_code text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_verification_expires_at timestamptz;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

-- Grandfather existing users as paid + phone verified
UPDATE public.profiles SET subscription_tier = 'paid', phone_verified = true WHERE created_at < now() - interval '1 minute';
