import Link from 'next/link'
import { Check } from 'lucide-react'
import { startFreeHref, DEMO_HREF } from '@/lib/site/brand'
import { CREDIT_TIERS, OWN_ACCOUNT_FEATURES, OWN_ACCOUNT_NOTE, OWN_ACCOUNT_PRICE } from '@/lib/site/plans'

// The two ways Astruct is sold, one under the other, with the choice named at
// the top. Track A is metered by tokens on the tiers; track B is a flat fee
// for the platform with the model work on the reader's own account and no
// token charges (astruct-app/docs/BILLING.md). Every figure comes from
// lib/site/plans.ts, which copies the app's own definitions.
export default function Plans() {
  const startFree = startFreeHref()
  const startOwn = `${startFree}?plan=own`

  return (
    <>
      <div className="ax-choice" role="group" aria-label="The two ways to pay">
        <a className="ax-choice-card" href="#credits">
          <b>Pay as you go on Astruct credits</b>
          <span>Astruct pays the model bills. From $0 to $399 a month, by what you use.</span>
        </a>
        <a className="ax-choice-card" href="#own">
          <b>Bring your own account, {OWN_ACCOUNT_PRICE}</b>
          <span>Your own ChatGPT or your own API key. No token charges at all.</span>
        </a>
      </div>

      <section id="credits" className="ax-track">
        <div className="ax-track-head">
          <h2>Astruct credits</h2>
          <p>Astruct runs the models on its own accounts and meters the work against your plan. Start free, and move up when the work does.</p>
        </div>
        <div className="ax-plans is-four">
          {CREDIT_TIERS.map((t) => (
            <article key={t.id} className={t.featured ? 'ax-plan ax-plan-feat' : 'ax-plan'}>
              <div className="ax-plan-top">
                <h3>{t.name}</h3>
                {t.featured && <span className="ax-pill"><i />Most popular</span>}
              </div>
              <div className="ax-plan-price">
                <b>{t.price}</b>
                {t.cadence && <span>{t.cadence}</span>}
              </div>
              <p className="ax-plan-blurb">{t.blurb}</p>
              <a href={startFree} className={t.featured ? 'ax-btn ax-btn-primary' : 'ax-btn ax-btn-ghost'}>Start your free trial</a>
              <ul className="ax-plan-feats">
                {t.features.map((f) => <li key={f}><Check size={16} />{f}</li>)}
              </ul>
            </article>
          ))}
        </div>
        <p className="ax-fine ax-plan-note">Prices in Australian dollars. Usage is shared across chat, drafting, contract reading, workflows and scheduled tasks.</p>
      </section>

      <section id="own" className="ax-track">
        <div className="ax-track-head">
          <h2>Your own account</h2>
          <p>Connect your own ChatGPT, or your own OpenAI or Anthropic key, and pay a flat fee for Astruct itself. The provider bills you for the model work, and Astruct charges nothing by the token.</p>
        </div>
        <article className="ax-plan ax-plan-wide">
          <div className="ax-plan-wide-left">
            <div className="ax-plan-top"><h3>Own account</h3></div>
            <div className="ax-plan-price">
              <b>$149.95</b>
              <span>/month</span>
            </div>
            <p className="ax-plan-blurb">For a desk that already pays for ChatGPT or an API account and would rather not pay twice.</p>
            <div className="ax-plan-wide-cta">
              <a href={startOwn} className="ax-btn ax-btn-primary">Start on your own account</a>
              <Link href={DEMO_HREF} className="ax-btn ax-btn-ghost">Book a demo</Link>
            </div>
          </div>
          <ul className="ax-plan-feats ax-plan-feats-two">
            {OWN_ACCOUNT_FEATURES.map((f) => <li key={f}><Check size={16} />{f}</li>)}
          </ul>
        </article>
        <p className="ax-fine ax-plan-note">{OWN_ACCOUNT_NOTE}</p>
      </section>
    </>
  )
}
