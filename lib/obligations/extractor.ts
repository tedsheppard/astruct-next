import { createAdminClient } from '@/lib/supabase/admin'
import Anthropic from '@anthropic-ai/sdk'
import { ExtractedObligation, ObligationClausePrior } from './types'

const anthropic = new Anthropic()

/**
 * Pass A: Detect the contract form type.
 * Reads contract metadata + first 3 document chunks to confirm form type.
 * Returns the contract_form string and matching priors.
 */
export async function detectContractForm(contractId: string): Promise<{
  contractForm: string
  priors: ObligationClausePrior[]
}> {
  const admin = createAdminClient()

  // Get contract metadata
  const { data: contract } = await admin
    .from('contracts')
    .select('contract_form, name')
    .eq('id', contractId)
    .single()

  const contractForm = contract?.contract_form || 'bespoke'

  // Load matching priors if standard form
  let priors: ObligationClausePrior[] = []
  if (contractForm && contractForm !== 'bespoke' && contractForm !== 'other') {
    // Map contract_form field to our prior contract_form values
    // The contracts table stores things like 'AS4000-2025', 'AS4902-2000' etc
    const { data } = await admin
      .from('obligation_clause_priors')
      .select('*')
      .eq('contract_form', contractForm)
    priors = data || []
  }

  return { contractForm, priors }
}

/**
 * Pass B: Extract obligations from contract document chunks.
 * Uses Claude Sonnet 4.6 to extract time-limited obligations from each batch of chunks.
 * Cross-references against clause priors for standard forms.
 */
export async function extractStaticObligations(
  contractId: string,
  userId: string
): Promise<{ created: number; standing: number; warnings: string[] }> {
  const admin = createAdminClient()
  const warnings: string[] = []

  // Step 1: Detect form and load priors
  const { contractForm, priors } = await detectContractForm(contractId)

  // Step 2: Get contract document chunks (only those with clause references)
  const { data: allChunks } = await admin
    .from('document_chunks')
    .select('id, content, clause_numbers, section_heading, document_id')
    .eq('contract_id', contractId)
    .order('chunk_index', { ascending: true })

  if (!allChunks || allChunks.length === 0) {
    return { created: 0, standing: 0, warnings: ['No document chunks found'] }
  }

  // Filter to chunks from contract category documents and those with clause content
  const { data: contractDocs } = await admin
    .from('documents')
    .select('id')
    .eq('contract_id', contractId)
    .in('category', ['01_contract'])

  const contractDocIds = new Set((contractDocs || []).map(d => d.id))
  const relevantChunks = allChunks.filter(c => contractDocIds.has(c.document_id))

  if (relevantChunks.length === 0) {
    return { created: 0, standing: 0, warnings: ['No contract document chunks found'] }
  }

  // Step 3: Batch chunks (max ~30K chars per batch to stay within context)
  const batches: typeof relevantChunks[] = []
  let currentBatch: typeof relevantChunks = []
  let currentSize = 0
  const MAX_BATCH_CHARS = 30000

  for (const chunk of relevantChunks) {
    if (currentSize + chunk.content.length > MAX_BATCH_CHARS && currentBatch.length > 0) {
      batches.push(currentBatch)
      currentBatch = []
      currentSize = 0
    }
    currentBatch.push(chunk)
    currentSize += chunk.content.length
  }
  if (currentBatch.length > 0) batches.push(currentBatch)

  // Step 4: Extract obligations from each batch
  const allExtracted: (ExtractedObligation & { document_id: string })[] = []

  const priorsContext = priors.length > 0
    ? `\n\nKnown clause priors for ${contractForm}:\n${priors.map(p =>
        `- Clause ${p.clause_number}: ${p.clause_title || ''} (${p.obligation_type}, ${p.time_period_text || 'no time specified'}, party: ${p.party_responsible}, time-bar: ${p.is_time_bar})`
      ).join('\n')}`
    : ''

  for (const batch of batches) {
    const batchText = batch.map(c => {
      const heading = c.section_heading ? `[${c.section_heading}]` : ''
      const clauses = c.clause_numbers?.length ? ` (Clauses: ${c.clause_numbers.join(', ')})` : ''
      return `${heading}${clauses}\n${c.content}`
    }).join('\n\n---\n\n')

    const documentId = batch[0]?.document_id || ''

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6-20250514',
        max_tokens: 4000,
        temperature: 0,
        system: `You are an expert Australian construction contract analyst. Extract every time-limited obligation, notice requirement, and time-bar from this contract text.

For each obligation found, output a JSON object with:
- clause_ref: the exact clause number (e.g. "33.1", "37.2(a)")
- obligation_type: one of "notice", "response", "claim", "submission", "assessment", "direction", "payment", "certification", "completion", "insurance", "guarantee", "other"
- trigger_description: what event or condition triggers this obligation (1 sentence)
- time_period_text: the exact wording from the contract (e.g. "within 28 days", "by the 25th day of each month")
- time_period_days: integer number of days, or null if not a fixed period
- party_responsible: who must act (e.g. "contractor", "principal", "superintendent")
- consequence: what happens if the obligation is not met (1 sentence). If the contract specifies a time-bar (right is lost), state that clearly
- is_time_bar: true if missing this deadline means permanently losing a right or entitlement
- clause_text_snippet: the exact excerpt from the contract (max 200 chars) that defines this obligation

Be thorough. Include sub-clauses. A senior contract administrator should recognise every obligation you extract.
Do NOT fabricate obligations that aren't in the text. Only extract what the text actually says.
${priorsContext}

Respond with a JSON array only, no other text.`,
        messages: [{
          role: 'user',
          content: batchText
        }]
      })

      const text = response.content[0].type === 'text' ? response.content[0].text : ''
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const parsed: ExtractedObligation[] = JSON.parse(jsonMatch[0])
        allExtracted.push(...parsed.map(o => ({ ...o, document_id: documentId })))
      }
    } catch (err) {
      console.error('Obligation extraction batch failed:', err)
      warnings.push(`Failed to process batch of ${batch.length} chunks`)
    }
  }

  // Step 5: Deduplicate by (clause_ref, obligation_type)
  const seen = new Set<string>()
  const deduplicated = allExtracted.filter(o => {
    const key = `${o.clause_ref}|${o.obligation_type}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  // Step 6: Check for expected priors not found (standard forms only)
  if (priors.length > 0) {
    const extractedClauses = new Set(deduplicated.map(o => o.clause_ref))
    for (const prior of priors) {
      if (!extractedClauses.has(prior.clause_number)) {
        warnings.push(`Expected clause ${prior.clause_number} (${prior.clause_title}) not found — may be amended or excluded`)
      }
    }
  }

  // Step 7: Generate explanations in batch
  let explanations: Record<string, string> = {}
  if (deduplicated.length > 0) {
    try {
      const explainResponse = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4000,
        temperature: 0,
        system: 'For each obligation, write a plain-English explanation in this format: "What this means: [1-2 sentences]. What triggers it: [1 sentence]. Consequence if missed: [1 sentence]." Respond with a JSON object mapping clause_ref to explanation string.',
        messages: [{
          role: 'user',
          content: JSON.stringify(deduplicated.map(o => ({
            clause_ref: o.clause_ref,
            obligation_type: o.obligation_type,
            trigger: o.trigger_description,
            consequence: o.consequence,
            time_period: o.time_period_text,
            party: o.party_responsible
          })))
        }]
      })

      const explainText = explainResponse.content[0].type === 'text' ? explainResponse.content[0].text : ''
      const jsonMatch = explainText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        explanations = JSON.parse(jsonMatch[0])
      }
    } catch {
      console.error('Failed to generate explanations')
    }
  }

  // Step 8: Delete existing standing obligations for this contract (re-extraction)
  await admin
    .from('obligations')
    .delete()
    .eq('contract_id', contractId)
    .eq('obligation_class', 'standing')
    .eq('source', 'ai_extracted')

  // Step 9: Insert as standing obligations
  const toInsert = deduplicated.map(o => ({
    contract_id: contractId,
    user_id: userId,
    description: `${o.party_responsible === 'contractor' ? 'Contractor' : o.party_responsible === 'superintendent' ? 'Superintendent' : o.party_responsible === 'principal' ? 'Principal' : o.party_responsible} must ${o.trigger_description?.toLowerCase() || o.obligation_type}`,
    clause_reference: `Clause ${o.clause_ref}`,
    due_date: new Date().toISOString(), // Standing obligations don't have a specific due date; placeholder
    status: 'pending',
    notice_type: mapObligationType(o.obligation_type),
    completed: false,
    source: 'ai_extracted',
    obligation_class: 'standing',
    time_period_text: o.time_period_text,
    time_period_days: o.time_period_days,
    consequence: o.consequence,
    party_responsible: o.party_responsible,
    clause_text_snippet: o.clause_text_snippet,
    document_id: o.document_id,
    explanation: explanations[o.clause_ref] || null,
    confidence: 0.9,
    trigger_event_id: null,
  }))

  if (toInsert.length > 0) {
    const { error } = await admin.from('obligations').insert(toInsert)
    if (error) {
      console.error('Failed to insert standing obligations:', error)
      warnings.push('Database insert failed')
    }
  }

  return {
    created: toInsert.length,
    standing: toInsert.length,
    warnings
  }
}

function mapObligationType(type: string): string {
  const map: Record<string, string> = {
    notice: 'Delay',
    response: 'Other',
    claim: 'Payment Claim',
    submission: 'Other',
    assessment: 'Other',
    direction: 'Variation',
    payment: 'Payment Claim',
    certification: 'Other',
    completion: 'Other',
    insurance: 'Other',
    guarantee: 'Other',
    other: 'Other',
  }
  return map[type] || 'Other'
}
