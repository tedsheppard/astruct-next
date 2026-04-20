import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { classifyAndResolve } from '@/lib/obligations/classifier'
import { extractStaticObligations } from '@/lib/obligations/extractor'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { contract_id, document_id, correspondence_id, trigger } = body

    if (!contract_id) {
      return Response.json(
        { error: 'contract_id is required' },
        { status: 400 }
      )
    }

    if (!trigger || !['upload', 'correspondence', 'manual'].includes(trigger)) {
      return Response.json(
        { error: 'trigger must be one of: upload, correspondence, manual' },
        { status: 400 }
      )
    }

    const admin = createAdminClient()
    let deadlinesCreated = 0
    let triggerEventsCreated = 0

    if (trigger === 'upload') {
      // Load document text and classify it as a trigger event
      if (!document_id) {
        return Response.json(
          { error: 'document_id is required for upload trigger' },
          { status: 400 }
        )
      }

      const { data: doc } = await admin
        .from('documents')
        .select('id, filename, extracted_text, category')
        .eq('id', document_id)
        .single()

      if (!doc?.extracted_text) {
        return Response.json({
          deadlines_created: 0,
          trigger_events: 0,
          message: 'No text to scan',
        })
      }

      const result = await classifyAndResolve(
        {
          contract_id,
          source_type: 'document',
          source_id: document_id,
          text: doc.extracted_text,
          metadata: {
            filename: doc.filename,
          },
        },
        user.id
      )

      triggerEventsCreated = result.trigger_events.length
      deadlinesCreated = result.pending_obligations_created.length

    } else if (trigger === 'correspondence') {
      // Load correspondence text + metadata and classify
      if (!correspondence_id) {
        return Response.json(
          { error: 'correspondence_id is required for correspondence trigger' },
          { status: 400 }
        )
      }

      const { data: corr } = await admin
        .from('correspondence')
        .select('id, subject, content, from_party, to_party, category, date_received, clause_tags')
        .eq('id', correspondence_id)
        .single()

      if (!corr) {
        return Response.json({ error: 'Correspondence not found' }, { status: 404 })
      }

      const corrText = [
        corr.subject ? `Subject: ${corr.subject}` : '',
        corr.content || '',
      ].filter(Boolean).join('\n\n')

      const result = await classifyAndResolve(
        {
          contract_id,
          source_type: 'correspondence',
          source_id: correspondence_id,
          text: corrText,
          metadata: {
            subject: corr.subject || undefined,
            from_party: corr.from_party || undefined,
            to_party: corr.to_party || undefined,
            date: corr.date_received || undefined,
          },
        },
        user.id
      )

      triggerEventsCreated = result.trigger_events.length
      deadlinesCreated = result.pending_obligations_created.length

    } else if (trigger === 'manual') {
      // Full contract extraction of standing obligations
      const result = await extractStaticObligations(contract_id, user.id)

      deadlinesCreated = result.created
      triggerEventsCreated = 0
    }

    console.log(`[Deadlines] Scan complete (trigger=${trigger}): ${deadlinesCreated} deadlines, ${triggerEventsCreated} trigger events`)

    return Response.json({
      deadlines_created: deadlinesCreated,
      trigger_events: triggerEventsCreated,
    })
  } catch (err) {
    console.error('POST /api/deadlines/scan error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
