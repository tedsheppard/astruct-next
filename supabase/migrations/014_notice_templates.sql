-- Notice types discovered from contract analysis
CREATE TABLE public.notice_types (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id uuid REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  clause_references text[] DEFAULT '{}',
  formal_requirements jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Generated notice templates
CREATE TABLE public.notice_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  notice_type_id uuid REFERENCES public.notice_types(id) ON DELETE CASCADE NOT NULL,
  contract_id uuid REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
  body text NOT NULL DEFAULT '',
  placeholders jsonb DEFAULT '{}',
  status text DEFAULT 'draft_generated' CHECK (status IN ('draft_generated', 'user_edited', 'finalised')),
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Template version history
CREATE TABLE public.notice_template_versions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  notice_template_id uuid REFERENCES public.notice_templates(id) ON DELETE CASCADE NOT NULL,
  body text NOT NULL,
  placeholders jsonb DEFAULT '{}',
  version integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE public.notice_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notice_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notice_template_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own notice_types" ON public.notice_types FOR ALL
  USING (contract_id IN (SELECT id FROM public.contracts WHERE user_id = auth.uid()));

CREATE POLICY "Users manage own notice_templates" ON public.notice_templates FOR ALL
  USING (contract_id IN (SELECT id FROM public.contracts WHERE user_id = auth.uid()));

CREATE POLICY "Users manage own notice_template_versions" ON public.notice_template_versions FOR ALL
  USING (notice_template_id IN (
    SELECT id FROM public.notice_templates WHERE contract_id IN (
      SELECT id FROM public.contracts WHERE user_id = auth.uid()
    )
  ));

-- Flag on contracts to track whether notice identification has run
ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS notice_types_scanned boolean DEFAULT false;
