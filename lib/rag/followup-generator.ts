import Anthropic from '@anthropic-ai/sdk'
import type { RetrievedChunk } from './types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' })

export async function generateFollowups(
  userQuestion: string,
  assistantResponse: string,
  chunks: RetrievedChunk[]
): Promise<string[]> {
  // Don't generate followups for casual messages
  if (userQuestion.length < 20 && /^(hi|hello|hey|thanks|ok|yes|no|sure)\b/i.test(userQuestion)) {
    return []
  }

  // Build a compact summary of available chunks for context
  const chunkSummary = chunks.slice(0, 6).map(c => {
    const clauses = c.clauseNumbers.length ? `[Clauses: ${c.clauseNumbers.join(', ')}]` : ''
    return `${c.sectionHeading || c.documentName} ${clauses}: ${c.content.slice(0, 200)}`
  }).join('\n')

  // Strip document JSON from response
  const cleanResponse = assistantResponse
    .replace(/---DOCUMENT_START---[\s\S]*?---DOCUMENT_END---/g, '[generated document]')
    .slice(0, 2000)

  try {
    const result = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      temperature: 0.3,
      messages: [{
        role: 'user',
        content: `You are helping a construction professional use a contract assistant. Given the question, response, and available contract excerpts, suggest 3 specific follow-up questions they'd likely want to ask next.

Rules:
- Be SPECIFIC. Reference clause numbers, party names, deadlines, or amounts from the context.
- Never suggest generic questions like "tell me more" or "can you explain further"
- Each question should be a different angle or related topic
- Keep each under 80 characters

User question: ${userQuestion}

Response summary: ${cleanResponse.slice(0, 1000)}

Available contract context:
${chunkSummary}

Return a JSON array of exactly 3 strings. JSON only, no markdown:`,
      }],
    })

    const text = result.content[0].type === 'text' ? result.content[0].text : ''
    const match = text.match(/\[[\s\S]*\]/)
    if (match) {
      const parsed = JSON.parse(match[0])
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, 3).filter((q: unknown) => typeof q === 'string' && q.length > 0)
      }
    }
  } catch (err) {
    console.error('[RAG:Followups] Failed:', err)
  }

  return []
}
