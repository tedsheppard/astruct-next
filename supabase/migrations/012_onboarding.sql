ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS walkthrough_completed boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_role text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_source text;

-- Set existing users as onboarded
UPDATE public.profiles SET onboarding_completed = true WHERE company_name IS NOT NULL AND company_name != '';
