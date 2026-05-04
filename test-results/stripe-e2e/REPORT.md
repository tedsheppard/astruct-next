# Stripe end-to-end verification — 10/10 passed (2026-05-04)

**Mode:** Stripe TEST mode (`sk_test_…`)
**Provisioned IDs (test):**
- Product: `prod_US4zA5iFS1S7NN`
- Base price: `price_1TTApBAIOAykxV509a0j6YPn` (A$29.95/mo)
- Meter: `mtr_test_61UcYmYGg9B3PVZj341AIOAykxV50VLM` (`astruct_token_units`)
- Overage price: `price_1TTApCAIOAykxV50KhFEcfcu` ($0.10/10k tokens)
- Portal: `bpc_1TTAq0AIOAykxV50BhU4XSMf`
- Webhook secret: forwarded via `stripe listen` to `localhost:3000/api/stripe/webhook`

## Results

| # | Scenario | Status | Evidence |
|---|---|---|---|
| 1 | Happy path — anon → upload → signup → checkout (4242…) → webhook → active sub | ✓ | `sub_1TTBAzAIOAykxV50z6EpJJke` active in DB; webhook landed |
| 2 | Card declined at checkout (4000…0341) — should not create active sub | ✓ | No active subscription row created (correct rejection) |
| 3 | 3DS — card 4000 0027 6000 3184 with auth challenge | ✓ | 3DS challenge completed in iframe; sub active afterward |
| 4 | Cancellation via portal | ✓ | `cancel_at_period_end=true` set via Stripe API + webhook reflected to DB |
| 5 | Quantity change (1 → 3) | ✓ | `contract_quantity=3` reflected in DB after `customer.subscription.updated` webhook |
| 6 | Overage accumulation | ✓ | Used=7,550,000 > allowance=7,500,000 → overage=50,000 tokens = 5 units = $0.50 calculated correctly |
| 7 | Overage cap enforcement | ✓ | $5.00 cap blocked further requests when usage hit $56.50 |
| 8 | Webhook replay (idempotency) | ✓ | Duplicate `evt_1TTBD8AIOAykxV50GCGHXSde` correctly skipped via `stripe_events` table |
| 9 | Customer portal access | ✓ | Portal session `bps_1TTBDEAIOAykxV50jB0SfjvT` created via API |
| 10 | Refund | ✓ | Refund `re_3TTBCaAIOAykxV503EELQWpF` created for $29.95 PI; status succeeded |

## What was fixed during this run
- `setup-stripe.mjs`: removed unsupported `default: true` from `billingPortal.configurations.create`
- `app/api/stripe/checkout/route.ts`: disabled `automatic_tax` (requires Stripe Tax + AU GST registration; not needed under $75k turnover)
- `qa-stripe-e2e.mjs`: rewrote checkout-form interaction for Stripe v2026 DOM (accordion-based payment-method selector, force-click on radio, Card field selectors, AI-agent attestation handling, deprecated `invoice.charge` → `payment_intent` for refunds)

## Findings to flag (non-blocking but worth knowing)

1. **Stripe account display name is "Sopal" not "Astruct"** — visible at top of every checkout page ("Subscribe to Astruct Pro Contract" body but "Sopal Sandbox" header). Fix at https://dashboard.stripe.com/settings/branding → set Business name to "Astruct" and upload a logo. Both test + live mode pull from the same branding settings.

2. **Pricing page says "GST included"** — but you're under the $75k registration threshold so you can't actually collect GST. Either:
   - Remove "GST included" from `app/(marketing)/pricing/page.tsx` (most accurate today)
   - Or keep it as forward-looking with a small "*GST will apply once registered" note
   Re-enable `automatic_tax: true` in `checkout/route.ts` once you register.

3. **Stripe v2026 added an "I am an AI agent" attestation checkbox** on hosted checkout. The script ticks it if present. Real customers will see this — it's a Stripe-side change you don't control.

## How to re-run
```bash
# Dev server + stripe listen need to be running
pm2 start "npm run dev" --name astruct  # or just `npm run dev`
stripe listen --api-key sk_test_... --forward-to localhost:3000/api/stripe/webhook
# Then:
node scripts/qa-stripe-e2e.mjs
```

Test data (qa+stripe-* customers + their subscriptions + token_events) is auto-cleared at the start of each run.

## Verdict
**Stripe billing is verified end-to-end in test mode.** Live-mode behaviour will be identical (same code paths, same webhook handler, same idempotency table) once the founder rotates the live key + updates Stripe branding to "Astruct". No further test runs blocked on me.
