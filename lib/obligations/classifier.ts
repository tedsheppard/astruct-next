import { createAdminClient } from '@/lib/supabase/admin'
import Anthropic from '@anthropic-ai/sdk'
import { ClassifierInput, ClassifierResult, TriggerEvent, ObligationV2, EventType } from './types'
import { resolveObligations } from './resolver'

const anthropic = new Anthropic()

/**
 * Classify a document or correspondence item to detect trigger events.
 * If trigger events are detected, resolve them against standing obligations
 * to create pending obligations with calculated due dates.
 */
export async function classifyAndResolve(input: ClassifierInput, userId: string): Promise<ClassifierResult> {
  const admin = createAdminClient()

  // Truncate text to reasonable size for classification
  const text = input.text.slice(0, 15000)

  // Load contract details for context
  const { data: contract } = await admin
    .from('contracts')
    .select('contract_form, name, party1_role, party1_name, party2_role, party2_name, user_is_party')
    .eq('id', input.contract_id)
    .single()

  const contractContext = contract
    ? `Contract: ${contract.name}\nForm: ${contract.contract_form}\n${contract.party1_role}: ${contract.party1_name}\n${contract.party2_role}: ${contract.party2_name}\nUser is: ${contract.user_is_party === 'party1' ? contract.party1_role : contract.party2_role}`
    : ''

  // Classify with Claude Haiku
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
    temperature: 0,
    system: `You are an expert construction contract event classifier. Analyse the following document/correspondence and determine if it constitutes a trigger event under the contract.

${contractContext}

Classify the document into one or more of these event types:
- superintendent_direction: A direction or instruction from the superintendent
- principal_direction: A direction from the principal
- delay_event: A notice of delay, weather event, force majeure, or other delaying event
- variation_claim_received: A variation proposal, direction, or claim
- payment_claim_received: A progress claim or payment claim submission
- payment_schedule_received: A payment schedule or payment certificate
- notice_of_dispute: A notice of dispute under the contract
- eot_claim_received: An extension of time claim
- show_cause_notice: A show cause notice under default provisions
- practical_completion_notification: Notice of practical completion
- defects_notification: A defects notice or notification
- none: This document does not constitute a trigger event

For each trigger event detected, extract:
- event_type: one of the types above
- event_date: the date of the event (ISO format YYYY-MM-DD), use the document date if available
- description: what happened (1-2 sentences)
- clause_refs: array of referenced clause numbers (e.g. ["33.1", "34.2"])
- raw_context: the key excerpt from the text that identifies this as a trigger event (max 300 chars)

Respond with a JSON array of trigger events. If no trigger events, respond with an empty array [].
Only classify events that ACTUALLY appear in the text. Do not fabricate.`,
    messages: [{
      role: 'user',
      content: `${input.metadata?.filename ? `Filename: ${input.metadata.filename}\n` : ''}${input.metadata?.from_party ? `From: ${input.metadata.from_party}\n` : ''}${input.metadata?.to_party ? `To: ${input.metadata.to_party}\n` : ''}${input.metadata?.subject ? `Subject: ${input.metadata.subject}\n` : ''}${input.metadata?.date ? `Date: ${input.metadata.date}\n` : ''}\n---\n\n${text}`
    }]
  })

  const responseText = response.content[0].type === 'text' ? response.content[0].text : ''
  const jsonMatch = responseText.match(/\[[\s\S]*\]/)

  if (!jsonMatch) {
    return { trigger_events: [], pending_obligations_created: [] }
  }

  let events: Array<{
    event_type: EventType
    event_date: string
    description: string
    clause_refs: string[]
    raw_context: string
  }>

  try {
    events = JSON.parse(jsonMatch[0])
  } catch {
    return { trigger_events: [], pending_obligations_created: [] }
  }

  // Filter out 'none' events
  events = events.filter(e => e.event_type !== 'none')

  if (events.length === 0) {
    return { trigger_events: [], pending_obligations_created: [] }
  }

  // Insert trigger events
  const triggerInserts = events.map(e => ({
    contract_id: input.contract_id,
    user_id: userId,
    source_type: input.source_type,
    source_id: input.source_id,
    source_name: input.metadata?.filename || input.metadata?.subject || null,
    event_type: e.event_type,
    event_date: e.event_date || new Date().toISOString(),
    description: e.description,
    raw_context: e.raw_context,
    clause_refs: e.clause_refs || [],
  }))

  const { data: insertedEvents, error: evError } = await admin
    .from('trigger_events')
    .insert(triggerInserts)
    .select()

  if (evError || !insertedEvents) {
    console.error('Failed to insert trigger events:', evError)
    return { trigger_events: [], pending_obligations_created: [] }
  }

  // Resolve: match trigger events to standing obligations and create pending obligations
  const pendingObligations = await resolveObligations(
    input.contract_id,
    userId,
    insertedEvents as TriggerEvent[]
  )

  return {
    trigger_events: insertedEvents as TriggerEvent[],
    pending_obligations_created: pendingObligations
  }
}
