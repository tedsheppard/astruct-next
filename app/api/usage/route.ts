import { createClient } from '@/lib/supabase/server'
import { getUserPlan, TRIAL_QUERY_LIMIT, TRIAL_CONTRACT_LIMIT } from '@/lib/usage'

export const dynamic = 'force-dynamic'

// GET /api/usage — returns current user's plan + usage
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const plan = await getUserPlan(user.id)

    return Response.json({
      ...plan,
      queryLimit: TRIAL_QUERY_LIMIT,
      contractLimit: TRIAL_CONTRACT_LIMIT,
    })
  } catch {
    return Response.json({ error: 'Failed to fetch usage' }, { status: 500 })
  }
}
