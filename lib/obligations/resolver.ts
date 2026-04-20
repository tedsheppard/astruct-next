import { createAdminClient } from '@/lib/supabase/admin'
import { TriggerEvent, ObligationV2 } from './types'

/**
 * Maps event types to the obligation types they trigger.
 * A superintendent_direction might trigger a 'notice' or 'response' obligation.
 */
const EVENT_TO_OBLIGATION_MAP: Record<string, string[]> = {
  superintendent_direction: ['response', 'notice', 'submission'],
  principal_direction: ['response', 'notice'],
  delay_event: ['notice', 'claim'],
  variation_claim_received: ['response', 'assessment', 'notice'],
  payment_claim_received: ['assessment', 'certification', 'payment', 'response'],
  payment_schedule_received: ['response', 'payment'],
  notice_of_dispute: ['response', 'notice'],
  eot_claim_received: ['assessment', 'response'],
  show_cause_notice: ['response'],
  practical_completion_notification: ['assessment', 'certification', 'notice'],
  defects_notification: ['response', 'notice'],
}

/**
 * Resolve trigger events against standing obligations.
 * For each trigger event, find matching standing obligations and create
 * pending obligations with calculated due dates.
 */
export async function resolveObligations(
  contractId: string,
  userId: string,
  events: TriggerEvent[]
): Promise<ObligationV2[]> {
  const admin = createAdminClient()
  const created: ObligationV2[] = []

  // Load all standing obligations for this contract
  const { data: standingObligations } = await admin
    .from('obligations')
    .select('*')
    .eq('contract_id', contractId)
    .eq('obligation_class', 'standing')

  if (!standingObligations || standingObligations.length === 0) {
    return created
  }

  for (const event of events) {
    const matchingTypes = EVENT_TO_OBLIGATION_MAP[event.event_type || ''] || []

    // Find standing obligations that match this event type
    const matches = standingObligations.filter(ob => {
      // Match by obligation type
      const typeMatch = matchingTypes.some(t => {
        const noticeType = ob.notice_type?.toLowerCase() || ''
        const desc = ob.description?.toLowerCase() || ''
        return desc.includes(t) || noticeType.includes(t)
      })

      // Also match by clause reference if the event references specific clauses
      const clauseMatch = event.clause_refs?.some(ref =>
        ob.clause_reference?.includes(ref)
      )

      return typeMatch || clauseMatch
    })

    // Create pending obligations for each match
    for (const standing of matches) {
      // Calculate due date
      const eventDate = new Date(event.event_date)
      const daysToAdd = standing.time_period_days || 28 // Default 28 days if not specified
      const dueDate = new Date(eventDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000)

      // Skip weekends for due date
      const dow = dueDate.getDay()
      if (dow === 0) dueDate.setDate(dueDate.getDate() + 1)
      if (dow === 6) dueDate.setDate(dueDate.getDate() + 2)

      // Check for duplicate: same clause_reference + similar due_date
      const existingCheck = await admin
        .from('obligations')
        .select('id')
        .eq('contract_id', contractId)
        .eq('clause_reference', standing.clause_reference)
        .eq('obligation_class', 'pending')
        .gte('due_date', new Date(dueDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString())
        .lte('due_date', new Date(dueDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString())
        .limit(1)

      if (existingCheck.data && existingCheck.data.length > 0) continue

      const pendingOb = {
        contract_id: contractId,
        user_id: userId,
        description: standing.description,
        clause_reference: standing.clause_reference,
        due_date: dueDate.toISOString(),
        status: 'pending',
        notice_type: standing.notice_type,
        completed: false,
        source: 'ai_extracted',
        obligation_class: 'pending' as const,
        trigger_event_id: event.id,
        time_period_text: standing.time_period_text,
        time_period_days: standing.time_period_days,
        consequence: standing.consequence,
        party_responsible: standing.party_responsible,
        clause_text_snippet: standing.clause_text_snippet,
        document_id: standing.document_id,
        explanation: standing.explanation
          ? `${standing.explanation}\n\nTriggered by: ${event.description || event.event_type} on ${new Date(event.event_date).toLocaleDateString('en-AU')}`
          : `Triggered by: ${event.description || event.event_type} on ${new Date(event.event_date).toLocaleDateString('en-AU')}`,
        confidence: 0.85,
      }

      const { data: inserted, error } = await admin
        .from('obligations')
        .insert(pendingOb)
        .select()
        .single()

      if (inserted && !error) {
        created.push(inserted as ObligationV2)
      }
    }
  }

  return created
}
