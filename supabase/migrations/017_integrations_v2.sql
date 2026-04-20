-- Integrations v2: per-contract integrations, sync scheduling, auto-obligation flag, sync logs

-- Extend integrations table
ALTER TABLE public.integrations ADD COLUMN IF NOT EXISTS contract_id uuid REFERENCES public.contracts(id) ON DELETE CASCADE;
ALTER TABLE public.integrations ADD COLUMN IF NOT EXISTS sync_frequency_hours integer DEFAULT 6;
ALTER TABLE public.integrations ADD COLUMN IF NOT EXISTS auto_create_obligations boolean DEFAULT true;
ALTER TABLE public.integrations ADD COLUMN IF NOT EXISTS last_sync_item_count integer DEFAULT 0;
ALTER TABLE public.integrations ADD COLUMN IF NOT EXISTS total_items_synced integer DEFAULT 0;

-- Integrations are now per (user, contract, platform) — replace old user+platform uniqueness
ALTER TABLE public.integrations DROP CONSTRAINT IF EXISTS integrations_user_id_platform_key;
CREATE UNIQUE INDEX IF NOT EXISTS integrations_user_contract_platform_uniq
  ON public.integrations(user_id, contract_id, platform)
  WHERE contract_id IS NOT NULL;

-- Legacy (contract_id NULL) rows keep the older user+platform uniqueness so we don't break existing data
CREATE UNIQUE INDEX IF NOT EXISTS integrations_user_platform_legacy_uniq
  ON public.integrations(user_id, platform)
  WHERE contract_id IS NULL;

CREATE INDEX IF NOT EXISTS integrations_contract_idx ON public.integrations(contract_id);

-- Per-sync audit log
CREATE TABLE IF NOT EXISTS public.integration_sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id uuid REFERENCES public.integrations(id) ON DELETE CASCADE NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  status text DEFAULT 'running' CHECK (status IN ('running','success','error','partial')),
  items_synced integer DEFAULT 0,
  items_new integer DEFAULT 0,
  obligations_created integer DEFAULT 0,
  error_message text
);

CREATE INDEX IF NOT EXISTS integration_sync_logs_integration_started_idx
  ON public.integration_sync_logs(integration_id, started_at DESC);

ALTER TABLE public.integration_sync_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own sync logs" ON public.integration_sync_logs;
CREATE POLICY "Users read own sync logs" ON public.integration_sync_logs
  FOR SELECT USING (
    integration_id IN (SELECT id FROM public.integrations WHERE user_id = auth.uid())
  );
