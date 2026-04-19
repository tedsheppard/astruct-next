import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/**
 * POST /api/notice-types/scan
 * Body: { contract_id }
 *
 * Agent 1: Scans a contract and identifies every notice type it contemplates.
 * Uses the full contract text (or chunked RAG context for very long contracts).
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { contract_id } = await request.json()
    if (!contract_id) return Response.json({ error: 'contract_id required' }, { status: 400 })

    const admin = createAdminClient()

    // Load contract documents with extracted text
    const { data: docs } = await admin
      .from('documents')
      .select('filename, extracted_text, category')
      .eq('contract_id', contract_id)
      .not('extracted_text', 'is', null)

    if (!docs || docs.length === 0) {
      return Response.json({ error: 'No documents with extracted text found. Upload and process contract documents first.' }, { status: 400 })
    }

    // Build contract text, prioritising contract docs
    const contractDocs = docs.filter(d => d.category === '01_contract')
    const otherDocs = docs.filter(d => d.category !== '01_contract')

    let contractText = contractDocs.map(d => `--- ${d.filename} ---\n${d.extracted_text}`).join('\n\n')
    // Add other docs if space allows
    if (contractText.length < 60000) {
      const remaining = 80000 - contractText.length
      const otherText = otherDocs.map(d => `--- ${d.filename} ---\n${d.extracted_text?.slice(0, 5000)}`).join('\n\n')
      contractText += '\n\n' + otherText.slice(0, remaining)
    }
    contractText = contractText.slice(0, 80000)

    // Load contract metadata
    const { data: contract } = await admin
      .from('contracts')
      .select('name, contract_form, party1_name, party2_name, party1_role, party2_role')
      .eq('id', contract_id)
      .single()

    const party1 = contract?.party1_name || 'Principal'
    const party2 = contract?.party2_name || 'Contractor'

    // Call AI to identify notice types
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0,
      max_tokens: 4000,
      messages: [
        {
          role: 'system',
          content: `You are an expert Australian construction contract analyst. Analyse the provided contract documents and identify every distinct type of notice that either party could be required or permitted to give under this contract's specific terms.

For each notice type, provide:
- name: a clear, standard name (e.g. "Notice of Delay", "Extension of Time Claim", "Variation Direction Response", "Payment Claim", "Dispute Notice")
- description: 1-2 sentences explaining when this notice is given and by whom, specific to this contract
- clause_references: array of clause numbers from the contract that govern this notice (e.g. ["33.1", "33.2"])
- formal_requirements: array of specific requirements from the clauses (e.g. ["Must be in writing", "Must be given within 28 days of becoming aware of the delay", "Must state the cause of delay and estimated period"])

IMPORTANT:
- Only list notice types actually grounded in THIS contract's clauses. Do not invent generic notices not supported by the text.
- Every notice type MUST cite at least one clause reference from the contract.
- Be comprehensive — identify all notice types for both ${party1} and ${party2}.
- Include both mandatory notices (must give) and permissive notices (may give).
- The contract form is ${contract?.contract_form || 'not specified'}.

Respond with JSON only, no markdown fences:
[
  {
    "name": "...",
    "description": "...",
    "clause_references": ["..."],
    "formal_requirements": ["..."]
  }
]`
        },
        {
          role: 'user',
          content: `Contract: ${contract?.name || 'Unnamed'}\nParties: ${party1} (${contract?.party1_role || 'Principal'}) and ${party2} (${contract?.party2_role || 'Contractor'})\n\nContract text:\n${contractText}`
        }
      ],
    })

    const text = response.choices[0]?.message?.content || '[]'
    let noticeTypes: Array<{
      name: string
      description: string
      clause_references: string[]
      formal_requirements: string[]
    }> = []

    try {
      const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '')
      const match = cleaned.match(/\[[\s\S]*\]/)
      if (match) noticeTypes = JSON.parse(match[0])
    } catch (e) {
      console.error('[NoticeTypes] JSON parse error:', e)
      return Response.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

    if (!Array.isArray(noticeTypes) || noticeTypes.length === 0) {
      return Response.json({ error: 'No notice types identified. The contract text may not contain recognisable notice provisions.' }, { status: 400 })
    }

    // Delete existing notice types for this contract (in case of re-scan)
    await admin.from('notice_types').delete().eq('contract_id', contract_id)

    // Insert new notice types
    const rows = noticeTypes.map(nt => ({
      contract_id,
      name: nt.name,
      description: nt.description,
      clause_references: nt.clause_references || [],
      formal_requirements: nt.formal_requirements || [],
    }))

    const { data: inserted, error: insertError } = await admin
      .from('notice_types')
      .insert(rows)
      .select('id, name, description, clause_references')

    if (insertError) {
      console.error('[NoticeTypes] Insert error:', insertError)
      return Response.json({ error: 'Failed to save notice types' }, { status: 500 })
    }

    // Mark contract as scanned
    await admin.from('contracts').update({ notice_types_scanned: true }).eq('id', contract_id)

    return Response.json({ notice_types: inserted, count: inserted?.length || 0 })
  } catch (err) {
    console.error('[NoticeTypes] Error:', err)
    return Response.json({ error: `Scan failed: ${err instanceof Error ? err.message : 'Unknown error'}` }, { status: 500 })
  }
}
