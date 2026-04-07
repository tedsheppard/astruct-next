ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS feedback text CHECK (feedback IN ('positive', 'negative'));
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS feedback_at timestamptz;
