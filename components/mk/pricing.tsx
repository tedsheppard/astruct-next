import Link from 'next/link'
import { IArrow, ICheck } from './icons'
import { SIGNUP_URL } from './links'

// One line of trial terms, used under every "Get early access" so they never drift.
export const TRIAL_LINE =
  '30-day free trial with 100 credits. Card required, not charged during the trial. We’ll email you 5 days before it ends.'

export function PricingCards({ onPricingPage = false }: { onPricingPage?: boolean }) {
  const included = [
    '100 credits per user per month, pooled across your organisation',
    'Ask, Search, Draft and the agent that watches your mail',
    'Up to 5,000 documents per project',
    'Outlook, SharePoint and OneDrive connections, Gmail for pilot customers',
    'Letters, notices and EOT claims downloadable as .docx',
  ]
  return (
    <div className="mk-price mk-reveal">
      <div className="mk-field mk-field-price" aria-hidden="true"><i /><i /><i /></div>
      <div className="mk-price-card">
        <span className="mk-h4">Astruct</span>
        <div className="mk-price-amount"><b>AU$89.95</b><span>per user per month, ex GST</span></div>
        <ul className="mk-price-list">
          {included.map((t) => <li key={t}><ICheck />{t}</li>)}
        </ul>
        <p className="mk-fine" style={{ marginBottom: 28 }}>
          Beyond your included credits, pay as you go at AU$1.00 per credit, billed monthly. Cancel any time in Settings
          &gt; Billing.
        </p>
        <div className="mk-cta-row">
          <a className="mk-btn" href={SIGNUP_URL}>Get early access</a>
          {!onPricingPage && <Link className="mk-link" href="/pricing">Pricing details<IArrow /></Link>}
        </div>
      </div>
      <div className="mk-price-side">
        <div className="mk-price-trial">
          <div className="mk-price-mini mk-lg">
            <h3>30-day free trial</h3>
            <span className="mk-big"><span className="mk-grad">100 credits</span></span>
            <ul className="mk-trial-steps">
              <li><span>1</span>Add your card at sign-up. Nothing is charged during the trial.</li>
              <li><span>2</span>We’ll email you 5 days before your trial ends.</li>
              <li><span>3</span>Keep going at AU$89.95 per user per month, or cancel in Settings &gt; Billing.</li>
            </ul>
          </div>
        </div>
        <div className="mk-price-mini">
          <h3>Private pilot</h3>
          <p style={{ marginBottom: 16 }}>For teams that want a hand connecting Microsoft 365 and setting up the first project with us.</p>
          <Link className="mk-link" href="/apply">Apply for the private pilot<IArrow /></Link>
        </div>
      </div>
    </div>
  )
}
