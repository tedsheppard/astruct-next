import { createAdminClient } from '@/lib/supabase/admin'
import { INCLUDED_TOKENS_PER_CONTRACT } from '@/lib/stripe'

export interface TokenEvent {
  userId: string
  contractId: string | null
  messageId?: string | null
  inputTokens: number
  outputTokens: number
  model: string
  feature: string
}

/**
 * Record a single AI call's token usage. Fire-and-forget by design — token
 * accounting must never block the response back to the user.
 */
export function recordTokenEvent(evt: TokenEvent): void {
  if (!evt.userId) return
  if (evt.inputTokens <= 0 && evt.outputTokens <= 0) return
  const admin = createAdminClient()
  admin
    .from('token_events')
    .insert({
      user_id: evt.userId,
      contract_id: evt.contractId,
      message_id: evt.messageId || null,
      input_tokens: Math.max(0, Math.round(evt.inputTokens)),
      output_tokens: Math.max(0, Math.round(evt.outputTokens)),
      model: evt.model,
      feature: evt.feature,
    })
    .then(({ error }) => {
      if (error) console.error('[tokens] insert failed', error)
    })
}

export interface CurrentUsage {
  includedTokens: number
  usedTokens: number
  overageTokens: number
  overageCents: number
  pctOfIncluded: number
  periodStart: Date | null
  periodEnd: Date | null
  contractQuantity: number
  capCents: number
  hasSubscription: boolean
}

/**
 * Aggregate the user's token usage in the current billing cycle. Used by
 * the billing UI and by the overage-cap middleware.
 */
export async function getCurrentUsage(userId: string): Promise<CurrentUsage> {
  const admin = createAdminClient()

  const { data: sub } = await admin
    .from('subscriptions')
    .select('contract_quantity, current_period_start, current_period_end, overage_cap_cents, status')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Free / no-sub users get one contract's allowance and a period that's
  // calendar-month based (so the in-app counter still does something useful).
  const now = new Date()
  const fallbackStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const fallbackEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const isActive = sub && sub.status === 'active'
  const contractQuantity = isActive ? (sub.contract_quantity || 1) : 1
  const periodStart = isActive && sub.current_period_start ? new Date(sub.current_period_start) : fallbackStart
  const periodEnd = isActive && sub.current_period_end ? new Date(sub.current_period_end) : fallbackEnd
  const includedTokens = contractQuantity * INCLUDED_TOKENS_PER_CONTRACT

  // Sum tokens since period start
  const { data: rows } = await admin
    .from('token_events')
    .select('input_tokens, output_tokens')
    .eq('user_id', userId)
    .gte('created_at', periodStart.toISOString())

  let used = 0
  for (const r of rows || []) {
    used += (r.input_tokens || 0) + (r.output_tokens || 0)
  }

  const overageTokens = Math.max(0, used - includedTokens)
  // $0.10 per 10,000 tokens, rounded up per 10k unit
  const overageUnits = Math.ceil(overageTokens / 10000)
  const overageCents = overageUnits * 10

  return {
    includedTokens,
    usedTokens: used,
    overageTokens,
    overageCents,
    pctOfIncluded: includedTokens > 0 ? Math.min(100, Math.round((used / includedTokens) * 100)) : 0,
    periodStart,
    periodEnd,
    contractQuantity,
    capCents: sub?.overage_cap_cents ?? 20000,
    hasSubscription: !!isActive,
  }
}

/**
 * Quick gate before starting an AI call. Returns null if the call is allowed
 * to proceed, or an object describing why it's blocked.
 *
 * Conservative: assumes ~1500 output tokens worst case so a long stream can't
 * blow past the cap mid-generation.
 */
export async function checkOverageCap(
  userId: string,
  estimatedInputTokens: number,
): Promise<{ blocked: boolean; reason?: string; capCents?: number; usedCents?: number }> {
  const usage = await getCurrentUsage(userId)
  if (!usage.hasSubscription) {
    // Free tier: use the existing message-count gate, not the token cap.
    return { blocked: false }
  }
  const projectedTokens = usage.usedTokens + estimatedInputTokens + 1500
  if (projectedTokens <= usage.includedTokens) {
    return { blocked: false }
  }
  const projectedOverageTokens = projectedTokens - usage.includedTokens
  const projectedOverageCents = Math.ceil(projectedOverageTokens / 10000) * 10
  if (projectedOverageCents > usage.capCents) {
    return {
      blocked: true,
      reason: 'overage_cap_reached',
      capCents: usage.capCents,
      usedCents: usage.overageCents,
    }
  }
  return { blocked: false }
}
