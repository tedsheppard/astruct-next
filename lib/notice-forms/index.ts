/**
 * Notice form clause priors — shared shape for obligation extraction and notice template generation.
 *
 * This module provides the contract form → clause mapping used by:
 * - lib/obligations/extractor.ts (obligation extraction)
 * - Notice template generation (Prompt 5)
 *
 * The actual clause data lives in the obligation_clause_priors table (seeded in migration 017).
 * This module provides TypeScript types and helper functions for working with that data.
 */

export interface ClausePrior {
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

/** Supported contract forms with their display names */
export const CONTRACT_FORMS: Record<string, string> = {
  'AS4000-1997': 'AS 4000 – 1997 General Conditions of Contract',
  'AS4000-2025': 'AS 4000 – 2025 General Conditions of Contract',
  'AS4902-2000': 'AS 4902 – 2000 Design and Construct Contract',
  'AS2124-1992': 'AS 2124 – 1992 General Conditions of Contract',
  'AS4901-1998': 'AS 4901 – 1998 General Conditions of Subcontract',
  'AS4903-2000': 'AS 4903 – 2000 Design and Construct Subcontract',
}

/** Map notice types to their obligations */
export const NOTICE_TYPES = [
  'Payment Claim',
  'Variation',
  'Delay',
  'EOT Claim',
  'Dispute',
  'Show Cause',
  'Defects',
  'Practical Completion',
  'Other',
] as const

export type NoticeType = typeof NOTICE_TYPES[number]
