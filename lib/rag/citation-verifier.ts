import type { RetrievedChunk, VerifiedCitation } from './types'
import { createAdminClient } from '@/lib/supabase/admin'

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
      })
    } else {
      citations.push({
        clauseRef: ref,
        found: false,
        confidence: 0.0,
      })
      warnings.push(`Clause ${ref}`)
    }
  }

  return { citations, warnings }
}

export function appendCitationWarnings(response: string, warnings: string[]): string {
  if (warnings.length === 0) return response
  return response + `\n\n---\n*Note: The following clause references could not be verified in the uploaded documents: ${warnings.join(', ')}. Please double-check these references.*`
}
