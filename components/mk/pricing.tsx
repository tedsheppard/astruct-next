import Link from 'next/link'
import { IArrow } from './icons'
import { CONTACT_EMAIL, CTA_LABEL, TRIAL_URL } from './links'
import { EXAMPLE_PROJECTS, EXAMPLE_TOTAL, TIERS, aud } from './pricing-tiers'
import { PriceCalculator } from './pricing-calc'

// The plain-text summary of the price, for metadata and the FAQ.
export const PRICE_LINE =
  `From AU$199 a project a month ex GST, with unlimited users, plus credits for AI use. Each further project costs less: AU$179 for projects 2 to 5, AU$159 for 6 to 15, AU$139 for 16 to 30 and AU$119 from the 31st.`

export const INCLUDED = [
  'Unlimited users under one company account',
  'The project’s documents and mail, read and filed by type',
  'Search, questions and drafting across the project, with clause and page references',
  'A chronology of the project, each entry linked to its source',
  'Drafts on your letterhead, as .docx or PDF',
  'Outlook, OneDrive, SharePoint, Gmail, Google Drive, Dropbox and Procore',
  'A cloud computer for each user',
]

export function PricingCards({ onPricingPage = false }: { onPricingPage?: boolean }) {
  return (
    <div className="mk-price">
      <div className="mk-price-card">
        <span className="mk-h4">Per project</span>
        <div className="mk-price-amount"><b>AU$199</b><span>a month for the first project, ex GST</span></div>
        <p className="mk-price-sub">Each project after the first costs less. Users are included. Credits for AI use are on top.</p>
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
          {INCLUDED.map((t) => <li key={t}>{t}</li>)}
        </ul>
        <p className="mk-fine" style={{ marginBottom: 24 }}>
          {`Each project is charged at the rate for its band, so ${EXAMPLE_PROJECTS} projects cost AU$199 + 4 × AU$179 + 3 × AU$159 = ${aud(EXAMPLE_TOTAL)} a month. Cancel any time.`}
        </p>
        <div className="mk-cta-row">
          <a className="mk-btn" href={TRIAL_URL}>{CTA_LABEL}</a>
          {!onPricingPage && <Link className="mk-link" href="/pricing">Pricing details<IArrow /></Link>}
        </div>
      </div>
      <div className="mk-price-side">
        <div className="mk-price-mini"><PriceCalculator /></div>
        <div className="mk-price-mini">
          <h3>Paying for AI use</h3>
          <p>By default you use Astruct credits, charged as used at AU$1.00 a credit and billed monthly.</p>
          <p>Or add your own OpenAI or Anthropic API key. Chat then runs on your key and that provider bills you.</p>
        </div>
        <div className="mk-price-mini">
          <h3>The free trial</h3>
          <p>Request a trial and we email you an invite link. You get 30 days, two projects and 100 credits, with no card.</p>
          <p>After that, subscribe at the per-project price or let the trial end. Nothing is charged unless you subscribe.</p>
        </div>
        <div className="mk-price-mini">
          <h3>Setting up with us</h3>
          <p style={{ marginBottom: 10 }}>We can connect Microsoft 365 and set up your first project with your team.</p>
          <a className="mk-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}<IArrow /></a>
        </div>
      </div>
    </div>
  )
}
