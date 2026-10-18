import Link from 'next/link'
import { IArrow, ICheck } from './icons'
import { CONTACT_EMAIL, CTA_LABEL, TRIAL_URL } from './links'
import { EXAMPLE_PROJECTS, EXAMPLE_TOTAL, TIERS, aud } from './pricing-tiers'
import { PriceCalculator } from './pricing-calc'

// The plain-text summary of the price, for metadata and the FAQ.
export const PRICE_LINE =
  `From AU$199 a project a month ex GST, with unlimited users, plus credits for AI use. Each further project costs less: AU$179 for projects 2–5, AU$159 for 6–15, AU$139 for 16–30 and AU$119 from the 31st.`

export const INCLUDED = [
  'Unlimited users under one company account',
  'The contract read, with every notice period and its clause and page',
  'Every document and email filed to the project, with a chronology',
  'Search, Ask and Draft across every page, each answer cited',
  'Drafts on your letterhead, as .docx or PDF',
  'A cloud computer for each user',
  'Outlook, plus Procore, Gmail, SharePoint and other apps',
]

export function PricingCards({ onPricingPage = false }: { onPricingPage?: boolean }) {
  return (
    <div className="mk-price mk-reveal">
      <div className="mk-field mk-field-price" aria-hidden="true"><i /><i /><i /></div>
      <div className="mk-price-card">
        <span className="mk-h4">Astruct</span>
        <div className="mk-price-amount"><b>AU$199</b><span>per project, per month, ex GST</span></div>
        <p className="mk-price-sub">Each project after the first costs less. Every user is included. Credits for AI use are on top.</p>
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
          {`Each project is charged at the rate for its band, so ${EXAMPLE_PROJECTS} projects cost AU$199 + 4 × AU$179 + 3 × AU$159 = ${aud(EXAMPLE_TOTAL)} a month. Cancel any time.`}
        </p>
        <div className="mk-cta-row">
          <a className="mk-btn" href={TRIAL_URL}>{CTA_LABEL}</a>
          {!onPricingPage && <Link className="mk-link" href="/pricing">Pricing details<IArrow /></Link>}
        </div>
      </div>
      <div className="mk-price-side">
        <div className="mk-price-trial">
          <div className="mk-price-mini mk-lg"><PriceCalculator /></div>
        </div>
        <div className="mk-price-mini">
          <h3>Paying for AI use</h3>
          <ul className="mk-trial-steps">
            <li><span>1</span>Use Astruct credits, the default, with nothing else to set up. Credits are charged as used, AU$1.00 each, billed monthly.</li>
            <li><span>2</span>Or add your own OpenAI or Anthropic API key. Chat runs on your key and that provider bills you for it.</li>
          </ul>
        </div>
        <div className="mk-price-mini">
          <h3>Free for 30 days</h3>
          <ul className="mk-trial-steps">
            <li><span>1</span>Request a trial. We email you an invite link.</li>
            <li><span>2</span>Use two projects and 100 credits for 30 days. No card.</li>
            <li><span>3</span>Keep going at the per-project price, plus credits, or let the trial end. Nothing is charged unless you subscribe.</li>
          </ul>
        </div>
        <div className="mk-price-mini">
          <h3>Set up with us</h3>
          <p style={{ marginBottom: 16 }}>We can connect Microsoft 365 and set up your first project with your team.</p>
          <a className="mk-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}<IArrow /></a>
        </div>
      </div>
    </div>
  )
}
