import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStripe, isStripeConfigured } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

/**
 * POST /api/stripe/portal
 * Returns: { url } — Stripe-hosted customer portal session.
 */
export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return Response.json({ error: 'Billing not configured' }, { status: 503 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.is_anonymous) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { data: sub } = await admin
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!sub?.stripe_customer_id) {
    return Response.json(
      { error: 'No billing account yet — start a checkout first.' },
      { status: 404 },
    )
  }

  const stripe = getStripe()
  const origin = process.env.NEXT_PUBLIC_APP_ORIGIN
    || `${request.nextUrl.protocol}//${request.nextUrl.host}`
  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${origin}/settings/billing`,
  })

  return Response.json({ url: session.url })
}
