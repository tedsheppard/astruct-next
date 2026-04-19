import { createClient } from '@supabase/supabase-js'

// Trial limits
export const TRIAL_QUERY_LIMIT = 50
export const TRIAL_CONTRACT_LIMIT = 1
export const TRIAL_DURATION_DAYS = 14

const admin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface UserPlan {
  tier: string
  trialQueriesUsed: number
  trialContractsCreated: number
  trialEndsAt: string | null
  trialDaysLeft: number
  queryLimitReached: boolean
  contractLimitReached: boolean
  trialExpired: boolean
  canQuery: boolean
  canCreateContract: boolean
}

export async function getUserPlan(userId: string): Promise<UserPlan> {
  const { data: profile } = await admin()
    .from('profiles')
    .select('subscription_tier, trial_queries_used, trial_contracts_created, trial_ends_at')
    .eq('id', userId)
    .single()

  if (!profile) {
    return {
      tier: 'trial', trialQueriesUsed: 0, trialContractsCreated: 0,
      trialEndsAt: null, trialDaysLeft: 0, queryLimitReached: false,
      contractLimitReached: false, trialExpired: true, canQuery: false, canCreateContract: false,
    }
  }

  const tier = profile.subscription_tier || 'trial'
  const isPaid = tier === 'paid'
  const trialEndsAt = profile.trial_ends_at
  const trialDaysLeft = trialEndsAt ? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86400000)) : 0
  const trialExpired = !isPaid && trialDaysLeft <= 0
  const queryLimitReached = !isPaid && (profile.trial_queries_used || 0) >= TRIAL_QUERY_LIMIT
  const contractLimitReached = !isPaid && (profile.trial_contracts_created || 0) >= TRIAL_CONTRACT_LIMIT

  return {
    tier,
    trialQueriesUsed: profile.trial_queries_used || 0,
    trialContractsCreated: profile.trial_contracts_created || 0,
    trialEndsAt,
    trialDaysLeft,
    queryLimitReached,
    contractLimitReached,
    trialExpired: trialExpired && tier !== 'paid',
    canQuery: isPaid || (!trialExpired && !queryLimitReached),
    canCreateContract: isPaid || (!trialExpired && !contractLimitReached),
  }
}

export async function incrementQueryCount(userId: string): Promise<void> {
  const { data } = await admin().from('profiles').select('trial_queries_used').eq('id', userId).single()
  const current = (data as { trial_queries_used: number } | null)?.trial_queries_used || 0
  await admin().from('profiles').update({ trial_queries_used: current + 1 }).eq('id', userId)
}

export async function incrementContractCount(userId: string): Promise<void> {
  const { data } = await admin().from('profiles').select('trial_contracts_created').eq('id', userId).single()
  await admin().from('profiles').update({ trial_contracts_created: ((data as { trial_contracts_created: number } | null)?.trial_contracts_created || 0) + 1 }).eq('id', userId)
}
