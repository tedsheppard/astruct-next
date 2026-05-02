import { type NextRequest } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStripe, STRIPE_WEBHOOK_SECRET, isStripeConfigured } from '@/lib/stripe'
import {
  sendSubscriptionStarted,
  sendPaymentFailed,
  sendCancellationConfirmed,
} from '@/lib/email'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * POST /api/stripe/webhook
 * Idempotent: every evt_* id is recorded in stripe_events on first sight.
 * Stripe retries on 5xx for up to 3 days; we MUST stay idempotent.
 */
export async function POST(request: NextRequest) {
  if (!isStripeConfigured() || !STRIPE_WEBHOOK_SECRET) {
    return Response.json({ error: 'Billing not configured' }, { status: 503 })
  }

  const sig = request.headers.get('stripe-signature')
  if (!sig) return Response.json({ error: 'Missing signature' }, { status: 400 })

  const stripe = getStripe()
  const raw = await request.text()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(raw, sig, STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('[stripe/webhook] signature verification failed:', err)
    return Response.json({ error: 'Bad signature' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Idempotency: bail if we've already processed this event.
  const { data: seen } = await admin
    .from('stripe_events')
    .select('id')
    .eq('id', event.id)
    .maybeSingle()
  if (seen) {
    console.log(`[stripe/webhook] duplicate ${event.id} (${event.type}) — skipping`)
    return Response.json({ received: true, duplicate: true })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, admin, stripe)
        break
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await upsertSubscription(event.data.object as Stripe.Subscription, admin)
        break
      case 'customer.subscription.deleted':
        await markSubscriptionCanceled(event.data.object as Stripe.Subscription, admin)
        break
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice, admin)
        break
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice, admin)
        break
      case 'customer.updated':
        // Future: sync name/email if changed in portal
        break
      default:
        console.log(`[stripe/webhook] unhandled event type: ${event.type}`)
    }

    await admin.from('stripe_events').insert({
      id: event.id,
      type: event.type,
      payload: event as unknown as Record<string, unknown>,
    })

    return Response.json({ received: true })
  } catch (err) {
    console.error(`[stripe/webhook] handler failed for ${event.type}:`, err)
    // Return 500 so Stripe retries.
    return Response.json({ error: 'handler failed' }, { status: 500 })
  }
}

// ─── Handlers ───────────────────────────────────────────────────────────

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  admin: ReturnType<typeof createAdminClient>,
  stripe: Stripe,
) {
  const userId = session.metadata?.supabase_user_id
  if (!userId) {
    console.error('[stripe/webhook] checkout.session.completed missing supabase_user_id')
    return
  }
  if (!session.subscription || typeof session.subscription !== 'string') {
    console.error('[stripe/webhook] checkout session has no subscription id')
    return
  }
  // Pull the subscription with its items expanded
  const subscription = await stripe.subscriptions.retrieve(session.subscription, {
    expand: ['items.data.price'],
  })
  await upsertSubscription(subscription, admin, { initialUserId: userId })

  // Email: subscription started
  if (session.customer_details?.email) {
    sendSubscriptionStarted({
      to: session.customer_details.email,
      name: session.customer_details.name || null,
      contractQuantity: subscription.items.data.find(
        i => (i.price as Stripe.Price).recurring?.usage_type !== 'metered',
      )?.quantity || 1,
    }).catch(e => console.error('[stripe/webhook] sendSubscriptionStarted failed', e))
  }
}

async function upsertSubscription(
  subscription: Stripe.Subscription,
  admin: ReturnType<typeof createAdminClient>,
  opts: { initialUserId?: string } = {},
) {
  const userId =
    opts.initialUserId
    || subscription.metadata?.supabase_user_id
    || (await resolveUserIdByCustomer(subscription.customer as string, admin))

  if (!userId) {
    console.error('[stripe/webhook] cannot resolve supabase_user_id for', subscription.id)
    return
  }

  // Identify which subscription_item is the per-seat base vs the metered overage
  let baseItem: Stripe.SubscriptionItem | null = null
  let overageItem: Stripe.SubscriptionItem | null = null
  for (const item of subscription.items.data) {
    const price = item.price as Stripe.Price
    if (price.recurring?.usage_type === 'metered') overageItem = item
    else baseItem = item
  }

  const subAny = subscription as unknown as Record<string, number | undefined>
  const periodStart = subAny.current_period_start
  const periodEnd = subAny.current_period_end

  const row = {
    user_id: userId,
    stripe_customer_id: subscription.customer as string,
    stripe_subscription_id: subscription.id,
    stripe_base_item_id: baseItem?.id || null,
    stripe_overage_item_id: overageItem?.id || null,
    status: subscription.status,
    contract_quantity: baseItem?.quantity || 1,
    current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    cancel_at_period_end: subscription.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  }

  // Upsert by stripe_subscription_id
  const { error } = await admin.from('subscriptions').upsert(row, { onConflict: 'stripe_subscription_id' })
  if (error) {
    console.error('[stripe/webhook] subscription upsert failed', error)
    throw error
  }
}

async function markSubscriptionCanceled(
  subscription: Stripe.Subscription,
  admin: ReturnType<typeof createAdminClient>,
) {
  const { data: row } = await admin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .maybeSingle()

  await admin
    .from('subscriptions')
    .update({ status: 'canceled', updated_at: new Date().toISOString() })
    .eq('stripe_subscription_id', subscription.id)

  if (row?.user_id) {
    const admin2 = createAdminClient()
    const { data: prof } = await admin2.from('profiles').select('email, name').eq('id', row.user_id).single()
    if (prof?.email) {
      const subAny = subscription as unknown as { current_period_end?: number }
      const endsOn = subAny.current_period_end ? new Date(subAny.current_period_end * 1000) : null
      sendCancellationConfirmed({ to: prof.email, name: prof.name || null, endsOn })
        .catch(e => console.error('[stripe/webhook] sendCancellationConfirmed failed', e))
    }
  }
}

async function handlePaymentSucceeded(
  invoice: Stripe.Invoice,
  admin: ReturnType<typeof createAdminClient>,
) {
  const subId = (invoice as unknown as { subscription?: string }).subscription
  if (!subId) return
  await admin
    .from('subscriptions')
    .update({ status: 'active', updated_at: new Date().toISOString() })
    .eq('stripe_subscription_id', subId)
}

async function handlePaymentFailed(
  invoice: Stripe.Invoice,
  admin: ReturnType<typeof createAdminClient>,
) {
  const subId = (invoice as unknown as { subscription?: string }).subscription
  if (!subId) return
  await admin
    .from('subscriptions')
    .update({ status: 'past_due', updated_at: new Date().toISOString() })
    .eq('stripe_subscription_id', subId)

  if (invoice.customer_email) {
    sendPaymentFailed({
      to: invoice.customer_email,
      amountDueCents: invoice.amount_due,
      hostedInvoiceUrl: invoice.hosted_invoice_url || null,
    }).catch(e => console.error('[stripe/webhook] sendPaymentFailed failed', e))
  }
}

async function resolveUserIdByCustomer(
  customerId: string,
  admin: ReturnType<typeof createAdminClient>,
): Promise<string | null> {
  const { data } = await admin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .maybeSingle()
  return data?.user_id || null
}
