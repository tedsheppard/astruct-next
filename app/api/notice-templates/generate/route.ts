import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/**
 * POST /api/notice-templates/generate
 * Body: { notice_type_id, contract_id }
 *
 * Agent 2: Generates a compliant notice template with smart placeholders.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { notice_type_id, contract_id } = await request.json()
    if (!notice_type_id || !contract_id) {
      return Response.json({ error: 'notice_type_id and contract_id required' }, { status: 400 })
    }

    const admin = createAdminClient()

    // Load notice type
    const { data: noticeType } = await admin
      .from('notice_types')
      .select('*')
      .eq('id', notice_type_id)
      .single()

    if (!noticeType) return Response.json({ error: 'Notice type not found' }, { status: 404 })

    // Load contract metadata
    const { data: contract } = await admin
      .from('contracts')
      .select('name, contract_form, party1_name, party2_name, party1_role, party2_role, party1_address, party2_address, administrator_name, administrator_role, user_is_party, reference_number')
      .eq('id', contract_id)
      .single()

    if (!contract) return Response.json({ error: 'Contract not found' }, { status: 404 })

    // Load relevant contract text via chunks
    const { data: chunks } = await admin
      .from('document_chunks')
      .select('content')
      .eq('contract_id', contract_id)
      .or(noticeType.clause_references.map((ref: string) => `content.ilike.%clause ${ref}%`).join(','))
      .limit(15)

    const contractContext = (chunks || []).map((c: { content: string }) => c.content).join('\n\n---\n\n')

    // Load user profile for letterhead defaults
    const { data: profile } = await admin
      .from('profiles')
      .select('company_name, signatory_name, signatory_title')
      .eq('id', user.id)
      .single()

    const party1 = contract.party1_name || 'Principal'
    const party2 = contract.party2_name || 'Contractor'
    const userParty = contract.user_is_party === 'party1' ? party1 : party2

    // Generate template
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.3,
      max_tokens: 4000,
      messages: [
        {
          role: 'system',
          content: `You are an expert Australian construction contract administrator drafting a reusable notice template. Create a complete, formal notice template for "${noticeType.name}" under ${contract.contract_form || 'a standard form'} contract.

CONTRACT CONTEXT:
- Contract: ${contract.name}
- ${contract.party1_role || 'Principal'}: ${party1}${contract.party1_address ? ', ' + contract.party1_address : ''}
- ${contract.party2_role || 'Contractor'}: ${party2}${contract.party2_address ? ', ' + contract.party2_address : ''}
- ${contract.administrator_role || 'Superintendent'}: ${contract.administrator_name || 'Not specified'}
- User is: ${userParty}
- Company: ${profile?.company_name || 'Not set'}
- Signatory: ${profile?.signatory_name || 'Not set'}, ${profile?.signatory_title || ''}

NOTICE TYPE: ${noticeType.name}
DESCRIPTION: ${noticeType.description}
CLAUSE REFERENCES: ${noticeType.clause_references.join(', ')}
FORMAL REQUIREMENTS:
${(noticeType.formal_requirements || []).map((r: string) => `- ${r}`).join('\n')}

RELEVANT CONTRACT TEXT:
${contractContext.slice(0, 15000)}

TEMPLATE REQUIREMENTS:
1. Include every formal requirement mandated by the relevant clauses
2. Use SMART PLACEHOLDERS — not generic [FILL IN] blanks. Each placeholder must be a distinct token like {{DATE_OF_DELAY_EVENT}}, {{NUMBER_OF_DAYS_CLAIMED}}, {{DESCRIPTION_OF_EVENT}}
3. Use real party names from the contract (${party1}, ${party2})
4. Include: date, addressee block, reference line, subject, factual recitals, operative notice wording, specific clause references, signatory block
5. Draft in plain English consistent with Australian construction administration practice
6. Start with: DRAFT — REVIEW BEFORE SENDING

After the template, provide a JSON block with placeholder metadata:
---PLACEHOLDERS---
{
  "DATE_OF_DELAY_EVENT": { "label": "Date the delay event occurred", "hint": "The specific date the event began", "type": "date" },
  ...
}
---END_PLACEHOLDERS---

Write the template in markdown format.`
        },
        {
          role: 'user',
          content: `Generate the ${noticeType.name} template now.`
        }
      ],
    })

    const fullText = response.choices[0]?.message?.content || ''

    // Parse placeholders
    let placeholders = {}
    const phMatch = fullText.match(/---PLACEHOLDERS---([\s\S]*?)---END_PLACEHOLDERS---/)
    if (phMatch) {
      try {
        placeholders = JSON.parse(phMatch[1].trim())
      } catch { /* ignore parse errors */ }
    }

    // Extract template body (everything before PLACEHOLDERS block)
    let body = fullText.replace(/---PLACEHOLDERS---[\s\S]*---END_PLACEHOLDERS---/, '').trim()

    // Check for existing template (for regeneration)
    const { data: existing } = await admin
      .from('notice_templates')
      .select('id, version')
      .eq('notice_type_id', notice_type_id)
      .single()

    let template
    if (existing) {
      // Save current version to history
      const { data: current } = await admin
        .from('notice_templates')
        .select('body, placeholders, version')
        .eq('id', existing.id)
        .single()

      if (current) {
        await admin.from('notice_template_versions').insert({
          notice_template_id: existing.id,
          body: current.body,
          placeholders: current.placeholders,
          version: current.version,
        })
      }

      // Update existing
      const { data: updated } = await admin
        .from('notice_templates')
        .update({
          body,
          placeholders,
          status: 'draft_generated',
          version: (existing.version || 1) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select('id, status, version')
        .single()

      template = updated
    } else {
      // Create new
      const { data: created } = await admin
        .from('notice_templates')
        .insert({
          notice_type_id,
          contract_id,
          body,
          placeholders,
          status: 'draft_generated',
          version: 1,
        })
        .select('id, status, version')
        .single()

      template = created
    }

    return Response.json({ template })
  } catch (err) {
    console.error('[NoticeTemplates] Generate error:', err)
    return Response.json({ error: `Generation failed: ${err instanceof Error ? err.message : 'Unknown error'}` }, { status: 500 })
  }
}
