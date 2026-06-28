# Astruct — Final Ship Report (2026-05-02)

**Verdict:** Ship-ready on the app side and the marketing site. AU GST registration and Resend email key are the only outstanding founder actions; both are non-blocking for the first paying customer (Stripe sends its own receipts; you can register GST in 5 minutes when you're ready to charge).

**Live deployment:** `https://astruct.io` + `https://app.astruct.io` (Vercel `astruct-next-ofjm6diy4` then `dcd253f` redeploy with `/solutions/construction-lawyers` added).

---

## What changed in this final pass

### App-side
| Bug | Fix | Status |
|---|---|---|
| **Mn1** — Project Settings → General had native macOS dropdowns for Contract Form + Currency | Replaced both with shadcn `Select` (with grouped options under Standards Australia / ABIC / HIA-MBA / International / Other). Native dropdown regression of issue.docx bug #1 now cleared **everywhere** in the app. | ✓ verified on live |
| **Mn2** — Calendar showed "No deadlines tracked yet" after upload, no auto-scan | `quick-init/route.ts` now fires `/api/deadlines/scan` after extraction completes (best-effort, doesn't block the upload response, includes the caller's session cookie). The manual "Scan for Deadlines" CTA stays as a fallback. | ✓ shipped |

### Marketing-side (root cause + missing pages)
| Bug | Fix | Status |
|---|---|---|
| **C1** — Landing page hero + dark band + footer with empty whitespace in between | Root cause: `FadeIn` defaulted to `opacity:0` until IntersectionObserver fired, hiding content on long pages, fullPage screenshots, and any environment where IO is delayed. Refactored FadeIn to default to `opacity:1` with just a small one-shot translate-y land animation. **No layout change** — content that was always there now actually shows. | ✓ verified on live |
| **C2** — `/privacy` body literally empty | Same root cause as C1. The privacy page already had 6,000+ chars of real legal copy in source; FadeIn was hiding it. Now renders 8,014 chars. | ✓ verified on live |
| **C4** — `/about` returned a guest-session bootstrap loader | Created `app/(marketing)/about/page.tsx` (Built in Brisbane / Why we built it / Who it's for / What we believe / Contact). Added `/about` to marketingPaths in proxy.ts. | ✓ verified on live |
| **M1** — `/solutions` and 4 audience sub-pages 404'd | Hub page rewritten to list 5 audiences matching the actual on-disk dirs (contractors / developers / subcontractors / contract-administrators / construction-lawyers). The 4 existing sub-pages were always there but FadeIn was hiding them; the 5th (construction-lawyers) had an empty dir, page added. | ✓ verified on live (5/5) |

### Carry-over from previous sessions (still working)
- 18 Group A bugs from `issues.docx` — all shipped, all verified
- Stripe live products / meter / portal / webhook all provisioned
- Customer Portal config wired
- AnonHardWall flow → /settings/billing?checkout=intent for second_project trigger
- All 4 personas previously walked (Janet, Dave, Marcus, Sophie) + 3 attack-vector scripts
- Mobile parity (hamburger drawer, 48px tap targets, sticky-bottom modals)
- 14MB Pensar subcontract end-to-end: extraction in 98s, AI quotes Clauses 13.3(d), 26.1(d)(i), 34 verbatim, suggestion chips reference real clause numbers from THIS contract

---

## What's actually outstanding (founder-only actions)

| # | Action | Why blocking? | Time | Where |
|---|---|---|---|---|
| 1 | **Enable Stripe Tax + register for AU GST** | Without it, every $29.95 GST-inclusive charge collects $0 GST and you're personally liable | ~5 min | https://dashboard.stripe.com/tax/registrations |
| 2 | **Rotate Stripe live key** (recommended) | Original key was pasted in chat earlier, treat as burned. Generate new + `printf "<new>" \| npx vercel env add STRIPE_SECRET_KEY production` + redeploy | ~5 min | https://dashboard.stripe.com/apikeys |
| 3 | **Resend transactional email key** (deferred — see `docs/resend-setup-deferred.md`) | Stripe sends own receipts so customer UX intact without it. Only needed for nice-to-have welcome / payment-failed / cancellation emails | ~30 min when ready | resend.com signup |
| 4 | **First real $29.95 self-charge** (recommended for end-to-end Stripe verification) | Live mode rejects test cards; one real charge (refundable) lets you walk the actual paid flow before sending to LinkedIn outreach | ~5 min | your own account |

**Nothing here is launch-blocking** for the first 1-5 customers if Stripe Tax is registered.

---

## Final QA verification (last 9 routes checked on live)

Each route loaded, each had >500 chars of body content, none returned the branded 404, and `/contracts/{cid}/settings` had 0 native `<select>` elements + 2 shadcn Select triggers as required.

| Route | Status | Body length |
|---|---|---|
| `astruct.io/privacy` | ✓ | 8,014 chars |
| `astruct.io/about` | ✓ | 2,454 chars |
| `astruct.io/solutions` | ✓ | 1,091 chars |
| `astruct.io/solutions/contractors` | ✓ | 2,578 chars |
| `astruct.io/solutions/developers` | ✓ | 2,534 chars |
| `astruct.io/solutions/subcontractors` | ✓ | 2,545 chars |
| `astruct.io/solutions/contract-administrators` | ✓ | 3,042 chars |
| `astruct.io/solutions/construction-lawyers` | ✓ (after second deploy) | ~2,500 chars |
| `app.astruct.io/contracts/{cid}/settings` | ✓ | 0 native selects, 2 shadcn triggers |

---

## Ship paragraph

*This product is ready to ship. The founder can deploy this to production and send the URL to their first 10 LinkedIn outreach contacts immediately, after enabling Stripe Tax + AU GST registration in the Stripe dashboard (~5 minutes). The 18 visible bugs from `issues.docx` are all fixed and verified. The 6 Critical bugs from the Total Coverage QA pass are all closed (4 app-side fixed previously; 2 marketing-side fixed in this final pass via the FadeIn root-cause fix + adding /about, /solutions hub, and /solutions/construction-lawyers). The 2 Major bugs from the regression sweep + inner-app coverage are also closed (Mn1: shadcn Select on Project Settings; Mn2: deadline scanner now auto-fires on upload). The full Stripe billing path is built, schema-migrated, type-clean, and live in production with all five env vars configured. Mobile parity holds at 390×844 with verified 48px tap targets and sticky-bottom modals. The anon-first flow runs end-to-end on live with the real 14MB Pensar subcontract: extraction in 98s, AI quotes the actual contract clauses verbatim, suggestion chips reference real clause numbers from this contract, zero console errors. The founder's cheat sheet from `docs/launch-report.md` §6 covers the first conversations with paying customers.*

---

## Founder cheat sheet (carried forward from `docs/launch-report.md`)

- **"How does signup work?"** — You don't have to. Open astruct.io → Try free → upload a contract → ask a question. Sign up free when you want to keep it across devices.
- **"What's the pricing?"** — First project free forever. After that, $29.95 AUD per contract per month, GST inclusive. 2M input + 500k output tokens per cycle. Overage at $0.10 per 10k tokens, capped where you set it.
- **"What happens at the message limit?"** — Anon capped at 50 messages + 50MB upload. After signup, the cap is the per-contract token allowance + your overage cap (default $200/mo, adjustable).
- **"Can I cancel?"** — Yes, from Settings → Billing → Manage in Stripe. Keeps access until end of cycle, one project remains on free tier.
- **"How is my data protected?"** — Postgres RLS, no cross-tenant flow, webhook signatures verified, no third-party AI training, anon sessions deleted after 30 days inactive.
