import type { RetrievedChunk, VerifiedCitation } from './types'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Normalize whitespace: collapse runs of whitespace into single spaces and trim.
 */
function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

/**
 * Extract blockquote snippets from the response.
 * Looks for `> "..."`, `> '...'`, or plain `> ...` blockquote lines.
 */
function extractBlockquotes(response: string): string[] {
  const quotes: string[] = []
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

/**
 * Check if a clause reference in context is actually a statutory/external citation
 * rather than a contract clause reference. Returns true if it should be EXCLUDED from verification.
 */
function isStatutoryOrExternalRef(response: string, clauseRef: string): boolean {
  // Build patterns that indicate the "clause/section N" is statutory, not contractual
  const patterns = [
    // "section 68 of the BIF Act", "s 68 of the Act", "section 68 BIFA"
    new RegExp(`(?:section|s\\.?)\\s*${escapeRegex(clauseRef)}\\s+(?:of\\s+the\\s+)?(?:\\w+\\s+)?act\\b`, 'i'),
    // "s 68 BIF", "s.68 SOPA", "section 68 BIFA"
    new RegExp(`(?:section|s\\.?)\\s*${escapeRegex(clauseRef)}\\s+(?:BIF|SOPA|BIFA|BCIPA|SOP|QBCC)`, 'i'),
    // "section 68 of the Building" (start of an act name)
    new RegExp(`(?:section|s\\.?)\\s*${escapeRegex(clauseRef)}\\s+of\\s+the\\s+(?:Building|Security|Construction|Civil)`, 'i'),
    // Case citations: "[2019] NSWCA 123", "(2020) 45 NSWLR"
    /\[\d{4}\]\s*[A-Z]{2,}/,
    /\(\d{4}\)\s*\d+\s*[A-Z]/,
  ]

  for (const pattern of patterns) {
    if (pattern.test(response)) return true
  }

  // Check if "clause N" appears only in a context like "standard AS4000 clause N" or "the standard form clause N"
  const standardFormPattern = new RegExp(`(?:standard|AS\\s*4000|AS\\s*4902|AS\\s*2124|NEC|FIDIC)\\s+(?:form\\s+)?(?:clause|cl\\.?)\\s*${escapeRegex(clauseRef)}`, 'i')
  if (standardFormPattern.test(response)) {
    // Only exclude if this ref does NOT also appear as a contract-specific reference
    const contractSpecificPattern = new RegExp(`(?:the\\s+contract|this\\s+contract|under\\s+clause|contract'?s?\\s+clause)\\s*${escapeRegex(clauseRef)}`, 'i')
    if (!contractSpecificPattern.test(response)) return true
  }

  return false
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Extract only CONTRACT clause references from a response.
 * Matches "clause X.Y", "cl X.Y", "Clause X.Y" but NOT "section X of the Act" patterns.
 */
function extractContractClauseRefs(response: string): string[] {
  // Match "clause N", "cl N", "cl. N" patterns (not "section N" which is typically statutory)
  const clauseMatches = [...response.matchAll(/\b(?:clause|cl\.?)\s*(\d+(?:\.\d+)*)/gi)]
    .map(m => m[1])

  // Also match "section N" but ONLY if it's clearly contract-specific
  // (i.e. not followed by "of the ... Act" or a statute abbreviation)
  const sectionMatches = [...response.matchAll(/\b(?:section|s\.?)\s*(\d+(?:\.\d+)*)/gi)]
    .map(m => m[1])
    .filter(ref => !isStatutoryOrExternalRef(response, ref))

  return [...new Set([...clauseMatches, ...sectionMatches])]
}

export async function verifyCitations(
  response: string,
  chunks: RetrievedChunk[],
  contractId: string
): Promise<{ citations: VerifiedCitation[]; warnings: string[] }> {
  // Extract only contract clause references (not statutory/case citations)
  const clauseRefs = extractContractClauseRefs(response)

  if (clauseRefs.length === 0) {
    return { citations: [], warnings: [] }
  }

  const admin = createAdminClient()
  const citations: VerifiedCitation[] = []
  const warnings: string[] = []

  for (const ref of clauseRefs) {
    // Skip if this ref in context is actually statutory
    if (isStatutoryOrExternalRef(response, ref)) continue

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
      // Clause not found in contract - could be a standard-form reference the model is
      // explaining from training knowledge. Don't warn if context suggests it's general knowledge.
      const isGeneralKnowledge = isStandardFormReference(response, ref)
      if (!isGeneralKnowledge) {
        citations.push({
          clauseRef: ref,
          found: false,
          confidence: 0.0,
          hasQuote: false,
        })
        warnings.push(`Clause ${ref}`)
      }
    }
  }

  return { citations, warnings }
}

/**
 * Check if a clause ref appears in context suggesting standard-form knowledge
 * rather than a claim about this specific contract.
 */
function isStandardFormReference(response: string, ref: string): boolean {
  const patterns = [
    new RegExp(`(?:standard|AS\\s*4000|AS\\s*4902|AS\\s*2124|typical|general|normally|usually|standard\\s+form)\\s+.*?${escapeRegex(ref)}`, 'i'),
    new RegExp(`${escapeRegex(ref)}\\s+.*?(?:of\\s+the\\s+standard|in\\s+the\\s+standard|AS\\s*4000|AS\\s*4902)`, 'i'),
  ]
  return patterns.some(p => p.test(response))
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

  // Find citations that were found in the contract but lack a verbatim quote
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
