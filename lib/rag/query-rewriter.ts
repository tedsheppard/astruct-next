import Anthropic from '@anthropic-ai/sdk'
import type { ClassifiedQuery, ConversationMessage } from './types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' })

export async function rewriteQuery(
  message: string,
  history: ConversationMessage[]
): Promise<ClassifiedQuery> {
  // Fast path for obviously casual messages
  const casualPattern = /^(hi|hello|hey|thanks|thank you|ok|okay|yes|no|sure|yo|sup|test|dtest)\s*[!?.]*$/i
  if (message.length < 30 && casualPattern.test(message.trim())) {
    return {
      originalQuery: message,
      rewrittenQuery: message,
      queryType: 'casual',
      extractedClauseRefs: [],
      extractedKeyTerms: [],
      complexity: 'simple',
    }
  }

  // Build recent history context (last 5 turns)
  const recentHistory = history.slice(-10).map(m => {
    // Strip document JSON from assistant messages to save tokens
    const content = m.content.replace(/---DOCUMENT_START---[\s\S]*?---DOCUMENT_END---/g, '[generated document]')
    return `${m.role}: ${content.slice(0, 300)}`
  }).join('\n')

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      temperature: 0,
      messages: [{
        role: 'user',
        content: `You rewrite queries for a construction contract RAG system. Given conversation history and the user's latest message, output JSON with:
- rewrittenQuery: a standalone, specific search query (expand pronouns like "that", "it" using context)
- queryType: "question" | "analysis" | "drafting" | "clause_lookup" | "casual"
- extractedClauseRefs: clause/section numbers mentioned or implied (e.g. ["34.1", "37.2"])
- extractedKeyTerms: domain-specific terms for keyword search (e.g. ["liquidated damages", "practical completion"])
- complexity: "simple" | "moderate" | "complex"

IMPORTANT: If the user's message references something from the conversation (e.g. "what's the time limit?" after discussing clause 34, or "and the penalties?" after discussing liquidated damages), you MUST rewrite the query to be fully standalone. Include the clause number and topic from context. For example:
- History mentions clause 34 variations, user says "what's the time limit?" → rewrittenQuery: "What is the time limit for making a variation claim under clause 34?"
- History discusses liquidated damages, user says "how much?" → rewrittenQuery: "What is the rate of liquidated damages under the contract?"

History:
${recentHistory || 'No prior messages.'}

User message: ${message}

JSON only:`
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        originalQuery: message,
        rewrittenQuery: parsed.rewrittenQuery || message,
        queryType: parsed.queryType || 'question',
        extractedClauseRefs: parsed.extractedClauseRefs || [],
        extractedKeyTerms: parsed.extractedKeyTerms || [],
        complexity: parsed.complexity || 'moderate',
      }
    }
  } catch (err) {
    console.error('[RAG:Rewriter] Failed:', err)
  }

  // Fallback: basic regex extraction
  const clauseRefs = [...message.matchAll(/(?:clause|cl|section|s)\s*(\d+[\.\d]*)/gi)].map(m => m[1])
  const isDrafting = /\b(draft|write|create|prepare|generate)\b/i.test(message)
  const isClauseLookup = clauseRefs.length > 0 && message.length < 60

  return {
    originalQuery: message,
    rewrittenQuery: message,
    queryType: isDrafting ? 'drafting' : isClauseLookup ? 'clause_lookup' : 'question',
    extractedClauseRefs: clauseRefs,
    extractedKeyTerms: [],
    complexity: message.length > 100 ? 'complex' : 'simple',
  }
}

export async function generateSessionSummary(
  messages: { role: string; content: string }[]
): Promise<string> {
  // Strip document blocks from message content
  const cleaned = messages.map(m => ({
    role: m.role,
    content: m.content.replace(/---DOCUMENT_START---[\s\S]*?---DOCUMENT_END---/g, '').trim(),
  }))

  const transcript = cleaned
    .map(m => `${m.role}: ${m.content.slice(0, 400)}`)
    .join('\n')

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      temperature: 0,
      messages: [{
        role: 'user',
        content: `Summarize this construction contract conversation in exactly 2 sentences. Focus on the key topics, clauses, and any decisions or conclusions reached.

Conversation:
${transcript}

Summary:`,
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return text.trim()
  } catch (err) {
    console.error('[RAG:SessionSummary] Failed:', err)
    return ''
  }
}
