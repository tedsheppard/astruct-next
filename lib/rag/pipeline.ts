import type { RAGConfig, StreamCallbacks, SourceItem } from './types'
import { rewriteQuery } from './query-rewriter'
import { hybridRetrieve } from './retriever'
import { buildContext } from './context-builder'
import { generate } from './generator'
import { verifyCitations, appendCitationWarnings } from './citation-verifier'
import { selfReview, appendReviewNotes } from './self-reviewer'
import { createAdminClient } from '@/lib/supabase/admin'

export async function runRAGPipeline(
  config: RAGConfig,
  latestMessage: string,
  callbacks: StreamCallbacks
) {
  const admin = createAdminClient()

  try {
    // ─── Step 1: Query Rewriting ──────────────────────────────────────────
    callbacks.onThinkingState('Understanding your question...')
    const classifiedQuery = await rewriteQuery(latestMessage, config.conversationHistory)
    console.log('[RAG:Pipeline] Query classified:', classifiedQuery.queryType, classifiedQuery.complexity)

    // ─── Step 2: Retrieval ────────────────────────────────────────────────
    // Get total document count for the "Searching across N documents" message
    const { data: documents } = await admin
      .from('documents')
      .select('id, filename')
      .eq('contract_id', config.contractId)

    const totalDocCount = documents?.length || 0
    const docNameMap: Record<string, string> = {}
    for (const doc of documents || []) {
      docNameMap[doc.id] = doc.filename
    }

    callbacks.onThinkingState(`Searching across ${totalDocCount} document${totalDocCount !== 1 ? 's' : ''}...`)

    const chunks = await hybridRetrieve(
      classifiedQuery,
      config.contractId,
      config.selectedDocumentIds,
      docNameMap
    )
    console.log('[RAG:Pipeline] Retrieved', chunks.length, 'chunks')

    // ─── Step 3: Report actual retrieved sources ──────────────────────────
    const retrievedDocNames = [...new Set(chunks.map(c => c.documentName))]
    callbacks.onThinkingSources({
      state: 'Reading relevant sections...',
      documents: retrievedDocNames,
      chunk_count: chunks.length,
    })

    // ─── Step 4: Context Building ─────────────────────────────────────────
    const systemPrompt = await buildContext(chunks, config, classifiedQuery)

    // ─── Step 5: Generation ───────────────────────────────────────────────
    // The generator emits model info via onThinkingState internally
    const fullResponse = await generate(
      systemPrompt,
      config.conversationHistory,
      classifiedQuery,
      config.model,
      callbacks
    )

    // ─── Step 6: Citation Verification ────────────────────────────────────
    let finalResponse = fullResponse
    if (classifiedQuery.queryType !== 'casual') {
      const { warnings } = await verifyCitations(fullResponse, chunks, config.contractId)
      if (warnings.length > 0) {
        finalResponse = appendCitationWarnings(fullResponse, warnings)
        const warningText = finalResponse.slice(fullResponse.length)
        if (warningText) callbacks.onContent(warningText)
      }
    }

    // ─── Step 7: Self-Review (for drafting/analysis) — skip if using non-Claude model
    const modelIsClaude = config.model.startsWith('claude-')
    if (modelIsClaude && (classifiedQuery.queryType === 'drafting' || classifiedQuery.queryType === 'analysis')) {
      const review = await selfReview(finalResponse, chunks)
      if (review) {
        console.log('[RAG:Pipeline] Self-review quality:', review.overallQuality, 'issues:', review.issues.length)
        if (review.overallQuality === 'needs_revision' && review.suggestedAdditions.length > 0) {
          const additions = appendReviewNotes('', review)
          if (additions) {
            finalResponse += additions
            callbacks.onContent(additions)
          }
        }
      }
    }

    // ─── Step 8: Build and emit sources ──────────────────────────────────
    const sources: SourceItem[] = chunks
      .sort((a, b) => b.combinedScore - a.combinedScore)
      .slice(0, 5)
      .map(c => ({
        type: 'document' as const,
        document_id: c.documentId,
        document_name: c.documentName,
        section_heading: c.sectionHeading,
        excerpt: (c.expandedContent || c.content).slice(0, 150).trim() + '...',
        chunk_index: c.chunkIndex,
        similarity_score: Math.round(c.combinedScore * 100) / 100,
        clause_references: c.clauseNumbers,
      }))

    if (sources.length > 0) {
      callbacks.onSources(sources)
    }

    // ─── Step 9: Save & Complete ──────────────────────────────────────────
    await admin.from('chat_messages').insert({
      session_id: config.sessionId,
      role: 'assistant',
      content: finalResponse,
      sources: sources.length > 0 ? sources : null,
    })

    // Auto-save generated document as a notice
    const docMatch = finalResponse.match(/---DOCUMENT_START---([\s\S]*?)---DOCUMENT_END---/)
    let savedNoticeId: string | null = null
    if (docMatch) {
      try {
        const docData = JSON.parse(docMatch[1].trim())
        const { data: notice } = await admin.from('notices').insert({
          contract_id: config.contractId,
          user_id: config.userId,
          notice_type: docData.noticeType || 'Other',
          title: docData.title || 'Untitled Notice',
          content: docData.content || '',
          clause_references: docData.clauseReference ? [docData.clauseReference] : [],
        }).select('id').single()
        savedNoticeId = notice?.id || null
      } catch (e) {
        console.error('[RAG:Pipeline] Failed to auto-save notice:', e)
      }
    }

    callbacks.onDone({ sessionId: config.sessionId!, noticeId: savedNoticeId })

  } catch (err) {
    console.error('[RAG:Pipeline] Error:', err)
    callbacks.onError(err instanceof Error ? err.message : 'Pipeline error')
  }
}
