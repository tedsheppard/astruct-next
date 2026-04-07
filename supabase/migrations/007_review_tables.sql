-- Review tables
CREATE TABLE public.review_tables (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id uuid REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'complete', 'error')),
  document_ids uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Column definitions for a review table
CREATE TABLE public.review_columns (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  review_table_id uuid REFERENCES public.review_tables(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  data_type text DEFAULT 'text' CHECK (data_type IN ('text', 'date', 'currency', 'number', 'verbatim', 'boolean', 'clause_ref')),
  column_order integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Extracted cell values
CREATE TABLE public.review_cells (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  review_table_id uuid REFERENCES public.review_tables(id) ON DELETE CASCADE NOT NULL,
  review_column_id uuid REFERENCES public.review_columns(id) ON DELETE CASCADE NOT NULL,
  document_id uuid REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  value text,
  raw_excerpt text,
  confidence float,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'complete', 'error', 'not_found')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(review_table_id, review_column_id, document_id)
);

-- RLS
ALTER TABLE public.review_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_cells ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own review_tables" ON public.review_tables FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users manage own review_columns" ON public.review_columns FOR ALL USING (review_table_id IN (SELECT id FROM public.review_tables WHERE user_id = auth.uid()));
CREATE POLICY "Users manage own review_cells" ON public.review_cells FOR ALL USING (review_table_id IN (SELECT id FROM public.review_tables WHERE user_id = auth.uid()));
