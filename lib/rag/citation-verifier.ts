import type { RetrievedChunk, VerifiedCitation } from './types'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Normalize whitespace: collapse runs of whitespace into single spaces and trim.
 */
function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

/**
 * Extract blockquote snippets from the response that are associated with a given clause ref.
 * Looks for `> "..."`, `> '...'`, or plain `> ...` blockquote lines near the clause mention.
 */
function extractBlockquotes(response: string): string[] {
  const quotes: string[] = []
  // Match blockquote lines: > "text", > 'text', or > text
  const blockquoteRegex = /^>\s*["']?(.+?)["']?\s*$/gm
  let match: RegExpExecArray | null
  while ((match = blockquoteRegex.exec(response)) !== null) {
    const content = match[1].trim()
    if (content.length > 0) {
      quotes.push(content)
    }
  }
  return quotes
}

/**
 * Check whether any blockquote in the response contains a meaningful substring (>= 20 chars)
 * that appears verbatim in any of the provided chunks (after whitespace normalization).
 */
function hasVerbatimQuote(
  response: string,
  chunks: RetrievedChunk[],
  dbContent?: string
): boolean {
  const quotes = extractBlockquotes(response)
  if (quotes.length === 0) return false

  const allContent = [
    ...chunks.map(c => normalizeWhitespace(c.content)),
    ...(dbContent ? [normalizeWhitespace(dbContent)] : []),
  ]

  for (const quote of quotes) {
    const normalizedQuote = normalizeWhitespace(quote)
    if (normalizedQuote.length < 20) continue

    // Try the full quote first, then progressively smaller substrings (min 20 chars)
    const substringLength = Math.max(20, Math.min(normalizedQuote.length, 60))
    const substring = normalizedQuote.substring(0, substringLength).toLowerCase()

    for (const content of allContent) {
      if (content.toLowerCase().includes(substring)) {
        return true
      }
    }
  }

  return false
}

export async function verifyCitations(
  response: string,
  chunks: RetrievedChunk[],
  contractId: string
): Promise<{ citations: VerifiedCitation[]; warnings: string[] }> {
  // Extract all clause references from the response
  const clauseRefs = [...new Set(
    [...response.matchAll(/(?:clause|section|cl\.?|s\.?)\s*(\d+[\.\d]*)/gi)]
      .map(m => m[1])
  )]

  if (clauseRefs.length === 0) {
    return { citations: [], warnings: [] }
  }

  const admin = createAdminClient()
  const citations: VerifiedCitation[] = []
  const warnings: string[] = []

  for (const ref of clauseRefs) {
    // Check if found in retrieved chunks
    const inChunks = chunks.some(c =>
      c.content.toLowerCase().includes(`clause ${ref}`) ||
      c.content.includes(ref) ||
      c.clauseNumbers.includes(ref)
    )

    if (inChunks) {
      const sourceChunk = chunks.find(c =>
        c.content.toLowerCase().includes(`clause ${ref}`) || c.clauseNumbers.includes(ref)
      )
      citations.push({
        clauseRef: ref,
        found: true,
        sourceDocument: sourceChunk?.documentName,
        confidence: 1.0,
        hasQuote: hasVerbatimQuote(response, chunks),
      })
      continue
    }

    // Check in database if not in retrieved chunks
    const { data } = await admin
      .from('document_chunks')
      .select('id, content, metadata')
      .eq('contract_id', contractId)
      .or(`content.ilike.%clause ${ref}%,clause_numbers.cs.{${ref}}`)
      .limit(1)

    if (data && data.length > 0) {
      citations.push({
        clauseRef: ref,
        found: true,
        sourceDocument: (data[0].metadata as Record<string, string>)?.filename,
        confidence: 0.7,
        hasQuote: hasVerbatimQuote(response, chunks, data[0].content),
      })
    } else {
      citations.push({
        clauseRef: ref,
        found: false,
        confidence: 0.0,
        hasQuote: false,
      })
      warnings.push(`Clause ${ref}`)
    }
  }

  return { citations, warnings }
}

export async function verifyCitationsWithRetry(
  response: string,
  chunks: RetrievedChunk[],
  contractId: string
): Promise<{
  citations: VerifiedCitation[]
  warnings: string[]
  needsRetry: boolean
  retryInstruction?: string
}> {
  const result = await verifyCitations(response, chunks, contractId)

  // Find citations that were found but lack a verbatim quote
  const missingQuotes = result.citations.filter(c => c.found && !c.hasQuote)

  if (missingQuotes.length === 0) {
    return { ...result, needsRetry: false }
  }

  const clauseList = missingQuotes.map(c => `Clause ${c.clauseRef}`).join(', ')

  return {
    ...result,
    needsRetry: true,
    retryInstruction:
      `Your response references ${clauseList} but does not include verbatim quotes from the contract text. ` +
      `Please revise your response to include the exact wording from the contract for each of these clauses, ` +
      `formatted as blockquotes (> "..."). Use the provided contract excerpts to find the precise language.`,
  }
}

export function appendCitationWarnings(response: string, warnings: string[]): string {
  if (warnings.length === 0) return response
  return response + `\n\n---\n*Note: The following clause references could not be verified in the uploaded documents: ${warnings.join(', ')}. Please double-check these references.*`
}
