import Link from 'next/link'
import { Check } from 'lucide-react'
import { startFreeHref, DEMO_HREF } from '@/lib/site/brand'
import { CREDIT_NOTE, CREDIT_RATES, OWN_ACCOUNT_NOTE, PLATFORM_INCLUDES, PLATFORM_PRICE, TRIAL_LINE } from '@/lib/site/plans'

// One plan, one price, and the credit rates under it. The reader pays
// AU$89.95 a month for Astruct and then either brings their own ChatGPT or
// API key, at no extra cost, or uses Astruct credits by the token. Every
// figure comes from lib/site/plans.ts, which copies the app's own.
export default function Plans() {
  const startFree = startFreeHref()
  const startPlatform = `${startFree}?plan=platform`

  return (
    <>
      <article className="ax-plan ax-plan-one">
        <div className="ax-plan-one-left">
          <div className="ax-plan-top"><h3>Astruct</h3><span className="ax-pill"><i />One plan</span></div>
          <div className="ax-plan-price">
            <b>$89.95</b>
            <span>/month</span>
          </div>
          <p className="ax-plan-blurb">
            Everything in the product, for one contract administrator. Then use your own ChatGPT or API key at no extra
            cost, or Astruct credits by the token.
          </p>
          <div className="ax-plan-one-cta">
            <a href={startFree} className="ax-btn ax-btn-primary">Start your free trial</a>
            <a href={startPlatform} className="ax-btn ax-btn-ghost">Subscribe now</a>
          </div>
          <p className="ax-fine">{TRIAL_LINE}</p>
        </div>
        <ul className="ax-plan-feats ax-plan-feats-two">
          {PLATFORM_INCLUDES.map((f) => <li key={f}><Check size={16} />{f}</li>)}
        </ul>
      </article>

      <section id="usage" className="ax-track">
        <div className="ax-track-head">
          <h2>Then the model work: yours, or ours</h2>
          <p>{OWN_ACCOUNT_NOTE}</p>
        </div>

        <div className="ax-two-cards">
          <div className="ax-card">
            <h3>Your own ChatGPT or API key</h3>
            <p className="ax-plan-blurb">Connect your ChatGPT, or your own OpenAI or Anthropic key, in Settings. Astruct charges nothing by the token.</p>
            <ul className="ax-points">
              <li><Check size={16} />No token charges at all</li>
              <li><Check size={16} />Your ChatGPT runs on your own plan’s limits</li>
              <li><Check size={16} />An API key is billed to you by the provider</li>
            </ul>
          </div>
          <div className="ax-card">
            <h3>Astruct credits</h3>
            <p className="ax-plan-blurb">Or let Astruct run the models and pay by the token, at these rates.</p>
            <div className="ax-rates-wrap">
              <table className="ax-rates">
                <thead>
                  <tr><th>Intelligence</th><th>Input</th><th>Output</th></tr>
                </thead>
                <tbody>
                  {CREDIT_RATES.map((r) => (
                    <tr key={r.level}>
                      <th scope="row">{r.level}<small>{r.model}</small></th>
                      <td>{r.input}</td>
                      <td>{r.output}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="ax-fine">{CREDIT_NOTE}</p>
          </div>
        </div>

        <p className="ax-fine ax-plan-note">
          Prices in Australian dollars. Using both in the same month is normal: your ChatGPT for the conversation, and
          credits for a job it cannot run. <Link href={DEMO_HREF}>Talk to us</Link> about a team.
        </p>
      </section>
    </>
  )
}
