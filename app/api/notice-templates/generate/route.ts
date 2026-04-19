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

    // Load contract front matter (first chunks — where party names, addresses, dates are)
    const { data: frontChunks } = await admin
      .from('document_chunks')
      .select('content, chunk_index')
      .eq('contract_id', contract_id)
      .lte('chunk_index', 3)
      .order('chunk_index')
      .limit(4)

    // Load clause-specific chunks
    const clauseFilter = noticeType.clause_references.map((ref: string) => `content.ilike.%clause ${ref}%`).join(',')
    const { data: clauseChunks } = await admin
      .from('document_chunks')
      .select('content, chunk_index')
      .eq('contract_id', contract_id)
      .or(clauseFilter || 'id.is.null')
      .limit(10)

    // Merge and deduplicate
    const seenIndexes = new Set<number>()
    const allChunks: string[] = []
    for (const c of [...(frontChunks || []), ...(clauseChunks || [])]) {
      if (!seenIndexes.has(c.chunk_index)) {
        seenIndexes.add(c.chunk_index)
        allChunks.push(c.content)
      }
    }
    const contractContext = allChunks.join('\n\n---\n\n')

    // Load user profile for letterhead defaults
    const { data: profile } = await admin
      .from('profiles')
      .select('company_name, company_abn, company_address, company_phone, signatory_name, signatory_title')
      .eq('id', user.id)
      .single()

    // Detect if party names are just generic role names (not actual legal names)
    const genericNames = ['Principal', 'Contractor', 'Subcontractor', 'Superintendent', '']
    const party1Raw = contract.party1_name || ''
    const party2Raw = contract.party2_name || ''
    const party1 = genericNames.includes(party1Raw) ? '' : party1Raw
    const party2 = genericNames.includes(party2Raw) ? '' : party2Raw
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

ABSOLUTE RULE — PLACEHOLDER FORMAT:
Every variable data point in the template body MUST be emitted as a {{TOKEN}} with a corresponding entry in the placeholders metadata object.

FORBIDDEN — NEVER DO THESE:
- Square-bracket placeholders like [Like This] or [Fill in here] — NEVER emit these
- Wrapping a smart token in square brackets like [Date: {{CURRENT_DATE}}] — just emit {{CURRENT_DATE}}
- Parenthetical instructions like (enter date here) — use a smart token instead
- Labels before tokens like "Date:" before {{DATE}} — just emit the token

EXAMPLES:
❌ WRONG: [Date: {{CURRENT_DATE}}]
✅ RIGHT: {{CURRENT_DATE}}

❌ WRONG: [Provide detailed description of the delay]
✅ RIGHT: {{DELAY_DESCRIPTION}}

❌ WRONG: [Recipient Name: {{RECIPIENT_NAME}}]
✅ RIGHT: {{RECIPIENT_NAME}}

❌ WRONG: Dear [Principal's Contact Name],
✅ RIGHT: Dear {{RECIPIENT_CONTACT_NAME}},

If you catch yourself about to write a square bracket for a placeholder, stop. Emit a {{TOKEN}} instead.

STEP 1 — EXTRACT ACTUAL DETAILS FROM THE CONTRACT TEXT BELOW:
You MUST read the "RELEVANT CONTRACT TEXT" section below and extract:
(a) The full legal name of each party — look in the first page, recitals, or schedule. The contract WILL state the actual company names. DO NOT use "Principal" or "Contractor" as party names — find the real Pty Ltd / Ltd names.
(b) Each party's registered address — usually near the party names
(c) The date of the contract
(d) The contract reference/number
(e) The superintendent's or administrator's name

Hard-code ALL of these into the template. Do NOT use {{PARTY_1_NAME}} or {{PARTY_2_NAME}} placeholders if the names are in the contract text. ONLY use a placeholder if the information genuinely cannot be found.

STEP 2 — DRAFT THE TEMPLATE:

CONTRACT METADATA (may be incomplete — extract real details from the contract text instead):
- Contract form: ${contract.contract_form || 'Standard form'}
- Project name: ${contract.name}

SENDER LETTERHEAD (hard-code these into the sender block):
${senderBlock}
Signatory: ${profile?.signatory_name || '{{SIGNATORY_NAME}}'}${profile?.signatory_title ? ', ' + profile.signatory_title : ''}

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

    // Programmatic cleanup: remove any remaining bracketed placeholders
    // Pattern: [Text Like This] but NOT markdown links [text](url)
    const bracketPattern = /\[([A-Z][^\]]*?)\](?!\()/g
    const bracketMatches = body.match(bracketPattern)
    if (bracketMatches && bracketMatches.length > 0) {
      console.log(`[NoticeTemplates] Found ${bracketMatches.length} bracketed placeholders, cleaning up:`, bracketMatches)
      // Convert bracketed placeholders to smart tokens
      body = body.replace(bracketPattern, (match, content) => {
        // If it already contains a {{TOKEN}}, extract just the token
        const tokenMatch = content.match(/\{\{([A-Z_]+)\}\}/)
        if (tokenMatch) return `{{${tokenMatch[1]}}}`
        // Otherwise, create a token from the content
        const token = content.toUpperCase().replace(/[^A-Z0-9\s]/g, '').replace(/\s+/g, '_').slice(0, 40)
        if (token && !(placeholders as Record<string, unknown>)[token]) {
          (placeholders as Record<string, { label: string; hint: string; type: string }>)[token] = {
            label: content,
            hint: `Enter: ${content}`,
            type: 'text',
          }
        }
        return `{{${token}}}`
      })
    }

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
