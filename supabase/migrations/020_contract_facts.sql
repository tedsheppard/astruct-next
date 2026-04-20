ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS extracted_facts jsonb DEFAULT '{}';
ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS facts_extracted_at timestamptz;
ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS facts_verified_by_user boolean DEFAULT false;
ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS facts_verification_prompted boolean DEFAULT false;
