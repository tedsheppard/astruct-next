# Architecture decisions — autonomous build

## D1. Pricing model: per-contract subscription with metered token overage
- $29.95 AUD/contract/month, GST-inclusive (`tax_behavior: 'inclusive'`)
- 2,000,000 input + 500,000 output tokens included per contract per cycle
- Overage: $0.10 AUD per 10,000 tokens (input + output combined)
- First contract free
- Default overage cap $200/month, user-adjustable

**Rationale**: matches the prompt; aligns to Cursor-style "generous allowance + meter" which converts well at SMB scale and lets a single user grow their bill predictably as they add projects. The $29.95 floor is below corporate-card threshold for tier-2 contractors so it self-approves.

**Tuning gate**: re-evaluate the 2M/500k allowance after the first 10 paying customers — the prompt explicitly flags this. Add a Linear-style ticket post-launch.

## D2. Idempotent Stripe provisioning via `lookup_key`
The setup script (`scripts/setup-stripe.mjs`) keys every Stripe object by `lookup_key` so repeat runs are safe. This is critical: the founder will run it once locally, possibly once on production, and probably once more after rotating keys.

## D3. Webhook handler stores Stripe event IDs for idempotency
`stripe_events` table — every processed `evt_*` ID is recorded. Duplicate webhook deliveries (Stripe retries up to 3 days) become no-ops. Without this, a network blip during `checkout.session.completed` would create two subscription rows.

## D4. Token tracking via wrapper, not middleware
We instrument `lib/anthropic.ts` and `lib/openai.ts` wrappers around the SDK calls so every token event captures the right `user_id`, `contract_id`, `feature`, `model`. Middleware-level capture would have to inspect SSE chunks and would miss internal calls (extractor, classifier).

## D5. Overage-cap enforcement at request entry, not generation start
A user near their cap could otherwise burn through the cap during a long stream. We project the request's likely cost (using the input prompt size + a conservative 1500-token output estimate) and reject upfront if the projection would breach the cap. Stops a single bad prompt from blowing through.

## D6. No native trial period for v1
The prompt explicitly says trials kill conversion at this stage. Free tier (1 contract forever) IS the trial. Stripe trial flag stays off. Re-evaluate post-launch if conversion rate suggests otherwise.

## D7. Customer Portal owns cancellation + payment-method updates
We do not build a custom cancel UI. The portal is more reliable, ATO-compliant, and keeps Stripe as source of truth. We surface a "Manage in Stripe" button.

## D8. Anonymous user retention: 30 days inactive (deferred to post-launch cron)
Schema and intent documented. The actual `pg_cron` job is left to flip on after the first batch of paying users have been active long enough that we trust the data flow. Logged as known deferred item in launch-report.

## D9. Resend for transactional email
SDK was already installed. From-address must be verified against the sending domain (`astruct.io`) — this is a one-time DNS step the founder does in the Resend dashboard.

## D10. Stripe API keys provided by founder at provisioning time
The build cannot create Stripe products without keys. Two paths offered to the founder:
- Founder provides test-mode key → orchestrator runs full provisioning + 10-test verification in this session
- Founder provides nothing → orchestrator ships all the code; founder runs `npm run setup:stripe` once with `STRIPE_SECRET_KEY=sk_test_...` set
