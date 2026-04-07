import Anthropic from '@anthropic-ai/sdk'
import type { RetrievedChunk } from './types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' })

export interface ReviewResult {
  overallQuality: 'good' | 'needs_revision' | 'poor'
  issues: { type: string; description: string; severity: string }[]
  suggestedAdditions: string[]
}

export async function selfReview(
  response: string,
  chunks: RetrievedChunk[],
): Promise<ReviewResult | null> {
  try {
    // Build source excerpts for the reviewer
    const sourceExcerpts = chunks.slice(0, 8).map((c, i) =>
      `[Source ${i + 1}: ${c.documentName}${c.sectionHeading ? ' | ' + c.sectionHeading : ''}]\n${c.content.slice(0, 800)}`
    ).join('\n\n---\n\n')

    // Strip document JSON from response for review (reviewer checks the text, not the JSON)
    const responseForReview = response
      .replace(/---DOCUMENT_START---[\s\S]*?---DOCUMENT_END---/g, '[generated document omitted for review]')
      .slice(0, 4000)

    const result = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      temperature: 0,
      messages: [{
        role: 'user',
        content: `You are a quality reviewer for a construction contract AI assistant.
Review this AI-generated response against the source document excerpts provided.

SOURCE EXCERPTS:
${sourceExcerpts}

AI RESPONSE:
${responseForReview}

Check for:
1. Any factual claims not supported by the source excerpts
2. Any fabricated or incorrect clause references (cross-check with sources)
3. Any incorrect party names, dates, or dollar amounts vs what's in the sources
4. Any legal conclusions that go beyond what the source text actually says
5. Important information that IS in the sources but was NOT mentioned in the response

Respond in JSON only, no markdown fences:
{"issues": [{"type": "unsupported_claim", "description": "...", "severity": "high"}], "overall_quality": "good", "suggested_additions": []}`
      }],
    })

    const text = result.content[0].type === 'text' ? result.content[0].text : ''
    // Strip markdown fences if present
    let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '')
    // Extract JSON object
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null

    // Clean up common JSON issues: trailing commas, unescaped newlines in strings
    let jsonStr = jsonMatch[0]
      .replace(/,\s*([}\]])/g, '$1')  // Remove trailing commas
      .replace(/[\r\n]+/g, ' ')        // Flatten newlines inside JSON

    try {
      const parsed = JSON.parse(jsonStr)
      return {
        overallQuality: parsed.overall_quality || 'good',
        issues: Array.isArray(parsed.issues) ? parsed.issues : [],
        suggestedAdditions: Array.isArray(parsed.suggested_additions) ? parsed.suggested_additions : [],
      }
    } catch {
      // Last resort: try to extract just the quality field
      const qualityMatch = jsonStr.match(/"overall_quality"\s*:\s*"(good|needs_revision|poor)"/)
      if (qualityMatch) {
        return { overallQuality: qualityMatch[1] as ReviewResult['overallQuality'], issues: [], suggestedAdditions: [] }
      }
      return null
    }
  } catch (err) {
    console.error('[RAG:SelfReview] Failed:', err)
    return null
  }
}

export function appendReviewNotes(response: string, review: ReviewResult): string {
  if (review.suggestedAdditions.length === 0) return response

  const additions = review.suggestedAdditions
    .filter(a => a && a.trim().length > 0)
    .slice(0, 3)
    .map(a => `- ${a}`)
    .join('\n')

  if (!additions) return response

  return response + `\n\n**Additional context from the documents:**\n${additions}`
}
