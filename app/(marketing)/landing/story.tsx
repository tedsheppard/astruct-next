'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { APP_ORIGIN, loginHref } from '@/lib/site/brand'
import { ConnectorGlyph } from '@/components/site/connector-glyphs'

// The story after the hero. Each section comes up as it enters the view
// (an intersection observer adds is-in; the CSS does the rest), and every
// screen shown is the product as it is.
const OPEN = APP_ORIGIN

const JOBS = [
  { ask: 'Prepare me for tomorrow\'s subcontractor meeting.', steps: ['Read the subcontract and the last three payment schedules', 'Opened 14 emails and the outstanding RFIs', 'Built the chronology of the variations in dispute', 'Wrote the brief: what to raise, what to ask, what to hold'] },
  { ask: 'Work out why the façade package is six weeks late.', steps: ['Compared the March and July programmes', 'Traced the drawing revisions and the RFI that changed the mullions', 'Read the site diaries for the access dates', 'Separated the demonstrated causes from the assertions, each to its source'] },
  { ask: 'Prepare an adjudication application.', steps: ['Read the Act for the jurisdiction and the contract\'s payment terms', 'Researched the authorities and read each at the passage', 'Drafted the submissions part by part, the declarations, the bundle with numbered tabs', 'Reviewed it as the other side would and closed the gaps'] },
]

const SYSTEMS: { id: string; name: string; note?: string }[] = [
  { id: 'gmail', name: 'Gmail' }, { id: 'outlook', name: 'Outlook' }, { id: 'gdrive', name: 'Google Drive' }, { id: 'onedrive', name: 'OneDrive' },
  { id: 'sharepoint', name: 'SharePoint' }, { id: 'gcal', name: 'Google Calendar' }, { id: 'procore', name: 'Procore' }, { id: 'aconex', name: 'Aconex' },
  { id: 'hammertech', name: 'HammerTech' }, { id: 'payapps', name: 'Payapps' },
]

export default function Story() {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver((entries) => { for (const e of entries) if (e.isIntersecting) e.target.classList.add('is-in') }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 })
    el.querySelectorAll('[data-in]').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])

  return (
    <div ref={root} className="ax-story">
      <section className="ax-sec" data-in>
        <div className="ax-sec-head">
          <p className="ax-eyebrow">Give Astruct a job</p>
          <h2>Not a list of features. A job, done.</h2>
          <p className="ax-lede">You do not learn Astruct. You tell it what you need the way you would tell a good contracts administrator, and it works out how: what to read, what to search, what to open, what to write.</p>
        </div>
        <div className="ax-jobs">
          {JOBS.map((j) => (
            <article key={j.ask} className="ax-job">
              <p className="ax-job-ask">{j.ask}</p>
              <ol className="ax-job-steps">{j.steps.map((s) => <li key={s}>{s}</li>)}</ol>
            </article>
          ))}
        </div>
      </section>

      <section className="ax-sec ax-sec-split" data-in>
        <div className="ax-sec-text">
          <p className="ax-eyebrow">It reads the whole project</p>
          <h2>The contract first. Then everything else.</h2>
          <p>Upload the signed contract and Astruct reads the parties and which one you are, the sum, the dates, the reference date, the payment terms and the notice rules, and sets the project up from them. Then the file: correspondence, claims, schedules, drawings and their revisions, programmes, photos. Up to 2,000 documents, every page indexed.</p>
          <p>It keeps a map of the project: the variations, RFIs, notices, people and drawings it has read, in date order, each with the page it came from. Ask what happened and it answers from the record, and tells you where the evidence disagrees with itself.</p>
        </div>
        <figure className="ax-shot"><img src="/marketing/desk/settings-project.png" width={1400} height={875} alt="The project's settings as read from the contract: the parties, the contract, the dates, the payment terms" loading="lazy" /></figure>
      </section>

      <section className="ax-sec" data-in>
        <div className="ax-sec-head">
          <p className="ax-eyebrow">Where your project lives</p>
          <h2>Connected to the systems you already use.</h2>
          <p className="ax-lede">Mail, drives and construction systems connect to the project. Astruct reads and searches what you connect, respecting who can see what in the source, and files what it finds where it belongs.</p>
        </div>
        <ul className="ax-systems">
          {SYSTEMS.map((s) => <li key={s.id}><ConnectorGlyph id={s.id} size={30} /><span>{s.name}</span></li>)}
        </ul>
        <p className="ax-note">Google Workspace and Microsoft 365 connect with your sign-in. Procore, Aconex, HammerTech and Payapps connect once your account is enabled with them; Astruct guides the set-up.</p>
      </section>

      <section className="ax-sec ax-sec-split ax-sec-flip" data-in>
        <div className="ax-sec-text">
          <p className="ax-eyebrow">Watch it work</p>
          <h2>Its own computer, and you can see the screen.</h2>
          <p>When the work needs a website, the law or a document, Astruct opens it on its computer: the browser it searches with, the viewer it reads in, the drafter it writes in. You watch the pages open, the cursor move and the words appear. Nothing happens off screen.</p>
          <p>Two ways to sit with it. <b>Computer mode</b> puts the desk in front of you with the conversation beside it. <b>Chat mode</b> gives the conversation the room, with the viewer and the browser set apart on the right.</p>
        </div>
        <figure className="ax-shot"><img src="/marketing/desk/chat-mode.png" width={1400} height={875} alt="Chat mode: the conversation on the left, the documents on the right" loading="lazy" /></figure>
      </section>

      <section className="ax-sec ax-sec-split" data-in>
        <div className="ax-sec-text">
          <p className="ax-eyebrow">Finished work</p>
          <h2>Letters, notices, claims and submissions you can send.</h2>
          <p>In your own house style, read from the letters you have filed: the letterhead, the numbering, the openings and the sign-offs. Numbered paragraphs where the form calls for them. Every clause cited, every date counted by the calendar, every figure computed rather than guessed.</p>
          <p>Hand it your own draft and it edits that document, not a copy: the words change inside your Word file as tracked changes, the formatting untouched. Download as Word or PDF; bundles come with numbered tabs and an index.</p>
        </div>
        <figure className="ax-shot"><img src="/marketing/desk/win-pdf-light.png" width={1554} height={1760} alt="A contract open in the viewer" loading="lazy" /></figure>
      </section>

      <section className="ax-sec ax-pip" data-in>
        <div className="ax-pip-card">
          <span className="ax-orb ax-orb-big" aria-hidden="true" />
          <div>
            <p className="ax-eyebrow">Meet Pip</p>
            <h2>Pip keeps watch.</h2>
            <p>Pip is the agent that runs the computer, and it does not only wait to be asked. It reviews the mail and the documents as they arrive and tells you when it thinks something should go out: a direction that needs a response, a delay that needs a notice, a time bar that is about to close. It prepares the work and holds it for you to check.</p>
            <p className="ax-fine">Pip is an AI tool, not legal advice. Everything it prepares is held for your review.</p>
          </div>
        </div>
      </section>

      <section className="ax-sec" data-in>
        <div className="ax-sec-head">
          <p className="ax-eyebrow">Time, money and space</p>
          <h2>Built for the questions construction actually asks.</h2>
        </div>
        <div className="ax-three">
          <article className="ax-tile">
            <figure><img src="/marketing/desk/win-programme.png" width={1400} height={1284} alt="The Programme window" loading="lazy" /></figure>
            <h3>Programme and delay</h3>
            <p>Reads Primavera, Microsoft Project and spreadsheet programmes. Schedules them by code: the critical path, the float, a baseline against an update, the effect of a delay on completion.</p>
          </article>
          <article className="ax-tile">
            <figure><img src="/marketing/desk/win-library.png" width={1400} height={1308} alt="The Document library" loading="lazy" /></figure>
            <h3>Quantum with lineage</h3>
            <p>Contract sum, variations, claimed, certified, retention, forecast: a ledger where every figure traces back to the page or the claim it came from, and every rollup shows its formula.</p>
          </article>
          <article className="ax-tile">
            <figure><img src="/marketing/desk/model.png" width={1400} height={875} alt="The Model window" loading="lazy" /></figure>
            <h3>Drawings and the model</h3>
            <p>A drawing register by number and revision, revisions compared region by region, and the plans read into a model of the levels and rooms you can walk through, each room citing its drawing.</p>
          </article>
        </div>
      </section>

      <section className="ax-sec ax-sec-split ax-sec-flip" data-in>
        <div className="ax-sec-text">
          <p className="ax-eyebrow">Voice</p>
          <h2>Talk to it like a colleague.</h2>
          <p>Ask what is happening with the waterproofing on level 17 and it answers from the project. Say show me the photos and the desk shows them. Ask for the instruction under clause 18.3 with those three attached, then make it firmer, then put it in Outlook for review. The same task, whichever way you say it.</p>
        </div>
        <figure className="ax-shot ax-shot-phone"><img src="/marketing/desk/phone-chat.png" width={647} height={1400} alt="Astruct on a phone" loading="lazy" /></figure>
      </section>

      <section className="ax-sec ax-keep" data-in>
        <div className="ax-sec-head">
          <p className="ax-eyebrow">How it is kept</p>
          <h2>Your documents stay yours.</h2>
        </div>
        <ul className="ax-keep-list">
          <li><b>Australia.</b> Hosted in Sydney; the database and files stay in the region.</li>
          <li><b>Permissions travel with the source.</b> What a person cannot see in SharePoint or Aconex, Astruct does not show them.</li>
          <li><b>Encrypted connections.</b> Sign-ins to your systems are held encrypted and can be revoked in a click.</li>
          <li><b>Nothing sent without you.</b> Correspondence goes out only when you say so, under the sending policy your organisation sets.</li>
          <li><b>Every action on the record.</b> What Astruct read, wrote and sent, who approved it, and the source behind each fact.</li>
        </ul>
      </section>

      <section className="ax-sec ax-close" data-in>
        <h2>Give it a job.</h2>
        <div className="ax-cta">
          <a className="ax-btn ax-btn-light" href={OPEN}>Open Astruct</a>
          <Link className="ax-btn ax-btn-ghost" href="/pricing">See pricing</Link>
        </div>
      </section>
      <footer className="ax-foot">
        <span>Astruct Pty Ltd, Australia</span>
        <nav>
          <a href={loginHref()}>Log in</a>
          <Link href="/pricing">Pricing</Link>
          <Link href="/support">Support</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/terms">Terms</Link>
        </nav>
      </footer>
    </div>
  )
}
