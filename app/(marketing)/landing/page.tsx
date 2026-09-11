/**
 * astruct.io home: a landing page for app.astruct.io and nothing else.
 *
 * One headline, one line under it, two buttons, a still of the product, three
 * short reasons and a footer. The old marketing site is parked at
 * /landing-legacy; the header and footer stay out of this route so the page
 * is as quiet as the app it points to.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { APP_ORIGIN, loginHref } from '@/lib/site/brand'

export const metadata: Metadata = {
  title: 'Astruct',
  description:
    'Astruct reads your construction contracts, drafts notices and payment claims, watches your mail and keeps every deadline. A contracts administrator that never sleeps.',
}

const OPEN = APP_ORIGIN

const REASONS: { title: string; body: string }[] = [
  {
    title: 'Reads the contract once, remembers it forever',
    body: 'Attach a subcontract and Astruct files it, indexes it and pulls out the rhythm: claim dates, payment terms, notice periods, liquidated damages, defects liability. Every answer cites the page.',
  },
  {
    title: 'Drafts what the contract requires',
    body: 'Notices of delay, extension of time claims, variation notices, latent condition notices, payment claims. In your house style, with the clause, the time bar and the evidence, and never a made-up fact.',
  },
  {
    title: 'Watches the mail and the calendar',
    body: 'New correspondence is filed to the project and triaged. Deadlines it creates land in your queue. Payment claims are counted by the engine, to the day, under the Act that applies.',
  },
]

export default function LandingPage() {
  return (
    <div className="lp">
      <header className="lp-header">
        <Link href="/" className="lp-wordmark" aria-label="Astruct">
          <span className="lp-orb" aria-hidden="true" />
          <span>Astruct</span>
        </Link>
        <nav className="lp-nav">
          <a href={loginHref()}>Log in</a>
          <a className="lp-button" href={OPEN}>Open Astruct</a>
        </nav>
      </header>

      <main className="lp-main">
        <section className="lp-hero">
          <span className="lp-orb lp-orb-large" aria-hidden="true" />
          <h1>The construction contracts agent</h1>
          <p>
            Astruct reads your contracts, drafts your notices and claims, watches your mail and keeps every deadline.
            A contracts administrator on your team that never sleeps.
          </p>
          <div className="lp-cta">
            <a className="lp-button" href={OPEN}>Open Astruct</a>
            <a className="lp-button lp-button-quiet" href={loginHref()}>Log in</a>
          </div>
          <p className="lp-fine">Free to start. AU$5 of work included, then plans from AU$59 a month.</p>
        </section>

        <section className="lp-frame" aria-label="Astruct, as it looks">
          <div className="lp-window">
            <div className="lp-side">
              <div className="lp-side-row lp-side-strong">New chat</div>
              <div className="lp-side-row">Work queue</div>
              <div className="lp-side-row">Mail</div>
              <div className="lp-side-row">Scheduled</div>
              <div className="lp-side-label">Projects</div>
              <div className="lp-side-row lp-side-selected">Harbourside Residences</div>
              <div className="lp-side-sub">Dashboard</div>
              <div className="lp-side-sub">Document library</div>
              <div className="lp-side-sub">Payment claims</div>
              <div className="lp-side-sub">Delays and EOTs</div>
            </div>
            <div className="lp-chat">
              <div className="lp-bubble">We hit rock at grid B2 today that the geotech report did not show. Draft the latent condition notice.</div>
              <div className="lp-worked">Worked for 31s</div>
              <div className="lp-answer">
                <p>Drafted and saved the <strong>latent condition notice, rock encountered at grid B2</strong>.</p>
                <p>It gives notice under clause 25, records the condition and the geotechnical report, and preserves the clause 34.2 delay position. The clause 25 statement, if requested, is due within 5 business days, being <strong>17 September 2026</strong>.</p>
                <div className="lp-card">Latent condition notice, rock encountered at grid B2 <span>notice</span></div>
              </div>
              <div className="lp-composer">Ask Astruct to do anything</div>
            </div>
          </div>
        </section>

        <section className="lp-reasons">
          {REASONS.map((r) => (
            <div key={r.title} className="lp-reason">
              <h2>{r.title}</h2>
              <p>{r.body}</p>
            </div>
          ))}
        </section>

        <section className="lp-close">
          <h2>Built for Australian contracts</h2>
          <p>AS 2124, AS 4000, AS 4902, AS 4903 and bespoke forms. Security of Payment in every state. Your documents stay yours.</p>
          <a className="lp-button" href={OPEN}>Open Astruct</a>
        </section>
      </main>

      <footer className="lp-footer">
        <span>Astruct Pty Ltd</span>
        <nav>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </footer>

      <style>{`
        .lp { --ink: #0d0d0d; --ink-2: #5d5d5d; --ink-3: #8f8f8f; --line: rgba(0,0,0,.1); --bg: #fff; --sidebar: #f0efed; --bubble: #e8f4fe;
              background: var(--bg); color: var(--ink); font-family: ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; min-height: 100vh; }
        .lp a { color: inherit; text-decoration: none; }
        .lp-header { display: flex; align-items: center; justify-content: space-between; max-width: 1120px; margin: 0 auto; padding: 18px 24px; }
        .lp-wordmark { display: flex; align-items: center; gap: 10px; font-size: 17px; font-weight: 600; letter-spacing: -0.01em; }
        .lp-nav { display: flex; align-items: center; gap: 18px; font-size: 14px; color: var(--ink-2); }
        .lp-button { display: inline-flex; align-items: center; justify-content: center; height: 40px; padding: 0 18px; border-radius: 999px; background: var(--ink); color: #fff; font-size: 14px; font-weight: 500; }
        .lp-button:hover { opacity: .9; }
        .lp-button-quiet { background: transparent; color: var(--ink); border: 1px solid var(--line); }
        .lp-button-quiet:hover { background: rgba(0,0,0,.04); opacity: 1; }
        .lp-orb { display: inline-block; width: 22px; height: 22px; border-radius: 8px; background: radial-gradient(circle at 30% 15%, #fff 5%, #efedff 32%, #c6c2fa 66%, #f1f0ff 100%); box-shadow: 0 2px 10px rgba(217,215,244,.5); }
        .lp-orb-large { width: 64px; height: 64px; border-radius: 24px; margin: 0 auto 26px; box-shadow: 0 6px 34px rgba(198,194,250,.45), inset 0 0 9px #fff; animation: lp-breathe 4.5s ease-in-out infinite; }
        @keyframes lp-breathe { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-2px) scale(1.03); } }
        .lp-main { max-width: 1120px; margin: 0 auto; padding: 0 24px; }
        .lp-hero { text-align: center; padding: 84px 0 44px; }
        .lp-hero h1 { font-size: 52px; line-height: 1.05; font-weight: 500; letter-spacing: -0.02em; margin: 0 auto 18px; max-width: 760px; }
        .lp-hero p { font-size: 18px; line-height: 1.55; color: var(--ink-2); max-width: 640px; margin: 0 auto; }
        .lp-cta { display: flex; justify-content: center; gap: 10px; margin-top: 28px; }
        .lp-fine { font-size: 13px !important; color: var(--ink-3) !important; margin-top: 18px !important; }
        .lp-frame { margin: 20px auto 0; }
        .lp-window { display: grid; grid-template-columns: 220px 1fr; height: 520px; overflow: hidden; border: 1px solid var(--line); border-radius: 20px; box-shadow: 0 30px 80px -30px rgba(0,0,0,.25); background: var(--bg); text-align: left; }
        .lp-side { background: var(--sidebar); padding: 14px 10px; font-size: 13.5px; }
        .lp-side-row { padding: 7px 10px; border-radius: 9px; color: var(--ink); }
        .lp-side-strong { font-weight: 500; }
        .lp-side-selected { background: rgba(0,0,0,.05); }
        .lp-side-label { margin: 14px 10px 4px; font-size: 12.5px; color: var(--ink-3); }
        .lp-side-sub { padding: 5px 10px 5px 26px; color: var(--ink-2); font-size: 13px; }
        .lp-chat { position: relative; display: flex; flex-direction: column; gap: 14px; padding: 28px 32px; font-size: 15px; line-height: 1.55; }
        .lp-bubble { align-self: flex-end; max-width: 70%; padding: 10px 16px; border-radius: 22px; background: var(--bubble); }
        .lp-worked { font-size: 13px; color: var(--ink-3); }
        .lp-answer p { margin: 0 0 12px; }
        .lp-card { display: inline-flex; align-items: center; gap: 12px; padding: 11px 14px; border: 1px solid var(--line); border-radius: 16px; font-size: 14px; font-weight: 500; }
        .lp-card span { font-size: 12px; font-weight: 400; color: var(--ink-3); }
        .lp-composer { position: absolute; left: 32px; right: 32px; bottom: 24px; height: 52px; display: flex; align-items: center; padding: 0 18px; border-radius: 28px; color: var(--ink-3); background: #fff; box-shadow: 0 0 0 1px rgba(0,0,0,.04), 0 2px 8px rgba(0,0,0,.04), 0 4px 80px 8px rgba(0,0,0,.024); }
        .lp-reasons { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; padding: 96px 0 40px; }
        .lp-reason h2 { font-size: 18px; font-weight: 600; letter-spacing: -0.01em; margin: 0 0 10px; }
        .lp-reason p { font-size: 15px; line-height: 1.6; color: var(--ink-2); margin: 0; }
        .lp-close { text-align: center; padding: 72px 0 96px; }
        .lp-close h2 { font-size: 30px; font-weight: 500; letter-spacing: -0.02em; margin: 0 0 12px; }
        .lp-close p { font-size: 16px; color: var(--ink-2); max-width: 560px; margin: 0 auto 24px; }
        .lp-footer { display: flex; align-items: center; justify-content: space-between; max-width: 1120px; margin: 0 auto; padding: 22px 24px 40px; border-top: 1px solid var(--line); font-size: 13px; color: var(--ink-3); }
        .lp-footer nav { display: flex; gap: 18px; }
        @media (max-width: 860px) {
          .lp-hero { padding: 56px 0 36px; }
          .lp-hero h1 { font-size: 36px; }
          .lp-window { grid-template-columns: 1fr; height: auto; }
          .lp-side { display: none; }
          .lp-chat { padding-bottom: 96px; }
          .lp-reasons { grid-template-columns: 1fr; gap: 28px; padding-top: 64px; }
        }
      `}</style>
    </div>
  )
}
