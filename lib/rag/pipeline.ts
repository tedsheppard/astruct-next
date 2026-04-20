import type { RAGConfig, StreamCallbacks, SourceItem } from './types'
import { rewriteQuery, generateSessionSummary } from './query-rewriter'
import { hybridRetrieve } from './retriever'
import { buildContext } from './context-builder'
import { generate } from './generator'
import { verifyCitationsWithRetry, appendCitationWarnings } from './citation-verifier'
import { selfReview, appendReviewNotes } from './self-reviewer'
import { generateFollowups } from './followup-generator'
import { createAdminClient } from '@/lib/supabase/admin'

/** Map query type to specific thinking state messages */
function getThinkingStates(queryType: string, docCount: number): { search: string; read: string } {
  switch (queryType) {
    case 'casual':
      return { search: '', read: '' }
    case 'analysis':
      return {
        search: `Reviewing relevant clauses across ${docCount} document${docCount !== 1 ? 's' : ''}...`,
        read: 'Cross-referencing obligations...',
      }
    case 'drafting':
      return {
        search: 'Locating relevant clauses and party details...',
        read: 'Pulling party details and template structure...',
      }
    case 'clause_lookup':
      return {
        search: `Searching for clause references across ${docCount} document${docCount !== 1 ? 's' : ''}...`,
        read: 'Reading clause text...',
      }
    default:
      return {
        search: `Searching across ${docCount} document${docCount !== 1 ? 's' : ''}...`,
        read: 'Reading relevant sections...',
      }
  }
}

export async function runRAGPipeline(
  config: RAGConfig,
  latestMessage: string,
  callbacks: StreamCallbacks
) {
  const admin = createAdminClient()

  try {
    // ─── Step 1: Query Rewriting ──────────────────────────────────────────
    if (config.conversationHistory.length <= 2) {
      // No thinking state for first message - feels snappier
    }
    const classifiedQuery = await rewriteQuery(latestMessage, config.conversationHistory)
    console.log('[RAG:Pipeline] Query classified:', classifiedQuery.queryType, classifiedQuery.complexity)

    // ─── Step 2: Retrieval ────────────────────────────────────────────────
    const { data: documents } = await admin
      .from('documents')
      .select('id, filename')
      .eq('contract_id', config.contractId)

    const totalDocCount = documents?.length || 0
    const docNameMap: Record<string, string> = {}
    for (const doc of documents || []) {
      docNameMap[doc.id] = doc.filename
    }

    const thinkingStates = getThinkingStates(classifiedQuery.queryType, totalDocCount)
    if (thinkingStates.search) {
      callbacks.onThinkingState(thinkingStates.search)
    }

    const chunks = await hybridRetrieve(
      classifiedQuery,
      config.contractId,
      config.selectedDocumentIds,
      docNameMap
    )
    console.log('[RAG:Pipeline] Retrieved', chunks.length, 'chunks')

    // ─── Step 3: Report actual retrieved sources ──────────────────────────
    const retrievedDocNames = [...new Set(chunks.map(c => c.documentName))]
    if (thinkingStates.read) {
      callbacks.onThinkingSources({
        state: thinkingStates.read,
        documents: retrievedDocNames,
        chunk_count: chunks.length,
      })
    }

    // ─── Step 4: Context Building ─────────────────────────────────────────
    const systemPrompt = await buildContext(chunks, config, classifiedQuery)

    // ─── Step 5: Generation ───────────────────────────────────────────────
    const fullResponse = await generate(
      systemPrompt,
      config.conversationHistory,
      classifiedQuery,
      config.model,
      callbacks
    )

    // ─── Step 6: Citation Verification with Retry ─────────────────────────
    let finalResponse = fullResponse
    if (classifiedQuery.queryType !== 'casual') {
      const verification = await verifyCitationsWithRetry(fullResponse, chunks, config.contractId)

      if (verification.needsRetry && verification.retryInstruction) {
        console.log('[RAG:Pipeline] Citation verification requires retry - missing quotes')
        // Retry: append the retry instruction as a user message and regenerate
        const retryHistory = [
          ...config.conversationHistory,
          { role: 'assistant' as const, content: fullResponse },
          { role: 'user' as const, content: verification.retryInstruction },
        ]
        const retryResponse = await generate(
          systemPrompt,
          retryHistory,
          classifiedQuery,
          config.model,
          {
            ...callbacks,
            onContent: (content) => {
              // Replace the streamed content entirely
              // We need to clear the old response and stream the new one
              callbacks.onContent(content)
            },
          }
        )
        // Replace final response with retry
        finalResponse = retryResponse
      }

      if (verification.warnings.length > 0) {
        finalResponse = appendCitationWarnings(finalResponse, verification.warnings)
        const warningText = finalResponse.slice(fullResponse.length)
        if (warningText) callbacks.onContent(warningText)
      }
    }

    // ─── Step 7: Self-Review (for drafting/analysis) ──────────────────────
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
      .map(c => {
        const meta = (c as unknown as Record<string, unknown>).metadata as Record<string, unknown> | undefined
        return {
          type: 'document' as const,
          document_id: c.documentId,
          document_name: c.documentName,
          section_heading: c.sectionHeading,
          excerpt: (c.expandedContent || c.content).slice(0, 150).trim() + '...',
          full_text: (c.expandedContent || c.content),
          chunk_index: c.chunkIndex,
          similarity_score: Math.round(c.combinedScore * 100) / 100,
          clause_references: c.clauseNumbers,
          page_number: (meta?.page_number as number) || null,
        }
      })

    if (sources.length > 0) {
      callbacks.onSources(sources)
    }

    // ─── Step 9: Follow-up suggestions ───────────────────────────────────
    if (classifiedQuery.queryType !== 'casual') {
      // Run in background - don't block the response
      generateFollowups(latestMessage, finalResponse, chunks)
        .then(followups => {
          if (followups.length > 0) {
            callbacks.onFollowups(followups)
          }
        })
        .catch(err => {
          console.error('[RAG:Pipeline] Followup generation failed:', err)
        })
    }

    // ─── Step 10: Session summary (every 6 messages) ─────────────────────
    const messageCount = config.conversationHistory.length + 1 // +1 for current
    if (messageCount % 6 === 0 && config.sessionId) {
      generateSessionSummary(config.conversationHistory)
        .then(summary => {
          if (summary) {
            admin.from('chat_sessions')
              .update({ summary })
              .eq('id', config.sessionId!)
              .then(() => console.log('[RAG:Pipeline] Session summary saved'))
          }
        })
        .catch(err => console.error('[RAG:Pipeline] Session summary failed:', err))
    }

    // ─── Step 11: Save & Complete ─────────────────────────────────────────
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
