import { createClient } from '@supabase/supabase-js'

/**
 * Usage / plan helpers.
 *
 * Pricing model post anon-first launch is project-based:
 *  - free  → 1 project, full features, forever
 *  - paid  → multi-project (Professional / Professional Max — checkout TBD)
 *
 * The legacy 'trial' / 'trial_expired' tier values still exist on some rows
 * (created between migration 016 and the anon-first cutover). They are
 * treated as 'free' for entitlement decisions — the migration will tidy
 * them up but nothing here breaks if some linger.
 */

export const FREE_PROJECT_LIMIT = 1

// Anon-only soft limits (enforced separately by the anon hard-wall).
export const ANON_MESSAGE_LIMIT = 50
export const ANON_UPLOAD_LIMIT_BYTES = 50 * 1024 * 1024

// Legacy exports retained so old call-sites compile during cutover.
// They are no longer the authoritative limit for free-tier users.
export const TRIAL_QUERY_LIMIT = 50
export const TRIAL_CONTRACT_LIMIT = FREE_PROJECT_LIMIT
export const TRIAL_DURATION_DAYS = 14

const admin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export interface UserPlan {
  tier: 'free' | 'paid' | string
  isPaid: boolean
  isAnonymous: boolean
  projectsCreated: number
  projectLimit: number
  canCreateProject: boolean
  messagesSent: number
  bytesUploaded: number
  // Legacy fields kept for backwards compatibility (UsageMeter, /api/usage)
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
  const sb = admin()
  const { data: profile } = await sb
    .from('profiles')
    .select('subscription_tier, is_anonymous, messages_sent, bytes_uploaded, trial_queries_used, trial_contracts_created, trial_ends_at')
    .eq('id', userId)
    .maybeSingle()

  // Count actual contracts owned by the user — authoritative.
  const { count: projectsCreated } = await sb
    .from('contracts')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  const rawTier = profile?.subscription_tier || 'free'
  // Map legacy values to the new vocabulary for entitlement checks.
  const tier =
    rawTier === 'paid' || rawTier === 'paid_past_due'
      ? 'paid'
      : 'free'
  const isPaid = tier === 'paid'
  const isAnonymous = profile?.is_anonymous === true
  const totalProjects = projectsCreated || 0
  const projectLimit = isPaid ? Infinity : FREE_PROJECT_LIMIT
  const canCreateProject = isPaid || totalProjects < projectLimit

  return {
    tier,
    isPaid,
    isAnonymous,
    projectsCreated: totalProjects,
    projectLimit,
    canCreateProject,
    messagesSent: profile?.messages_sent || 0,
    bytesUploaded: profile?.bytes_uploaded || 0,
    // Legacy compatibility — the UsageMeter still reads these.
    trialQueriesUsed: profile?.trial_queries_used || 0,
    trialContractsCreated: profile?.trial_contracts_created || 0,
    trialEndsAt: profile?.trial_ends_at || null,
    trialDaysLeft: 0,
    queryLimitReached: false,
    contractLimitReached: !canCreateProject,
    trialExpired: false,
    canQuery: true,
    canCreateContract: canCreateProject,
  }
}

export async function incrementQueryCount(userId: string): Promise<void> {
  const sb = admin()
  const { data } = await sb.from('profiles').select('messages_sent').eq('id', userId).maybeSingle()
  const current = (data?.messages_sent || 0) + 1
  await sb.from('profiles').update({ messages_sent: current, last_active_at: new Date().toISOString() }).eq('id', userId)
}

export async function incrementContractCount(_userId: string): Promise<void> {
  // No-op under the new model — project count is read from the contracts
  // table directly. Kept for source compatibility.
  void _userId
}
