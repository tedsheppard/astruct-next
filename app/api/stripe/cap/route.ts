import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

const ALLOWED_CAPS = [5000, 10000, 20000, 50000, null] // $50 / $100 / $200 / $500 / unlimited

/**
 * POST /api/stripe/cap
 * Body: { cap_cents: number | null }
 * Updates the overage cap for the current user's subscription.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.is_anonymous) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { cap_cents?: number | null } = {}
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const cap = body.cap_cents === null ? null : Number(body.cap_cents)
  if (cap !== null && !ALLOWED_CAPS.includes(cap)) {
    return Response.json({ error: 'Invalid cap value' }, { status: 400 })
  }

  const admin = createAdminClient()
  await admin
    .from('subscriptions')
    .update({ overage_cap_cents: cap, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)

  return Response.json({ ok: true, cap_cents: cap })
}
