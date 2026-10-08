import Link from 'next/link'
import { IArrow, ICheck } from './icons'
import { SIGNUP_URL } from './links'
import { EXAMPLE_PROJECTS, EXAMPLE_TOTAL, TIERS, aud } from './pricing-tiers'
import { PriceCalculator } from './pricing-calc'

// One line of trial terms, used under every "Get early access" so they never drift.
export const TRIAL_LINE =
  '30-day free trial. Card required, not charged during the trial. We’ll email you 5 days before it ends.'

// The plain-text summary of the price, for metadata and the FAQ.
export const PRICE_LINE =
  `From AU$199 per project, per month, ex GST, with unlimited users. Each further project costs less: AU$179 for projects 2–5, AU$159 for 6–15, AU$139 for 16–30 and AU$119 from the 31st.`

export const INCLUDED = [
  'Unlimited users under one company account',
  'Search, Ask, Draft and the agent that watches project mail',
  'Up to 10,000 documents per project',
  'Outlook, SharePoint and OneDrive, with Gmail and Google Drive for pilot customers',
  'The Astruct Computer for Aconex, Procore and other web software',
  'Company drafting styles and letterhead, downloaded as .docx',
]

export function PricingCards({ onPricingPage = false }: { onPricingPage?: boolean }) {
  return (
    <div className="mk-price mk-reveal">
      <div className="mk-field mk-field-price" aria-hidden="true"><i /><i /><i /></div>
      <div className="mk-price-card">
        <span className="mk-h4">Astruct</span>
        <div className="mk-price-amount"><b>AU$199</b><span>per project, per month, ex GST</span></div>
        <p className="mk-price-sub">Each project after the first costs less. Every user is included.</p>
        <table className="mk-tiers">
          <caption className="mk-sr">Price per project, per month, ex GST</caption>
          <tbody>
            {TIERS.map((t) => (
              <tr key={t.label}>
                <th scope="row">{t.label}</th>
                <td>{aud(t.price)} each</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="mk-price-list">
          {INCLUDED.map((t) => <li key={t}><ICheck />{t}</li>)}
        </ul>
        <p className="mk-fine" style={{ marginBottom: 28 }}>
          {`Each project is charged at the rate for its band, so ${EXAMPLE_PROJECTS} projects cost AU$199 + 4 × AU$179 + 3 × AU$159 = ${aud(EXAMPLE_TOTAL)} a month. Cancel any time in Settings > Billing.`}
        </p>
        <div className="mk-cta-row">
          <a className="mk-btn" href={SIGNUP_URL}>Get early access</a>
          {!onPricingPage && <Link className="mk-link" href="/pricing">Pricing details<IArrow /></Link>}
        </div>
      </div>
      <div className="mk-price-side">
        <div className="mk-price-trial">
          <div className="mk-price-mini mk-lg"><PriceCalculator /></div>
        </div>
        <div className="mk-price-mini">
          <h3>30-day free trial</h3>
          <ul className="mk-trial-steps">
            <li><span>1</span>Add your card at sign-up. Nothing is charged during the trial.</li>
            <li><span>2</span>We’ll email you 5 days before your trial ends.</li>
            <li><span>3</span>Keep going at the per-project price, or cancel in Settings &gt; Billing.</li>
          </ul>
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
