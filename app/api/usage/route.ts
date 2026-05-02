import { createClient } from '@/lib/supabase/server'
import { getUserPlan, TRIAL_QUERY_LIMIT, TRIAL_CONTRACT_LIMIT } from '@/lib/usage'
import { getCurrentUsage } from '@/lib/tokens'

export const dynamic = 'force-dynamic'

// GET /api/usage — returns current user's plan + token usage / overage state
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const [plan, tokens] = await Promise.all([
      getUserPlan(user.id),
      getCurrentUsage(user.id),
    ])

    return Response.json({
      ...plan,
      queryLimit: TRIAL_QUERY_LIMIT,
      contractLimit: TRIAL_CONTRACT_LIMIT,
      tokens,
    })
  } catch (err) {
    console.error('[usage]', err)
    return Response.json({ error: 'Failed to fetch usage' }, { status: 500 })
  }
}
