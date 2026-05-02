import { Resend } from 'resend'

const FROM_DEFAULT = process.env.RESEND_FROM || 'Astruct <hello@astruct.io>'
const REPLY_TO = process.env.RESEND_REPLY_TO || 'support@astruct.io'

let cached: Resend | null = null
function client(): Resend | null {
  if (cached) return cached
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  cached = new Resend(key)
  return cached
}

export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY
}

interface SendOpts {
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
}

async function send({ to, subject, html, text, replyTo }: SendOpts) {
  const resend = client()
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY missing — would have sent to ${to}: ${subject}`)
    return { skipped: true }
  }
  try {
    const result = await resend.emails.send({
      from: FROM_DEFAULT,
      to,
      subject,
      html,
      text,
      replyTo: replyTo || REPLY_TO,
    })
    if (result.error) {
      console.error('[email] resend error', result.error)
      return { error: result.error }
    }
    return { id: result.data?.id }
  } catch (err) {
    console.error('[email] send threw', err)
    return { error: err instanceof Error ? err.message : 'unknown' }
  }
}

// ─── Shared layout ─────────────────────────────────────────────────────
function shell(title: string, body: string): string {
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>${escape(title)}</title></head>
<body style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f3ee;color:#1a1a1a;">
  <div style="max-width:560px;margin:32px auto;background:#ffffff;border:1px solid #e8e3d8;border-radius:12px;overflow:hidden;">
    <div style="padding:24px 28px;border-bottom:1px solid #e8e3d8;">
      <span style="font-size:18px;font-weight:600;letter-spacing:-0.01em;">Astruct</span>
    </div>
    <div style="padding:28px;font-size:15px;line-height:1.55;">
      ${body}
    </div>
    <div style="padding:18px 28px;border-top:1px solid #e8e3d8;font-size:12px;color:#888;">
      Astruct — AI contract intelligence for Australian construction.<br>
      <a href="https://astruct.io" style="color:#888;">astruct.io</a> · <a href="mailto:support@astruct.io" style="color:#888;">support@astruct.io</a>
    </div>
  </div>
</body></html>`
}

function escape(s: string): string {
  return s.replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] || c,
  )
}

// ─── Welcome (on signup, post-anon link or fresh signup) ──────────────
export async function sendWelcome({ to, name }: { to: string; name: string | null }) {
  const greeting = name ? `Hi ${name},` : 'Hi,'
  const body = `<p>${greeting}</p>
<p>Welcome to Astruct. Your guest work has been saved permanently and your account is ready.</p>
<p>Three quick things to try first:</p>
<ol>
  <li>Upload your latest contract — Astruct will extract the parties, key dates, and clause map automatically.</li>
  <li>Ask the assistant a question grounded in the contract: "What are the time bars I need to know?"</li>
  <li>Pin a notice template — drafts will use your letterhead and signatory automatically.</li>
</ol>
<p style="margin-top:28px;">
  <a href="https://app.astruct.io/assistant" style="background:#1a1a1a;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;display:inline-block;">Open Astruct</a>
</p>
<p style="color:#888;font-size:13px;margin-top:24px;">Reply to this email if you get stuck — a real person reads it.</p>`
  const text = `${greeting}\n\nWelcome to Astruct. Your account is ready.\n\nTry: 1) upload your latest contract, 2) ask the assistant a question about it, 3) pin a notice template.\n\nOpen Astruct: https://app.astruct.io/assistant\n\nReply to this email if you get stuck.`
  return send({ to, subject: 'Welcome to Astruct', html: shell('Welcome to Astruct', body), text })
}

// ─── Subscription started (after first paid checkout) ─────────────────
export async function sendSubscriptionStarted({
  to,
  name,
  contractQuantity,
}: {
  to: string
  name: string | null
  contractQuantity: number
}) {
  const greeting = name ? `Hi ${name},` : 'Hi,'
  const plural = contractQuantity === 1 ? 'contract' : 'contracts'
  const body = `<p>${greeting}</p>
<p>You're on the Pro Contract plan with ${contractQuantity} active ${plural}. GST-inclusive pricing — no surprises.</p>
<p>Each contract includes a generous AI allowance per cycle. You can track usage in <a href="https://app.astruct.io/settings/billing">Settings → Billing</a>.</p>
<p>If you exceed the included allowance, overage is billed at $0.10 AUD per 10,000 tokens, and you can set a cap so a busy month never surprises you.</p>
<p style="margin-top:28px;">
  <a href="https://app.astruct.io/settings/billing" style="background:#1a1a1a;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;display:inline-block;">Manage billing</a>
</p>`
  const text = `${greeting}\n\nYou're on the Pro Contract plan with ${contractQuantity} active ${plural}. Track usage at https://app.astruct.io/settings/billing.\n\nOverage is billed at $0.10 AUD per 10,000 tokens; you can set a cap.`
  return send({
    to,
    subject: 'Your Astruct subscription is active',
    html: shell('Your subscription is active', body),
    text,
  })
}

// ─── Payment failed ────────────────────────────────────────────────────
export async function sendPaymentFailed({
  to,
  amountDueCents,
  hostedInvoiceUrl,
}: {
  to: string
  amountDueCents: number
  hostedInvoiceUrl: string | null
}) {
  const amount = `$${(amountDueCents / 100).toFixed(2)} AUD`
  const link = hostedInvoiceUrl || 'https://app.astruct.io/settings/billing'
  const body = `<p>Hi,</p>
<p>Your latest payment of <strong>${amount}</strong> didn't go through. To avoid losing access, please update your card.</p>
<p style="margin-top:24px;">
  <a href="${link}" style="background:#1a1a1a;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;display:inline-block;">Update payment method</a>
</p>
<p style="color:#888;font-size:13px;margin-top:24px;">We'll retry automatically over the next few days. Reply to this email if you need a hand.</p>`
  const text = `Your latest payment of ${amount} didn't go through. Update your card at ${link} to avoid losing access.`
  return send({
    to,
    subject: 'Action needed — your Astruct payment failed',
    html: shell('Payment failed', body),
    text,
  })
}

// ─── Cancellation confirmed ────────────────────────────────────────────
export async function sendCancellationConfirmed({
  to,
  name,
  endsOn,
}: {
  to: string
  name: string | null
  endsOn: Date | null
}) {
  const greeting = name ? `Hi ${name},` : 'Hi,'
  const dateStr = endsOn
    ? endsOn.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'the end of your billing cycle'
  const body = `<p>${greeting}</p>
<p>Your Astruct subscription is set to end on <strong>${dateStr}</strong>. Until then, everything keeps working as normal.</p>
<p>Your projects, documents, and chat history will stay on your free tier — one project remains accessible after cancellation.</p>
<p>If you change your mind, you can reactivate any time:</p>
<p style="margin-top:24px;">
  <a href="https://app.astruct.io/settings/billing" style="background:#1a1a1a;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;display:inline-block;">Reactivate</a>
</p>
<p style="color:#888;font-size:13px;margin-top:24px;">If we got something wrong, please reply — we want to know.</p>`
  const text = `Your Astruct subscription will end on ${dateStr}. Until then, everything keeps working. Reactivate at https://app.astruct.io/settings/billing.`
  return send({
    to,
    subject: 'Your Astruct subscription is cancelled',
    html: shell('Subscription cancelled', body),
    text,
  })
}

// ─── Usage 80% threshold ───────────────────────────────────────────────
export async function sendUsageThreshold({
  to,
  pct,
  contractName,
}: {
  to: string
  pct: 80 | 100
  contractName: string
}) {
  const subject = pct === 80
    ? `You've used 80% of your AI allowance for "${contractName}"`
    : `You're now using overage on "${contractName}"`
  const body = pct === 80
    ? `<p>Hi,</p><p>You've used 80% of the included AI allowance on <strong>${escape(contractName)}</strong> for this billing cycle.</p><p>You can keep going — overage kicks in automatically at $0.10 per 10,000 tokens, and you can set a cap from <a href="https://app.astruct.io/settings/billing">Settings → Billing</a>.</p>`
    : `<p>Hi,</p><p>You've used your full included AI allowance on <strong>${escape(contractName)}</strong>. Astruct is still working — overage is now billing at $0.10 per 10,000 tokens against your monthly cap.</p><p><a href="https://app.astruct.io/settings/billing" style="background:#1a1a1a;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;display:inline-block;">View usage</a></p>`
  const text = pct === 80
    ? `You've used 80% of the included AI allowance on "${contractName}". Overage kicks in automatically at $0.10 per 10k tokens. Manage at https://app.astruct.io/settings/billing.`
    : `You've used your full included allowance on "${contractName}". Overage is now billing at $0.10 per 10k tokens against your monthly cap.`
  return send({ to, subject, html: shell(subject, body), text })
}
