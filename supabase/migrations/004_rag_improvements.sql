-- Add full-text search column to document_chunks
ALTER TABLE public.document_chunks ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE public.document_chunks ADD COLUMN IF NOT EXISTS section_heading text;
ALTER TABLE public.document_chunks ADD COLUMN IF NOT EXISTS clause_numbers text[] DEFAULT '{}';

-- Create GIN index for full-text search
CREATE INDEX IF NOT EXISTS idx_chunks_search_vector ON public.document_chunks USING gin(search_vector);

-- Create trigger to auto-update search_vector on insert/update
CREATE OR REPLACE FUNCTION update_chunk_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', COALESCE(NEW.content, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS chunk_search_vector_trigger ON public.document_chunks;
CREATE TRIGGER chunk_search_vector_trigger
  BEFORE INSERT OR UPDATE OF content ON public.document_chunks
  FOR EACH ROW EXECUTE FUNCTION update_chunk_search_vector();

-- Backfill existing chunks
UPDATE public.document_chunks SET search_vector = to_tsvector('english', COALESCE(content, '')) WHERE search_vector IS NULL;

-- Hybrid search function (vector + full-text)
CREATE OR REPLACE FUNCTION hybrid_search_chunks(
  query_embedding vector(1536),
  query_text text,
  match_threshold float,
  match_count int,
  filter_contract_id uuid,
  filter_document_ids uuid[] DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  document_id uuid,
  chunk_index integer,
  content text,
  metadata jsonb,
  section_heading text,
  clause_numbers text[],
  vector_similarity float,
  text_rank float,
  combined_score float
)
LANGUAGE sql STABLE
AS $$
  WITH vector_results AS (
    SELECT
      dc.id,
      dc.document_id,
      dc.chunk_index,
      dc.content,
      dc.metadata,
      dc.section_heading,
      dc.clause_numbers,
      1 - (dc.embedding <=> query_embedding) AS vector_similarity,
      0::float AS text_rank
    FROM document_chunks dc
    WHERE dc.contract_id = filter_contract_id
      AND (filter_document_ids IS NULL OR dc.document_id = ANY(filter_document_ids))
      AND 1 - (dc.embedding <=> query_embedding) > match_threshold
    ORDER BY dc.embedding <=> query_embedding
    LIMIT match_count * 2
  ),
  text_results AS (
    SELECT
      dc.id,
      dc.document_id,
      dc.chunk_index,
      dc.content,
      dc.metadata,
      dc.section_heading,
      dc.clause_numbers,
      0::float AS vector_similarity,
      ts_rank_cd(dc.search_vector, plainto_tsquery('english', query_text)) AS text_rank
    FROM document_chunks dc
    WHERE dc.contract_id = filter_contract_id
      AND (filter_document_ids IS NULL OR dc.document_id = ANY(filter_document_ids))
      AND dc.search_vector @@ plainto_tsquery('english', query_text)
      AND ts_rank_cd(dc.search_vector, plainto_tsquery('english', query_text)) > 0.01
    ORDER BY text_rank DESC
    LIMIT match_count
  ),
  combined AS (
    SELECT
      COALESCE(v.id, t.id) AS id,
      COALESCE(v.document_id, t.document_id) AS document_id,
      COALESCE(v.chunk_index, t.chunk_index) AS chunk_index,
      COALESCE(v.content, t.content) AS content,
      COALESCE(v.metadata, t.metadata) AS metadata,
      COALESCE(v.section_heading, t.section_heading) AS section_heading,
      COALESCE(v.clause_numbers, t.clause_numbers) AS clause_numbers,
      COALESCE(v.vector_similarity, 0) AS vector_similarity,
      COALESCE(t.text_rank, 0) AS text_rank,
      (COALESCE(v.vector_similarity, 0) * 0.7 + COALESCE(t.text_rank, 0) * 30 * 0.3) AS combined_score
    FROM vector_results v
    FULL OUTER JOIN text_results t ON v.id = t.id
  )
  SELECT * FROM combined
  ORDER BY combined_score DESC
  LIMIT match_count;
$$;

-- Function to get adjacent chunks for context expansion
CREATE OR REPLACE FUNCTION get_adjacent_chunks(
  target_chunk_id uuid,
  context_range int DEFAULT 1
)
RETURNS TABLE (
  id uuid,
  document_id uuid,
  chunk_index integer,
  content text,
  metadata jsonb,
  section_heading text,
  relation text
)
LANGUAGE sql STABLE
AS $$
  WITH target AS (
    SELECT document_id, chunk_index FROM document_chunks WHERE id = target_chunk_id
  )
  SELECT
    dc.id,
    dc.document_id,
    dc.chunk_index,
    dc.content,
    dc.metadata,
    dc.section_heading,
    CASE
      WHEN dc.chunk_index < t.chunk_index THEN 'before'
      WHEN dc.chunk_index > t.chunk_index THEN 'after'
      ELSE 'target'
    END AS relation
  FROM document_chunks dc, target t
  WHERE dc.document_id = t.document_id
    AND dc.chunk_index BETWEEN (t.chunk_index - context_range) AND (t.chunk_index + context_range)
  ORDER BY dc.chunk_index;
$$;
