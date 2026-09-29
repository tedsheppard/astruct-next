import Link from 'next/link'
import { IArrow, ICheck } from './icons'
import { SIGNUP_URL } from './links'

export function PricingCards() {
  const included = [
    '100 credits per user per month, pooled across your organisation',
    'Live Outlook, Gmail and SharePoint connections',
    'The issue register, with deadlines from your contract',
    'Evidence quoted verbatim, one click from its source',
    'Notices prepared for review, downloadable as .docx',
  ]
  return (
    <div className="mk-price mk-reveal">
      <div className="mk-price-card">
        <span className="mk-h4">Astruct</span>
        <div className="mk-price-amount"><b>AU$89.95</b><span>per user per month, ex GST</span></div>
        <ul className="mk-price-list">
          {included.map((t) => <li key={t}><ICheck />{t}</li>)}
        </ul>
        <p className="mk-fine" style={{ marginBottom: 28 }}>Need more than your included credits? Pay as you go at AU$1.00 per extra credit, billed monthly.</p>
        <div className="mk-cta-row">
          <a className="mk-btn" href={SIGNUP_URL}>Start free trial</a>
          <Link className="mk-link" href="/pricing">Pricing details<IArrow /></Link>
        </div>
      </div>
      <div className="mk-price-side">
        <div className="mk-price-mini">
          <h3>30-day free trial</h3>
          <span className="mk-big">100 credits</span>
          <p>No card needed. Connect a real mailbox, add the contract and see what Astruct finds.</p>
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
