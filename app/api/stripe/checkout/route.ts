import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  getStripe,
  STRIPE_PRICE_BASE,
  STRIPE_PRICE_OVERAGE,
  isStripeConfigured,
} from '@/lib/stripe'

export const dynamic = 'force-dynamic'

/**
 * POST /api/stripe/checkout
 * Body: { contract_quantity?: number }
 * Returns: { url } to redirect the browser to.
 *
 * - Anon users are blocked — they must sign up first via the hard wall.
 * - Reuses an existing Stripe customer if we already have one for this user.
 * - Creates a subscription with two items: per-seat base + metered overage.
 */
export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return Response.json(
      { error: 'Billing is not configured on this environment.' },
      { status: 503 },
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.is_anonymous) {
    return Response.json(
      { error: 'Sign up first before adding paid contracts.' },
      { status: 403 },
    )
  }

  let body: Record<string, unknown> = {}
  try {
    body = await request.json()
  } catch {
    // empty body is fine — defaults to quantity 1
  }
  const quantity = Math.max(1, Math.min(50, Number(body.contract_quantity) || 1))

  const stripe = getStripe()
  const admin = createAdminClient()

  // Look up an existing subscription row (and its Stripe customer) for this user.
  const { data: existingSub } = await admin
    .from('subscriptions')
    .select('stripe_customer_id, stripe_subscription_id, status')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  let customerId = existingSub?.stripe_customer_id || null

  // If they already have an active subscription, send them to the portal to
  // change quantity instead of double-billing them via a fresh checkout.
  if (existingSub?.stripe_subscription_id && existingSub.status === 'active') {
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId!,
      return_url: `${getOrigin(request)}/settings/billing`,
    })
    return Response.json({ url: portal.url, mode: 'portal' })
  }

  if (!customerId) {
    // Try to find by email first (in case the user upgraded then re-signed up)
    const search = await stripe.customers.search({
      query: `metadata['supabase_user_id']:'${user.id}'`,
      limit: 1,
    })
    if (search.data.length > 0) {
      customerId = search.data[0].id
    } else {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [
      { price: STRIPE_PRICE_BASE, quantity },
      { price: STRIPE_PRICE_OVERAGE }, // metered — no quantity
    ],
    automatic_tax: { enabled: true },
    customer_update: { name: 'auto', address: 'auto' },
    tax_id_collection: { enabled: true },
    allow_promotion_codes: true,
    subscription_data: {
      metadata: { supabase_user_id: user.id },
    },
    metadata: { supabase_user_id: user.id, contract_quantity: String(quantity) },
    success_url: `${getOrigin(request)}/settings/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${getOrigin(request)}/settings/billing?checkout=cancel`,
  })

  return Response.json({ url: session.url })
}

function getOrigin(request: NextRequest): string {
  return process.env.NEXT_PUBLIC_APP_ORIGIN
    || `${request.nextUrl.protocol}//${request.nextUrl.host}`
}
