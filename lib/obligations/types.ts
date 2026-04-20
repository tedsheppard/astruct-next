export interface ObligationClausePrior {
  id: string
  contract_form: string
  clause_number: string
  clause_title: string | null
  obligation_type: string | null
  time_period_days: number | null
  time_period_text: string | null
  trigger_description: string | null
  party_responsible: string | null
  consequence: string | null
  is_time_bar: boolean
}

export interface TriggerEvent {
  id: string
  contract_id: string
  user_id: string
  source_type: 'document' | 'correspondence' | 'integration_sync' | 'manual'
  source_id: string | null
  source_name: string | null
  event_type: string | null
  event_date: string
  description: string | null
  raw_context: string | null
  clause_refs: string[] | null
  created_at: string
}

export interface ObligationV2 {
  id: string
  contract_id: string
  user_id: string
  description: string
  clause_reference: string | null
  due_date: string
  status: string
  notice_type: string | null
  completed: boolean
  source: string
  obligation_class: 'standing' | 'pending' | 'completed' | 'expired' | 'voided'
  trigger_event_id: string | null
  time_period_text: string | null
  time_period_days: number | null
  consequence: string | null
  party_responsible: string | null
  clause_text_snippet: string | null
  document_id: string | null
  explanation: string | null
  confidence: number
  created_at: string
  updated_at: string
}

export interface ExtractedObligation {
  clause_ref: string
  obligation_type: string
  trigger_description: string
  time_period_text: string
  time_period_days: number | null
  party_responsible: string
  consequence: string
  is_time_bar: boolean
  clause_text_snippet: string
}

export interface ClassifierResult {
  trigger_events: TriggerEvent[]
  pending_obligations_created: ObligationV2[]
}

export interface ClassifierInput {
  contract_id: string
  source_type: 'document' | 'correspondence' | 'integration_sync' | 'manual'
  source_id: string
  text: string
  metadata?: {
    filename?: string
    date?: string
    from_party?: string
    to_party?: string
    subject?: string
  }
}

export type EventType =
  | 'superintendent_direction'
  | 'principal_direction'
  | 'delay_event'
  | 'variation_claim_received'
  | 'payment_claim_received'
  | 'payment_schedule_received'
  | 'notice_of_dispute'
  | 'eot_claim_received'
  | 'show_cause_notice'
  | 'practical_completion_notification'
  | 'defects_notification'
  | 'none'
