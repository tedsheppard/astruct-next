import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const admin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface ExtractedFacts {
  principal?: { name: string; address?: string; abn?: string; source_text?: string }
  contractor?: { name: string; address?: string; abn?: string; source_text?: string }
  superintendent?: { name: string; address?: string; source_text?: string }
  contract_date?: { value: string; source_text?: string }
  contract_sum?: { value: number; currency: string; source_text?: string }
  date_for_practical_completion?: { value: string; source_text?: string }
  defects_liability_period?: { value: string; source_text?: string }
  reference_number?: { value: string; source_text?: string }
  site_address?: { value: string; source_text?: string }
  contract_form?: { value: string; confidence: number }
}

export async function extractFacts(contractId: string): Promise<ExtractedFacts> {
  const sb = admin()

  // Get front-matter chunks (first pages where parties/dates usually are)
  const { data: frontChunks } = await sb
    .from('document_chunks')
    .select('content, section_heading, chunk_index')
    .eq('contract_id', contractId)
    .lte('chunk_index', 5)
    .order('chunk_index')

  // Also get annexure/schedule chunks (AS forms put key facts there)
  const { data: annexureChunks } = await sb
    .from('document_chunks')
    .select('content, section_heading, chunk_index')
    .eq('contract_id', contractId)
    .or('content.ilike.%annexure%,content.ilike.%schedule%,content.ilike.%Part A%,content.ilike.%instrument of agreement%,content.ilike.%parties%')
    .limit(10)

  const allChunks = [...(frontChunks || []), ...(annexureChunks || [])]
  // Deduplicate by chunk_index
  const seen = new Set<number>()
  const uniqueChunks = allChunks.filter(c => {
    if (seen.has(c.chunk_index)) return false
    seen.add(c.chunk_index)
    return true
  })

  const contractText = uniqueChunks.map(c => c.content).join('\n\n---\n\n')

  if (contractText.length < 100) {
    return {}
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0,
      max_tokens: 2000,
      messages: [
        {
          role: 'system',
          content: `Extract key contract facts from the provided construction contract text. For each fact, provide the value and the exact source text (a short quote from the document where you found it).

Return JSON only, no markdown fences:
{
  "principal": { "name": "...", "address": "...", "abn": "...", "source_text": "exact quote" },
  "contractor": { "name": "...", "address": "...", "abn": "...", "source_text": "exact quote" },
  "superintendent": { "name": "...", "address": "...", "source_text": "exact quote" },
  "contract_date": { "value": "YYYY-MM-DD", "source_text": "exact quote" },
  "contract_sum": { "value": 12345678, "currency": "AUD", "source_text": "exact quote" },
  "date_for_practical_completion": { "value": "YYYY-MM-DD", "source_text": "exact quote" },
  "defects_liability_period": { "value": "12 months", "source_text": "exact quote" },
  "reference_number": { "value": "...", "source_text": "exact quote" },
  "site_address": { "value": "...", "source_text": "exact quote" },
  "contract_form": { "value": "AS4000-1997 or similar", "confidence": 0.95 }
}

If a fact cannot be found in the text, omit it from the JSON (don't return null values).
The "name" fields should be the full legal entity name (e.g. "John Holland Pty Ltd"), not generic terms like "Principal" or "Contractor".`
        },
        {
          role: 'user',
          content: `Extract facts from this contract:\n\n${contractText.slice(0, 20000)}`
        }
      ],
      response_format: { type: 'json_object' },
    })

    const text = response.choices[0]?.message?.content || '{}'
    const facts = JSON.parse(text) as ExtractedFacts

    // Save to contract
    await sb.from('contracts').update({
      extracted_facts: facts,
      facts_extracted_at: new Date().toISOString(),
    }).eq('id', contractId)

    console.log(`[ContractFacts] Extracted facts for contract ${contractId}:`, Object.keys(facts))

    return facts
  } catch (err) {
    console.error('[ContractFacts] Extraction failed:', err)
    return {}
  }
}
