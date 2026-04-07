import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Anthropic from '@anthropic-ai/sdk'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' })

/**
 * POST /api/deadlines/scan
 *
 * Scans a document or correspondence item against contract terms
 * to intelligently identify deadlines, response timeframes, and obligations.
 *
 * Body: { contract_id, document_id?, correspondence_id?, trigger: 'upload' | 'correspondence' | 'manual' }
 *
 * Called automatically after:
 * - Document upload (from upload/route.ts)
 * - Correspondence creation (from correspondence save)
 * - Manual trigger from calendar UI
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { contract_id, document_id, correspondence_id, trigger } = await request.json()

    if (!contract_id) {
      return Response.json({ error: 'contract_id is required' }, { status: 400 })
    }

    const admin = createAdminClient()

    // Load contract details for context
    const { data: contract } = await admin
      .from('contracts')
      .select('*')
      .eq('id', contract_id)
      .single()

    if (!contract) {
      return Response.json({ error: 'Contract not found' }, { status: 404 })
    }

    // Load contract terms (the main contract document text for time-bar context)
    const { data: contractDocs } = await admin
      .from('documents')
      .select('filename, extracted_text, category')
      .eq('contract_id', contract_id)
      .eq('category', '01_contract')

    const contractTerms = (contractDocs || [])
      .filter(d => d.extracted_text)
      .map(d => d.extracted_text)
      .join('\n\n')
      .slice(0, 80000) // Cap at ~20K tokens

    // Determine what text to scan for deadlines
    let scanText = ''
    let scanContext = ''

    if (document_id) {
      const { data: doc } = await admin
        .from('documents')
        .select('filename, extracted_text, category, ai_summary')
        .eq('id', document_id)
        .single()

      if (!doc?.extracted_text) {
        return Response.json({ success: true, deadlines_created: 0, message: 'No text to scan' })
      }
      scanText = doc.extracted_text.slice(0, 30000)
      scanContext = `Document: ${doc.filename} (Category: ${doc.category})`
    } else if (correspondence_id) {
      const { data: corr } = await admin
        .from('correspondence')
        .select('subject, content, from_party, category, date_received, clause_tags')
        .eq('id', correspondence_id)
        .single()

      if (!corr) {
        return Response.json({ error: 'Correspondence not found' }, { status: 404 })
      }
      scanText = `Subject: ${corr.subject}\nFrom: ${corr.from_party}\nDate: ${corr.date_received}\nCategory: ${corr.category}\n\n${corr.content || ''}`
      scanContext = `Correspondence from ${corr.from_party}: "${corr.subject}"`
    } else if (trigger === 'manual') {
      // Scan ALL documents for the contract
      const { data: allDocs } = await admin
        .from('documents')
        .select('filename, extracted_text, category')
        .eq('contract_id', contract_id)
        .not('extracted_text', 'is', null)

      scanText = (allDocs || [])
        .map(d => `--- ${d.filename} ---\n${d.extracted_text?.slice(0, 15000) || ''}`)
        .join('\n\n')
        .slice(0, 80000)
      scanContext = `Full contract library scan (${allDocs?.length || 0} documents)`
    } else {
      return Response.json({ error: 'document_id, correspondence_id, or trigger=manual required' }, { status: 400 })
    }

    // Build party context
    const party1 = contract.party1_name || contract.principal_name || 'Principal'
    const party2 = contract.party2_name || contract.contractor_name || 'Contractor'
    const userParty = contract.user_is_party === 'party1' ? party1 : party2

    const today = new Date().toISOString().split('T')[0]
    const pcDate = contract.date_practical_completion || 'Not specified'

    // Call AI to identify deadlines
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      temperature: 0,
      messages: [{
        role: 'user',
        content: `You are a construction contract deadline analyst. Analyse the following document/correspondence and identify actionable deadlines, due dates, and required responses.

CONTRACT CONTEXT:
- Contract form: ${contract.contract_form || 'Standard form'}
- ${contract.party1_role || 'Principal'}: ${party1}
- ${contract.party2_role || 'Contractor'}: ${party2}
- User is: ${userParty}
- Date for Practical Completion: ${pcDate}
- Today's date: ${today}

${contractTerms ? `KEY CONTRACT TERMS (for time-bar reference):\n${contractTerms.slice(0, 40000)}\n` : ''}

DOCUMENT BEING SCANNED (${scanContext}):
${scanText}

ANALYSE FOR:
1. **Response deadlines** - Does this document require a response? What's the timeframe? Is it stated in the letter itself (e.g. "respond within 14 days") or derived from contractual provisions (e.g. Clause 33.1 requires notice within 28 days)?
2. **Variation notices** - Are there variations that need pricing, acceptance, or objection within a timeframe?
3. **EOT/delay** - Are there delay events that trigger notice obligations? When must notices of delay be submitted? Are continuing notices required?
4. **Payment deadlines** - Progress claim dates, payment schedule deadlines, SOPA timeframes
5. **Dispute steps** - If a dispute notice has been issued, what are the next steps and timeframes (negotiation period, mediation, arbitration)?
6. **Practical completion** - Is PC affected? Has it been revised by an EOT?
7. **Defects liability** - Any defects that need rectification within a timeframe?
8. **Time-bars** - Any provisions where failure to act by a deadline results in loss of rights?

IMPORTANT:
- Only create deadlines that are REAL and ACTIONABLE for ${userParty}
- Calculate actual due dates from the document date + contractual timeframe
- If a letter says "respond within 14 days" and is dated 15 March 2026, the due date is 29 March 2026
- If the timeframe comes from a contract clause, reference that clause
- Mark time-bar deadlines as high priority
- Do NOT create deadlines for generic/informational correspondence with no action required
- If the document has no actionable deadlines, return an empty array

Return JSON only, no markdown:
[
  {
    "description": "Concise action required (max 15 words)",
    "clause_reference": "Clause X.X" or null,
    "due_date": "YYYY-MM-DD" or null,
    "notice_type": "Payment Claim|Variation|Delay|EOT Claim|Dispute|Defects|Show Cause|Practical Completion|Other",
    "priority": "high|medium|low",
    "source_detail": "Brief note on where this deadline comes from",
    "is_time_bar": true/false,
    "is_continuing": true/false
  }
]

If no actionable deadlines found, return: []`
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '[]'
    let deadlines: Array<{
      description: string
      clause_reference: string | null
      due_date: string | null
      notice_type: string
      priority: string
      source_detail: string
      is_time_bar: boolean
      is_continuing: boolean
    }> = []

    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        deadlines = JSON.parse(jsonMatch[0])
      }
    } catch (e) {
      console.error('[Deadlines] JSON parse error:', e)
      return Response.json({ success: true, deadlines_created: 0, message: 'No deadlines identified' })
    }

    if (!Array.isArray(deadlines) || deadlines.length === 0) {
      return Response.json({ success: true, deadlines_created: 0, message: 'No actionable deadlines found' })
    }

    // Insert deadlines as obligations
    let created = 0
    for (const d of deadlines) {
      // Skip if no due date and not a continuing obligation
      if (!d.due_date && !d.is_continuing) continue

      // Check for duplicates (same description + due_date for this contract)
      if (d.due_date) {
        const { data: existing } = await admin
          .from('obligations')
          .select('id')
          .eq('contract_id', contract_id)
          .eq('due_date', new Date(d.due_date).toISOString())
          .ilike('description', `%${d.description.slice(0, 30)}%`)
          .limit(1)

        if (existing && existing.length > 0) continue // Skip duplicate
      }

      const status = d.priority === 'high' ? 'urgent' : 'pending'

      const { error } = await admin.from('obligations').insert({
        contract_id,
        user_id: user.id,
        description: d.is_time_bar ? `⚠ TIME-BAR: ${d.description}` : d.description,
        clause_reference: d.clause_reference,
        due_date: d.due_date ? new Date(d.due_date).toISOString() : new Date(Date.now() + 28 * 86400000).toISOString(),
        status,
        notice_type: d.notice_type || 'Other',
        source: 'ai_extracted',
      })

      if (!error) created++
    }

    console.log(`[Deadlines] Scanned ${scanContext}: found ${deadlines.length} deadlines, created ${created}`)

    return Response.json({
      success: true,
      deadlines_found: deadlines.length,
      deadlines_created: created,
      deadlines,
    })
  } catch (error) {
    console.error('[Deadlines] Scan error:', error)
    return Response.json({ error: 'Failed to scan for deadlines' }, { status: 500 })
  }
}
