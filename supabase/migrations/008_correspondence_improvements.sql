-- Correspondence improvements for upload + AI extraction
ALTER TABLE public.correspondence ADD COLUMN IF NOT EXISTS file_path text;
ALTER TABLE public.correspondence ADD COLUMN IF NOT EXISTS file_type text;
ALTER TABLE public.correspondence ADD COLUMN IF NOT EXISTS file_size integer;
ALTER TABLE public.correspondence ADD COLUMN IF NOT EXISTS extracted_text text;
ALTER TABLE public.correspondence ADD COLUMN IF NOT EXISTS to_party text;
ALTER TABLE public.correspondence ADD COLUMN IF NOT EXISTS correspondence_type text;
ALTER TABLE public.correspondence ADD COLUMN IF NOT EXISTS ai_summary text;
ALTER TABLE public.correspondence ADD COLUMN IF NOT EXISTS processed boolean DEFAULT false;
