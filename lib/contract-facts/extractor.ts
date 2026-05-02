import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const admin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

/**
 * Contract-facts extractor.
 *
 * The previous version hardcoded "principal" / "contractor" keys, which forced
 * every uploaded document into a head-contract frame. For subcontracts and
 * consultancies the model then dutifully picked the *head contract*'s parties
 * out of the recitals — wrong parties, wrong roles. The schema below lets the
 * model name the actual parties and their actual roles for THIS document, and
 * to identify the contract type first so the rest of the extraction follows
 * the correct frame.
 */

/**
 * Contract type — Ted's taxonomy. The split between D&C and Construct-only
 * matters: a D&C head contract has design liability flowing from Principal to
 * Contractor; a Construct-only head contract has design liability sitting with
 * the Principal (or a separate consultant). Same split applies to subcontracts.
 */
export type ContractType =
  | 'dc_head_contract'
  | 'construct_only_head_contract'
  | 'dc_subcontract'
  | 'construct_only_subcontract'
  | 'consultancy_agreement'
  | 'other'

export interface PartyFact {
  name?: string
  role?: string // free-text role as it appears in this contract
  address?: string
  abn?: string
  source_text?: string
}

export interface ClauseTopics {
  delay?: string
  extension_of_time?: string
  variation?: string
  payment_claim?: string
  dispute_resolution?: string
  defects_liability?: string
  liquidated_damages?: string
  latent_conditions?: string
  termination?: string
  practical_completion?: string
}

export interface ExtractedFacts {
  contract_type?: { value: ContractType; confidence?: number; source_text?: string }
  contract_title?: { value: string; source_text?: string }
  project_name?: { value: string; source_text?: string }
  contract_form?: { value: string; confidence?: number; source_text?: string }
  party_a?: PartyFact
  party_b?: PartyFact
  contract_administrator?: PartyFact & { from_party?: 'a' | 'b' }
  contract_date?: { value: string; source_text?: string }
  contract_sum?: { value: number; currency: string; source_text?: string }
  date_for_practical_completion?: { value: string; source_text?: string }
  defects_liability_period?: { value: string; source_text?: string }
  reference_number?: { value: string; source_text?: string }
  site_address?: { value: string; source_text?: string }
  scope_summary?: { value: string }
  clause_topics?: ClauseTopics
  // Backwards-compatibility shims — legacy callers still read these fields.
  principal?: PartyFact
  contractor?: PartyFact
  superintendent?: PartyFact
}

const SYSTEM_PROMPT = `You are a senior Australian construction contracts analyst. Read the provided document text and extract the key facts as JSON.

The document may be any type of construction contract. Identify the type FIRST, then extract the facts in the correct frame.

CRITICAL RULES — read carefully:

1. The two parties you return must be the parties to THIS document. If the document is a subcontract, the parties are the head contractor and the subcontractor — NOT the Principal and Contractor of the head contract that may be referenced in recitals as background.

2. Use the actual entity names, not generic role labels. "John Holland Pty Ltd" — not "Principal" or "Contractor". If you cannot find an entity name with confidence, omit the party rather than guess.

3. The role you give each party is the role they play IN THIS DOCUMENT. For a subcontract that's typically "Head Contractor" and "Subcontractor". For a consultancy it might be "Client" and "Consultant" or "Principal" and "Consultant". Use whatever language the contract itself uses.

4. project_name is the construction PROJECT (e.g. "Cross River Rail — Albert Street Station", "Riverside Industrial Estate Stage 2"). It is NOT the contract title, NOT the document filename, NOT the contract reference number. If the project name is not stated explicitly, omit project_name entirely — do not guess.

5. contract_title is the title of this specific document (e.g. "Subcontract Agreement", "Consultancy Services Agreement", "Head Contract — Conditions of Contract").

6. contract_type — return EXACTLY ONE of these six values:
   - "dc_head_contract" — Design & Construct head contract (between Principal and Head Contractor; design liability flows to the Contractor)
   - "construct_only_head_contract" — Construct only head contract (between Principal and Head Contractor; design done by Principal/its consultant)
   - "dc_subcontract" — Design & Construct subcontract (between Head Contractor and Subcontractor; design portion flows to Subcontractor)
   - "construct_only_subcontract" — Construct only subcontract (between Head Contractor and Subcontractor; no design obligation on Subcontractor)
   - "consultancy_agreement" — Consultancy agreement (engaging an architect, engineer, project manager, etc.)
   - "other" — anything else (deed of variation, supply only, novation deed, etc.)

   Use textual cues: subcontract terminology means it's a subcontract; "design and construct" / "design liability" / "design responsibility" wording indicates a D&C; absence of design wording in a build-only scope indicates Construct only.

7. contract_form is the published standard form on which the contract is based, if any. Use one of: "AS4000-1997", "AS4902-2000", "AS2124-1992", "AS4901-1998", "AS4903-2000", "AS4300-1995", "AS4305-1996", "AS4905-2002", "AS4906-2002", "AS4910-2002", "AS4912-2002", "AS4915-2002", "AS4916-2002", "AS4949-2003", "AS4950-2006", "AS4970-2009", "AS4920-2003", "GC21", "MW21", "ABIC SW-2018", "ABIC MW-2018", "NEC4", "FIDIC Red Book", "FIDIC Yellow Book", "FIDIC Silver Book", "JCT", or "bespoke". Only return one of these. If you cannot identify with reasonable confidence, return "bespoke".

8. contract_administrator is the named person/entity who administers the contract under it (Superintendent, Principal's Representative, Contract Administrator, Engineer, Project Manager, Architect, etc.). Include who they represent (party "a" or party "b") if the contract says.

9. Provide a source_text quote (verbatim, short — under 30 words) for every non-trivial fact so a reviewer can verify.

10. If a fact cannot be found in the text, OMIT IT from the JSON. Do NOT include null/empty values. Do NOT guess.

Output JSON only, no markdown fences. Schema:
{
  "contract_type": { "value": "dc_head_contract|construct_only_head_contract|dc_subcontract|construct_only_subcontract|consultancy_agreement|other", "confidence": 0.0-1.0, "source_text": "quote" },
  "contract_title": { "value": "...", "source_text": "quote" },
  "project_name": { "value": "...", "source_text": "quote" },
  "contract_form": { "value": "AS4000-1997|...|bespoke", "confidence": 0.0-1.0, "source_text": "quote" },
  "party_a": { "name": "...", "role": "...", "address": "...", "abn": "...", "source_text": "quote" },
  "party_b": { "name": "...", "role": "...", "address": "...", "abn": "...", "source_text": "quote" },
  "contract_administrator": { "name": "...", "role": "Superintendent|...", "from_party": "a|b", "source_text": "quote" },
  "contract_date": { "value": "YYYY-MM-DD", "source_text": "quote" },
  "contract_sum": { "value": 12345678, "currency": "AUD", "source_text": "quote" },
  "date_for_practical_completion": { "value": "YYYY-MM-DD", "source_text": "quote" },
  "defects_liability_period": { "value": "12 months", "source_text": "quote" },
  "reference_number": { "value": "...", "source_text": "quote" },
  "site_address": { "value": "...", "source_text": "quote" },
  "scope_summary": { "value": "one short sentence describing the works under this contract" }
}`

function deriveLegacyShims(facts: ExtractedFacts): ExtractedFacts {
  // Some older callers still read facts.principal / facts.contractor / facts.superintendent.
  // Surface the new structure under those keys when the role string makes it obvious.
  const a = facts.party_a
  const b = facts.party_b

  const isPrincipalRole = (r?: string) => !!r && /(principal|owner|developer|client|head contractor)/i.test(r) && !/(subcontractor|consultant)/i.test(r)
  const isContractorRole = (r?: string) => !!r && /(contractor|subcontractor|consultant|supplier)/i.test(r)

  let principal: PartyFact | undefined
  let contractor: PartyFact | undefined
  if (isPrincipalRole(a?.role)) principal = a
  if (isPrincipalRole(b?.role)) principal = b
  if (isContractorRole(a?.role)) contractor = a
  if (isContractorRole(b?.role)) contractor = b
  // Fall back: if we couldn't infer roles, just map a→principal, b→contractor.
  if (!principal && !contractor) {
    principal = a
    contractor = b
  }

  return {
    ...facts,
    principal,
    contractor,
    superintendent: facts.contract_administrator,
  }
}

export async function extractFacts(contractId: string): Promise<ExtractedFacts> {
  const sb = admin()

  // Pull a wider slice than before. Front-matter for parties + recitals; the
  // back of the document for execution pages where signed party names appear;
  // and any chunks containing the canonical "between … and …" phrasing.
  const { data: frontChunks } = await sb
    .from('document_chunks')
    .select('content, chunk_index')
    .eq('contract_id', contractId)
    .lte('chunk_index', 8)
    .order('chunk_index')

  const { data: keywordChunks } = await sb
    .from('document_chunks')
    .select('content, chunk_index')
    .eq('contract_id', contractId)
    .or(
      [
        'content.ilike.%between%and%',
        'content.ilike.%this agreement%',
        'content.ilike.%this subcontract%',
        'content.ilike.%this contract%',
        'content.ilike.%annexure%',
        'content.ilike.%schedule 1%',
        'content.ilike.%instrument of agreement%',
        'content.ilike.%executed by%',
        'content.ilike.%signed by%',
        'content.ilike.%project%',
        'content.ilike.%superintendent%',
        'content.ilike.%principal\'s representative%',
      ].join(','),
    )
    .limit(20)

  // Last few chunks (signature / execution pages often live at the end)
  const { count: total } = await sb
    .from('document_chunks')
    .select('id', { count: 'exact', head: true })
    .eq('contract_id', contractId)
  const tailFrom = Math.max(0, (total || 0) - 4)
  const { data: tailChunks } = await sb
    .from('document_chunks')
    .select('content, chunk_index')
    .eq('contract_id', contractId)
    .gte('chunk_index', tailFrom)
    .order('chunk_index')

  const all = [...(frontChunks || []), ...(keywordChunks || []), ...(tailChunks || [])]
  const seen = new Set<number>()
  const unique = all.filter((c) => {
    if (seen.has(c.chunk_index)) return false
    seen.add(c.chunk_index)
    return true
  })
  unique.sort((a, b) => a.chunk_index - b.chunk_index)

  const text = unique
    .map((c) => `[chunk ${c.chunk_index}]\n${c.content}`)
    .join('\n\n---\n\n')
    .slice(0, 60000)

  if (text.length < 100) {
    return {}
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0,
      max_tokens: 2500,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Extract the facts from this contract:\n\n${text}` },
      ],
      response_format: { type: 'json_object' },
    })

    const raw = response.choices[0]?.message?.content || '{}'
    const facts = JSON.parse(raw) as ExtractedFacts
    const enriched = deriveLegacyShims(facts)

    // Best-effort: also pull a topic→clause map so the assistant page can
    // show contract-specific suggestion chips ("Draft a variation claim
    // under clause 12.4"). Failure here must not break the main flow.
    try {
      const topics = await extractClauseTopics(contractId)
      if (topics && Object.keys(topics).length > 0) {
        enriched.clause_topics = topics
      }
    } catch (e) {
      console.error('[ContractFacts] clause_topics extraction failed:', e)
    }

    await sb.from('contracts').update({
      extracted_facts: enriched,
      facts_extracted_at: new Date().toISOString(),
    }).eq('id', contractId)

    console.log(
      `[ContractFacts] Extracted facts for contract ${contractId}:`,
      Object.keys(enriched),
    )

    return enriched
  } catch (err) {
    console.error('[ContractFacts] Extraction failed:', err)
    return {}
  }
}

const CLAUSE_TOPIC_PROMPT = `You map common contract topics to the specific clause number used in this construction contract.

Read the chunks below and return JSON with the clause number string for each topic that the contract addresses. Use the exact clause numbering style the contract uses (e.g. "10.4", "34", "11.1(a)", "Clause 27" → return "27").

Schema:
{
  "delay": "clause number for delay events / qualifying causes of delay",
  "extension_of_time": "clause number for EOT claims",
  "variation": "clause number for variations / changes / directions to vary",
  "payment_claim": "clause number for payment claims and progress payments",
  "dispute_resolution": "clause number for disputes / dispute resolution",
  "defects_liability": "clause number for defects liability period / rectification",
  "liquidated_damages": "clause number for liquidated damages",
  "latent_conditions": "clause number for latent conditions / unforeseen physical conditions",
  "termination": "clause number for termination",
  "practical_completion": "clause number for practical completion"
}

OMIT any topic the contract does not clearly address. Do NOT guess. Return ONLY the JSON, no prose.`

async function extractClauseTopics(contractId: string): Promise<ClauseTopics | null> {
  const sb = admin()

  const topicHints = [
    '%delay%', '%extension of time%', '%eot%',
    '%variation%', '%change order%', '%direct%vary%',
    '%payment claim%', '%progress claim%', '%progress payment%',
    '%dispute%', '%adjudic%',
    '%defect%', '%rectif%',
    '%liquidated damages%',
    '%latent condition%', '%unforeseen%physical%',
    '%termination%', '%terminate%',
    '%practical completion%',
  ]

  const { data: hits } = await sb
    .from('document_chunks')
    .select('content, clause_numbers')
    .eq('contract_id', contractId)
    .or(topicHints.map(h => `content.ilike.${h}`).join(','))
    .limit(40)

  if (!hits || hits.length === 0) return null

  // Trim per-chunk content so we stay under the token budget
  const text = hits
    .map(h => h.content.slice(0, 1500))
    .join('\n\n---\n\n')
    .slice(0, 30000)

  if (text.length < 100) return null

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    max_tokens: 400,
    messages: [
      { role: 'system', content: CLAUSE_TOPIC_PROMPT },
      { role: 'user', content: `Contract chunks:\n\n${text}` },
    ],
    response_format: { type: 'json_object' },
  })

  const raw = response.choices[0]?.message?.content || '{}'
  const parsed = JSON.parse(raw) as Record<string, unknown>

  // Sanity-strip — keep only string values that contain a digit (real clause refs)
  const cleaned: ClauseTopics = {}
  for (const key of [
    'delay', 'extension_of_time', 'variation', 'payment_claim',
    'dispute_resolution', 'defects_liability', 'liquidated_damages',
    'latent_conditions', 'termination', 'practical_completion',
  ] as const) {
    const v = parsed[key]
    if (typeof v === 'string' && /\d/.test(v) && v.length < 20) {
      cleaned[key] = v.replace(/^Clause\s+/i, '').trim()
    }
  }
  return Object.keys(cleaned).length ? cleaned : null
}
