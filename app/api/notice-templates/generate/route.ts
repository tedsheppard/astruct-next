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
      .select('company_name, company_abn, company_address, company_phone, signatory_name, signatory_title')
      .eq('id', user.id)
      .single()

    const party1 = contract.party1_name || ''
    const party2 = contract.party2_name || ''
    const userParty = contract.user_is_party === 'party1' ? party1 : party2
    const otherParty = contract.user_is_party === 'party1' ? party2 : party1
    const userRole = contract.user_is_party === 'party1' ? (contract.party1_role || 'Principal') : (contract.party2_role || 'Contractor')
    const otherRole = contract.user_is_party === 'party1' ? (contract.party2_role || 'Contractor') : (contract.party1_role || 'Principal')
    const otherAddress = contract.user_is_party === 'party1' ? contract.party2_address : contract.party1_address

    // Build sender block from letterhead
    const hasLetterhead = !!(profile?.company_name)
    const senderBlock = hasLetterhead
      ? [
          profile.company_name,
          profile.company_abn ? `ABN: ${profile.company_abn}` : null,
          profile.company_address,
          profile.company_phone ? `Phone: ${profile.company_phone}` : null,
        ].filter(Boolean).join('\n')
      : '{{SENDER_COMPANY_NAME}}\n{{SENDER_ADDRESS}}'

    // Generate template
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.3,
      max_tokens: 4000,
      messages: [
        {
          role: 'system',
          content: `You are an expert Australian construction contract administrator drafting a reusable notice template.

STEP 1 — EXTRACT ACTUAL DETAILS FROM THE CONTRACT:
Before drafting, identify from the contract text:
(a) The full legal name of each party (use these, NOT generic "Principal"/"Contractor")
(b) Each party's registered address if stated
(c) The contract date
(d) Any named signatory or contact person
(e) The contract reference number
Use these actual values in the draft. If any is not clearly stated in the contract, use a smart placeholder token.

STEP 2 — DRAFT THE TEMPLATE:

CONTRACT PARTIES:
- ${userRole}: ${party1 || '{{PARTY_1_NAME}}'}${contract.party1_address ? ', ' + contract.party1_address : ''}
- ${otherRole}: ${party2 || '{{PARTY_2_NAME}}'}${contract.party2_address ? ', ' + contract.party2_address : ''}
- ${contract.administrator_role || 'Superintendent'}: ${contract.administrator_name || '{{SUPERINTENDENT_NAME}}'}
- Contract form: ${contract.contract_form || 'Standard form'}
- Contract name: ${contract.name}

SENDER (user's letterhead — hard-code these, do NOT use placeholders):
${senderBlock}
Signatory: ${profile?.signatory_name || '{{SIGNATORY_NAME}}'}${profile?.signatory_title ? ', ' + profile.signatory_title : ''}

RECIPIENT: ${otherParty || '{{RECIPIENT_NAME}}'}
${otherAddress || '{{RECIPIENT_ADDRESS}}'}

NOTICE TYPE: ${noticeType.name}
DESCRIPTION: ${noticeType.description}
CLAUSE REFERENCES: ${noticeType.clause_references.join(', ')}
FORMAL REQUIREMENTS:
${(noticeType.formal_requirements || []).map((r: string) => `- ${r}`).join('\n')}

RELEVANT CONTRACT TEXT:
${contractContext.slice(0, 15000)}

CRITICAL RULES:
1. Use the ACTUAL party names from the contract (e.g. "${party1}" and "${party2}"), NOT "Principal"/"Contractor" — except as defined terms after introducing the actual names
2. NEVER use [bracketed] placeholders like [Contract Date] or [Principal's Name]. ONLY use {{SMART_TOKENS}}
3. Every {{TOKEN}} MUST have a matching entry in the placeholders metadata
4. For data available in the contract (party names, addresses, contract date, clause numbers) → hard-code the actual value
5. For data from the user's letterhead → hard-code the actual value (already provided above)
6. For data unknown until the notice is actually sent → use {{SMART_TOKEN}} with metadata
7. Include: date, sender block, addressee block, reference line, subject, factual recitals, operative notice wording with clause citations, signatory block
8. Draft in plain English consistent with Australian construction administration practice
9. Start with: DRAFT — REVIEW BEFORE SENDING

After the template, provide placeholder metadata:
---PLACEHOLDERS---
{
  "TOKEN_NAME": { "label": "Human-readable label", "hint": "What to put here", "type": "date|number|text" }
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
