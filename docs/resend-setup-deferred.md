# Resend setup — deferred for v1 launch

**Status:** Deferred. The product ships without it. Stripe handles its own
receipts and payment confirmations, so the customer experience is intact.
Pick this up post-launch when you want to tighten the dunning loop or when
the first paying customer's card declines and you want them to get a
helpful email instead of just a Stripe-branded one.

---

## What's already wired (just needs the API key)

`lib/email.ts` exports five transactional senders. They all gracefully
no-op without `RESEND_API_KEY` — every call logs `[email] RESEND_API_KEY
missing — would have sent to <X>: <subject>` to the server log and returns
`{ skipped: true }`. So the rest of the app keeps working.

| Function | Trigger site | What it sends |
|---|---|---|
| `sendWelcome` | not yet wired (post-signup webhook hook) | "Welcome to Astruct, three things to try first" |
| `sendSubscriptionStarted` | `app/api/stripe/webhook/route.ts` `handleCheckoutCompleted` | "You're on Pro Contract with N active contracts" |
| `sendPaymentFailed` | `app/api/stripe/webhook/route.ts` `handlePaymentFailed` | "Your latest payment of $X didn't go through. Update your card." |
| `sendCancellationConfirmed` | `app/api/stripe/webhook/route.ts` `markSubscriptionCanceled` | "Your subscription will end on {date}" |
| `sendUsageThreshold` | not yet wired (cron / threshold checker) | 80% or 100% of included token allowance reached |

The webhook calls (3 of the 5) start firing the moment the API key is set.
The other two need a tiny bit of additional wiring (see "Wire the
remaining triggers" below).

---

## Setup, when you come back to it

### Step 1 — sign up + get a key
- Sign up at https://resend.com (free tier: 3,000 emails/month, 100/day —
  enough for the first 50–100 paying customers)
- Dashboard → API Keys → "Create API Key" → name it `astruct-prod`,
  permission `Sending access`
- Copy the `re_…` value

### Step 2 — verify the sending domain (DNS)
- Dashboard → Domains → "Add Domain" → `astruct.io`
- Resend will show 3 DNS records to add (1× SPF, 2× DKIM `resend._domainkey…`)
- Add them at your DNS provider (Cloudflare / Vercel DNS / wherever
  `astruct.io` is hosted). TTL: default.
- Wait ~10 min for verification. Resend will flip the domain to "Verified"
  automatically.
- Once verified, the from-address `Astruct <hello@astruct.io>` (or any
  `*@astruct.io`) will work. **Without verification, Resend rejects sends
  with a 401.**

### Step 3 — set Vercel env vars

```bash
printf "re_<your_key>" | npx vercel env add RESEND_API_KEY production
printf "Astruct <hello@astruct.io>" | npx vercel env add RESEND_FROM production
printf "support@astruct.io" | npx vercel env add RESEND_REPLY_TO production
```

(All three for production. Add the first two to preview/development too if
you want previews to send real emails — usually you don't.)

### Step 4 — redeploy

```bash
npx vercel --prod --yes
```

That's it for the 3-out-of-5 emails that fire from webhook events. They'll
start working immediately on the next `checkout.session.completed`,
`invoice.payment_failed`, or `customer.subscription.deleted` event.

---

## Wire the remaining triggers

### A) `sendWelcome` after signup

The `/api/auth/anon-start` and `/api/auth/verify-otp` routes (plus the
`linkIdentity` upgrade in `components/anon-hard-wall.tsx`) are the three
points a brand-new account could be created. The cleanest hook is at the
moment the user's `is_anonymous` flag flips to `false` for the first time.
A thin Postgres trigger or a webhook on `auth.users` would catch all three.

Quick implementation:

```typescript
// app/api/auth/post-signup/route.ts (NEW)
// Called by anon-hard-wall.handleSubmit() after successful updateUser, and
// by the /register flow after successful supabase.auth.signUp.
import { sendWelcome } from '@/lib/email'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return Response.json({ ok: true })
  const { data: prof } = await supabase.from('profiles').select('name').eq('id', user.id).single()
  await sendWelcome({ to: user.email, name: prof?.name || null })
  return Response.json({ ok: true })
}
```

Then in `anon-hard-wall.tsx` after `onConverted?.()`:
```typescript
fetch('/api/auth/post-signup', { method: 'POST' }).catch(() => {})
```

### B) `sendUsageThreshold` at 80% / 100%

Best done as a **once-per-day cron** that scans `usage_records` and emits
emails when the user crosses a threshold for the first time in the cycle.
Not real-time — overnight is fine for billing UX.

```typescript
// app/api/cron/usage-thresholds/route.ts (NEW — scheduled via Vercel Cron)
import { createAdminClient } from '@/lib/supabase/admin'
import { getCurrentUsage } from '@/lib/tokens'
import { sendUsageThreshold } from '@/lib/email'

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const admin = createAdminClient()
  const { data: subs } = await admin
    .from('subscriptions')
    .select('user_id')
    .eq('status', 'active')

  for (const s of subs || []) {
    const usage = await getCurrentUsage(s.user_id)
    const { data: prof } = await admin.from('profiles').select('email, name').eq('id', s.user_id).single()
    if (!prof?.email) continue

    // Track which thresholds have already been notified this cycle
    // (add a usage_thresholds_notified jsonb column to subscriptions OR
    //  a tiny notifications_sent table — your call)
    // For now: brute-force send when pct >= 80 / >= 100; idempotency handled
    // by the notifications table.

    if (usage.pctOfIncluded >= 100) {
      await sendUsageThreshold({ to: prof.email, pct: 100, contractName: 'your contract' })
    } else if (usage.pctOfIncluded >= 80) {
      await sendUsageThreshold({ to: prof.email, pct: 80, contractName: 'your contract' })
    }
  }
  return Response.json({ ok: true })
}
```

Add to `vercel.json` (create if missing):
```json
{
  "crons": [
    { "path": "/api/cron/usage-thresholds", "schedule": "0 9 * * *" }
  ]
}
```
(09:00 UTC = 19:00 AEST — sends just before close of business so users see
the warning when they're back at their desks.)

You'll also want a `notifications_sent` table or a `last_threshold_email_at`
column to prevent re-sending the same threshold email every day. The
simplest implementation:

```sql
alter table subscriptions
  add column if not exists last_80pct_email_at timestamptz,
  add column if not exists last_100pct_email_at timestamptz;
```

Then in the cron, only send if `last_<n>pct_email_at < current_period_start`
(meaning: hasn't been sent yet this cycle).

---

## Verifying it works

After steps 1-4 above:

1. Trigger a test webhook from Stripe Dashboard:
   - Developers → Webhooks → click your endpoint → "Send test webhook" →
     `customer.subscription.deleted`
   - Set the `customer_email` field to your own email
   - Should arrive within 30 seconds with subject "Your Astruct subscription is cancelled"

2. Test the wired-up `sendSubscriptionStarted`:
   - Run the actual checkout flow with a Stripe test card (`4242 4242 4242 4242`)
   - Check your inbox for "Your Astruct subscription is active"
   - Check the Resend Dashboard → Logs to confirm delivery (open / click rates appear there)

3. Test the no-key behaviour (sanity check the graceful no-op):
   - Locally: unset `RESEND_API_KEY` and trigger any webhook
   - Server log should show: `[email] RESEND_API_KEY missing — would have sent to X: <subject>`
   - No 500, no broken UX

---

## Things to consider when you do this

- **Dedicated subdomain** for the From address (`hello@mail.astruct.io` or
  `notifications@send.astruct.io`) keeps deliverability problems on the
  email subdomain isolated from your primary domain reputation. Worth
  thinking about if you ever do volume marketing later. For transactional
  alone, `@astruct.io` is fine.
- **Resend "from" verification is per-domain not per-address** — once the
  domain is verified, any address `*@astruct.io` works.
- **SPF + DKIM are sufficient for delivery to Gmail/Outlook**. DMARC is
  recommended later but not required to start.
- **Reply-to** is set to `support@astruct.io` by default — make sure that
  inbox exists and someone reads it. If not, change `RESEND_REPLY_TO` to
  whoever does watch incoming mail.
- **Australian Spam Act 2003**: transactional email (purchase confirmation,
  service notification) is exempt from the "consent + identify + unsubscribe"
  rules. The 5 emails wired here are all transactional. If you ever add
  marketing/newsletter sends, those need an unsubscribe link and consent
  tracking — not relevant for v1.

---

## Cost

Free tier: 3,000 emails/month, 100/day. Enough for the first ~100–300
paying customers depending on dunning frequency. The next tier is $20/mo
for 50,000 emails — switch when you cross the threshold (Resend will
warn you).

---

## When you come back

Just hand a future Claude this prompt: *"Read `docs/resend-setup-deferred.md`
and execute Steps 1–4. I have a Resend account already (or: please walk me
through signup). Domain DNS is at <provider>. Then wire trigger A
(sendWelcome) into the existing post-signup flow."*
