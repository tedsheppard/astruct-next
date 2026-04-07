import OpenAI from 'openai'
import type { ClassifiedQuery, RetrievedChunk } from './types'
import { createAdminClient } from '@/lib/supabase/admin'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function hybridRetrieve(
  query: ClassifiedQuery,
  contractId: string,
  selectedDocumentIds?: string[],
  docNameMap?: Record<string, string>
): Promise<RetrievedChunk[]> {
  const admin = createAdminClient()

  // 1. Embed the rewritten query with text-embedding-3-large
  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-3-large',
    input: query.rewrittenQuery,
    dimensions: 1536,
  })
  const queryEmbedding = embeddingResponse.data[0].embedding

  // 2. Hybrid search (vector + full-text)
  const { data: hybridChunks, error } = await admin.rpc('hybrid_search_chunks', {
    query_embedding: queryEmbedding,
    query_text: query.rewrittenQuery,
    match_threshold: 0.35,
    match_count: 25,
    filter_contract_id: contractId,
    filter_document_ids: selectedDocumentIds?.length ? selectedDocumentIds : null,
  })

  if (error) {
    console.error('[RAG:Retriever] Hybrid search error:', error)
  }

  // 3. Clause-specific search for extracted refs
  let clauseChunks: typeof hybridChunks = []
  if (query.extractedClauseRefs.length > 0) {
    for (const ref of query.extractedClauseRefs.slice(0, 3)) {
      const { data } = await admin
        .from('document_chunks')
        .select('id, document_id, chunk_index, content, metadata, section_heading, clause_numbers')
        .eq('contract_id', contractId)
        .or(`content.ilike.%clause ${ref}%,content.ilike.%${ref}.%,clause_numbers.cs.{${ref}}`)
        .limit(5)

      if (data) {
        clauseChunks = [...clauseChunks, ...data.map((c: Record<string, unknown>) => ({
          ...c,
          vector_similarity: 0.6,
          text_rank: 0.5,
          combined_score: 0.55,
        }))]
      }
    }
  }

  // 4. Keyword search for domain terms
  let keywordChunks: typeof hybridChunks = []
  if (query.extractedKeyTerms.length > 0) {
    for (const term of query.extractedKeyTerms.slice(0, 3)) {
      const { data } = await admin
        .from('document_chunks')
        .select('id, document_id, chunk_index, content, metadata, section_heading, clause_numbers')
        .eq('contract_id', contractId)
        .ilike('content', `%${term}%`)
        .limit(5)

      if (data) {
        keywordChunks = [...keywordChunks, ...data.map((c: Record<string, unknown>) => ({
          ...c,
          vector_similarity: 0.4,
          text_rank: 0.4,
          combined_score: 0.45,
        }))]
      }
    }
  }

  // 5. Merge and deduplicate
  const seenIds = new Set<string>()
  const allChunks: RetrievedChunk[] = []
  const nameMap = docNameMap || {}

  // Clause matches first (highest priority)
  for (const chunk of clauseChunks || []) {
    if (!seenIds.has(chunk.id)) {
      seenIds.add(chunk.id)
      allChunks.push(toRetrievedChunk(chunk, nameMap))
    }
  }
  // Then hybrid results
  for (const chunk of hybridChunks || []) {
    if (!seenIds.has(chunk.id)) {
      seenIds.add(chunk.id)
      allChunks.push(toRetrievedChunk(chunk, nameMap))
    }
  }
  // Then keyword results
  for (const chunk of keywordChunks || []) {
    if (!seenIds.has(chunk.id)) {
      seenIds.add(chunk.id)
      allChunks.push(toRetrievedChunk(chunk, nameMap))
    }
  }

  // 6. Adjacent chunk expansion for top 5
  const topChunks = allChunks.slice(0, 5)
  for (const chunk of topChunks) {
    try {
      const { data: adjacent } = await admin.rpc('get_adjacent_chunks', {
        target_chunk_id: chunk.id,
        context_range: 1,
      })
      if (adjacent && adjacent.length > 1) {
        const expanded = adjacent
          .sort((a: { chunk_index: number }, b: { chunk_index: number }) => a.chunk_index - b.chunk_index)
          .map((a: { content: string }) => a.content)
          .join('\n\n')
        chunk.expandedContent = expanded
      }
    } catch {
      // Skip expansion on error
    }
  }

  // Return top 12
  return allChunks.slice(0, 12)
}

function toRetrievedChunk(
  chunk: Record<string, unknown>,
  docNameMap: Record<string, string>
): RetrievedChunk {
  return {
    id: chunk.id as string,
    documentId: chunk.document_id as string,
    documentName: docNameMap[chunk.document_id as string] || 'Unknown document',
    chunkIndex: chunk.chunk_index as number,
    content: chunk.content as string,
    sectionHeading: (chunk.section_heading as string) || null,
    clauseNumbers: (chunk.clause_numbers as string[]) || [],
    vectorSimilarity: (chunk.vector_similarity as number) || 0,
    textRank: (chunk.text_rank as number) || 0,
    combinedScore: (chunk.combined_score as number) || 0,
  }
}
