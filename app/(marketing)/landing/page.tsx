import type { Metadata } from 'next'
import Link from 'next/link'
import { ProjectBrain } from '@/components/mk/brain/project-brain'
import { AskLive, DraftLive, SearchLive, WatchLive } from '@/components/mk/live/fragments'
import { Chronology } from '@/components/mk/chronology'
import { DataFlow } from '@/components/mk/data-flow'
import { Faq, HOME_FAQ, faqJsonLd } from '@/components/mk/faq'
import { GDrive, GDropbox, GGmail, GOneDrive, GOutlook, GSharePoint, GUpload, IArrow, ICheck } from '@/components/mk/icons'
import { PricingCards } from '@/components/mk/pricing'
import { BOOKING_LABEL, BOOKING_URL, CTA_LABEL, TRIAL_LINE, TRIAL_URL } from '@/components/mk/links'

// The root path is rewritten here by proxy.ts, so this page is served at "/".
export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

// Ted, 19 Oct 2026: Astruct is AI for construction. Per project, upload
// everything and connect your systems, then find, ask and draft, with AI that
// knows Australian contracts, security of payment law and how project
// correspondence is written, working from a chronology it builds itself.
// The six sections below follow that order, and the hero cards link to them.
const SECTIONS: { n: string; href: string; c: string; title: string; line: string }[] = [
  { n: '1', href: '#project', c: 'teal', title: 'One place', line: 'Every document and email for a project, read on arrival.' },
  { n: '2', href: '#find', c: 'blue', title: 'Find anything', line: 'Plain English or Boolean, across the whole project.' },
  { n: '3', href: '#ask', c: 'violet', title: 'Ask it', line: 'RFIs, scope and clauses, with the document, clause and page.' },
  { n: '4', href: '#draft', c: 'amber', title: 'Draft it', line: 'Variations, EOT notices and claims, in Word on your letterhead.' },
  { n: '5', href: '#chronology', c: 'rose', title: 'Chronology', line: 'A day-by-day record, every entry linked to its source.' },
  { n: '6', href: '#australian', c: 'ink', title: 'Made for Australia', line: 'Australian contracts and security of payment law.' },
]

// Forms Astruct reads when you give it the contract. It works from the
// document itself, so amended and bespoke forms read the same way.
const CONTRACTS: [string, string][] = [
  ['AS 4000-1997', 'General conditions'],
  ['AS 4901-1998', 'Subcontract'],
  ['AS 4902-2000', 'Design and construct'],
  ['AS 4903-2000', 'D&C subcontract'],
  ['AS 2124-1992', 'General conditions'],
  ['AS 2545-1993', 'Subcontract'],
  ['AS 4300-1995', 'Design and construct'],
  ['AS 4905-2002', 'Minor works'],
  ['AS 4906-2002', 'Minor works'],
  ['AS 4917-2003', 'Construction management'],
  ['ABIC MW-2018', 'Major works'],
  ['ABIC SW-2018', 'Simple works'],
  ['GC21', 'NSW Government'],
  ['HIA', 'Residential contracts'],
  ['MBA', 'Residential contracts'],
  ['Bespoke', 'and amended contracts'],
]

// The security of payment Act in each state and territory (the app's lib/sopa.ts).
const LAWS: [string, string][] = [
  ['SOP Act 1999 (NSW)', 'New South Wales'],
  ['SOP Act 2002 (Vic)', 'Victoria'],
  ['BIF Act 2017 (Qld)', 'Queensland'],
  ['SOP Act 2021 (WA)', 'Western Australia'],
  ['SOP Act 2009 (SA)', 'South Australia'],
  ['SOP Act 2009 (Tas)', 'Tasmania'],
  ['SOP Act 2009 (ACT)', 'Australian Capital Territory'],
  ['Construction Contracts Act 2004 (NT)', 'Northern Territory'],
]

// Connected apps, named only as far as they are live in the app.
const LIVE: { name: string; body: string; logo: React.ReactNode; two?: boolean }[] = [
  { name: 'Your documents', body: 'Files, whole folders and zips, thousands at a time. Scanned PDFs, Word, spreadsheets and saved emails are all read.', logo: <span style={{ color: 'var(--ink)', display: 'flex' }}><GUpload /></span> },
  { name: 'Outlook', body: 'Personal and shared Microsoft 365 mailboxes. Shared ones need your admin’s consent, once.', logo: <GOutlook /> },
  { name: 'OneDrive and SharePoint', body: 'Project folders and document libraries, synced and filed into the project.', logo: <><GOneDrive /><GSharePoint /></>, two: true },
  { name: 'Gmail and Google Drive', body: 'Gmail and Google Drive folders. Connect in one click.', logo: <><GGmail /><GDrive /></>, two: true },
  { name: 'Dropbox', body: 'Project folders, synced and filed into the project. Connect in one click.', logo: <GDropbox /> },
  // eslint-disable-next-line @next/next/no-img-element
  { name: 'Procore', body: 'Drawings, documents, RFIs and submittals. Your Procore admin installs the Astruct app once.', logo: <img src="/logos/procore_logo.png" alt="" width={26} height={26} style={{ borderRadius: 6 }} /> },
]
const ON_REQUEST = ['Aconex', 'Autodesk Construction Cloud', 'InEight / TeamBinder', 'Xero']

const ic = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

const SAFE: { title: string; body: string; icon: React.ReactNode }[] = [
  {
    title: 'Stored in Sydney', body: 'Projects, documents, mail and drafts are stored in Australia, in Sydney. Astruct reads only the mailboxes and apps you connect.',
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" {...ic} /><circle cx="12" cy="10" r="2.4" {...ic} /></svg>,
  },
  {
    title: 'Not used for training', body: 'Model requests go to OpenAI under its business API terms and are not used to train models. With your own API key, they go to that provider under your agreement.',
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2" {...ic} /><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" {...ic} /><path d="M12 14.5v2.5" {...ic} /></svg>,
  },
  {
    title: 'Astruct never sends', body: 'Astruct drafts. You check the draft and send it yourself. Nothing goes out from your mailbox.',
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 3 10 14" {...ic} /><path d="M21 3l-7 18-4-7-7-4z" {...ic} /></svg>,
  },
]

const KNOWS: { title: string; body: string }[] = [
  {
    title: 'Australian contracts',
    body: 'AS 4000, AS 4902, AS 2124 and the rest of the family, their subcontracts, and bespoke contracts. Special conditions are read with the general conditions, clause by clause.',
  },
  {
    title: 'Security of payment',
    body: 'The Act in each state and territory, including what a payment claim needs to state and the time each Act gives for a payment schedule.',
  },
  {
    title: 'Project correspondence',
    body: 'Letters, notices and emails set out the way contract administrators write them: the reference, the clause, the dates and the facts, in the contract’s own terms.',
  },
]

// The request and the steps beside the drafted letter (demo pack, fictional).
const DRAFT_PROMPT = 'Draft the EOT claim for the crane outage and the Level 6 access, on our letterhead'
const DRAFT_STEPS = [
  'Read Subcontract HV2291-SC-014: SC 7.2, p 20',
  'Linked notice of delay ARC-KS2-L-041 of 29 September',
  'Checked Programme Rev 8 for the critical path',
  'Drafted on the Arcline letterhead as ARC-KS2-L-044.docx',
]

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mk-ticks">
      {items.map((t) => <li key={t}><ICheck />{t}</li>)}
    </ul>
  )
}

function Marquee({ items, rev, law, dur }: { items: [string, string][]; rev?: boolean; law?: boolean; dur: number }) {
  const set = (hidden?: boolean) => (
    <div className="mk-pillset" aria-hidden={hidden || undefined}>
      {items.map(([a, b], i) => <span className="mk-tpill" key={i}>{a}<small>{b}</small></span>)}
    </div>
  )
  return (
    <div className={`mk-marquee${rev ? ' is-rev' : ''}${law ? ' is-law' : ''}`} style={{ ['--dur' as string]: `${dur}s` }}>
      <div className="mk-marquee-track">{set()}{set(true)}</div>
    </div>
  )
}

function Actions() {
  return (
    <div className="mk-cta-row">
      <a className="mk-btn" href={TRIAL_URL}>{CTA_LABEL}</a>
      <a className="mk-btn mk-btn-ghost" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">{BOOKING_LABEL}</a>
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(HOME_FAQ)) }} />

      {/* Hero: AI for construction */}
      <section className="mk-hero2">
        <div className="mk-field mk-field-hero2" aria-hidden="true"><i /><i /><i /></div>
        <div className="mk-wrap mk-hero2-wrap">
          <div className="mk-hero2-top">
            <h1 className="mk-h1 mk-hero2-h1 mk-hero2-h1-big">AI for <span className="mk-grad">construction.</span></h1>
            <div className="mk-hero2-side">
              <p className="mk-hero2-lede">
                Set up a project, upload everything and connect your systems. Then search it, ask it and draft from it,
                with AI that knows Australian contracts, security of payment law and how project correspondence is written.
              </p>
              <div className="mk-hero2-cta">
                <Actions />
                <p className="mk-fine">{TRIAL_LINE}</p>
              </div>
            </div>
          </div>
          <div className="mk-hero2-stage">
            <ProjectBrain />
          </div>
          <nav className="mk-caps mk-brain-caps mk-caps-6" aria-label="What Astruct does">
            {SECTIONS.map((b) => (
              <a className="mk-cap" href={b.href} key={b.n}>
                <span className="mk-chip" data-c={b.c}>{b.n}. {b.title}</span>
                <span className="mk-cap-line">{b.line}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* 1. Everything for a project in one place */}
      <section className="mk-sec mk-feature-sec mk-alt" id="project">
        <div className="mk-wrap mk-feature mk-feature-flip">
          <div className="mk-feature-copy">
            <span className="mk-kicker" data-c="teal">1. One place</span>
            <h2 className="mk-h2">Everything for a project, in one place.</h2>
            <p className="mk-body mk-feature-body">
              Upload the contract, specification, drawings, programme and correspondence, thousands of documents at a
              time. Connect the mailboxes and apps the project runs on. Astruct reads each document and email as it
              arrives and files it to the project by type.
            </p>
            <Bullets items={[
              'Uploads keep their folder structure',
              'Filed by type: contract, correspondence, notices, claims, RFIs, drawings',
              'New mail is picked up within about five minutes',
              'Astruct reads mail. It never sends from your mailbox',
            ]} />
          </div>
          <div className="mk-panel mk-panel-card"><WatchLive /></div>
        </div>
        <div className="mk-wrap">
          <div className="mk-srcs" id="sources" aria-label="What Astruct connects to">
            {LIVE.map((s) => (
              <div className="mk-src" key={s.name}>
                <span className={`mk-int-logo${s.two ? ' mk-int-logo-2' : ''}`}>{s.logo}</span>
                <div><b>{s.name}</b><span>{s.body}</span></div>
                <span className="mk-int-status"><i className="ui-dot" />Live</span>
              </div>
            ))}
            <div className="mk-src mk-src-request">
              <div>
                <b>Connect on request</b>
                <span>Tell us which you use when you request your trial. Until then, upload from them as files or folders.</span>
                <span className="mk-src-names">
                  {ON_REQUEST.map((n) => <span className="mk-src-name" key={n}>{n}</span>)}
                </span>
              </div>
              <span className="mk-int-status is-request"><i className="ui-dot" />On request</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Find anything */}
      <section className="mk-sec mk-feature-sec" id="find">
        <div className="mk-wrap mk-feature">
          <div className="mk-feature-copy">
            <span className="mk-kicker" data-c="blue">2. Find anything</span>
            <h2 className="mk-h2">Find any document, page or email.</h2>
            <p className="mk-body mk-feature-body">
              Search the whole project in plain English or exact Boolean. Each result says in a line why it matches
              and opens on its page. Documents are dated by their own date, not the day they were uploaded.
            </p>
            <Bullets items={[
              'Plain English: “the crane emails from September”',
              'Boolean: AND, OR, NOT, “exact phrases”, wildcards and w/5 proximity',
              'Documents and email together, filtered by type and date',
            ]} />
            <p className="mk-fine mk-feature-note"><Link className="mk-link" href="/support/boolean-search">Boolean search reference<IArrow /></Link></p>
          </div>
          <div className="mk-panel mk-panel-card"><SearchLive /></div>
        </div>
      </section>

      {/* 3. Ask it */}
      <section className="mk-sec mk-feature-sec mk-alt" id="ask">
        <div className="mk-wrap mk-feature mk-feature-flip">
          <div className="mk-feature-copy">
            <span className="mk-kicker" data-c="violet">3. Ask it</span>
            <h2 className="mk-h2">Ask about RFIs, scope and clauses.</h2>
            <p className="mk-body mk-feature-body">
              Ask in your own words. Astruct answers from the contract, the specification, the drawings and the
              correspondence, and cites the document, clause and page for each point. You read the source and decide.
            </p>
            <Bullets items={[
              'Answer an RFI from the project’s own drawings and specification',
              'What is in the scope, and where the documents say so',
              'What a clause says, quoted with its page',
              'What the documents say. Not legal advice',
            ]} />
          </div>
          <div className="mk-panel mk-panel-card"><AskLive /></div>
        </div>
      </section>

      {/* 4. Draft it */}
      <section className="mk-sec mk-feature-sec" id="draft">
        <div className="mk-wrap mk-feature mk-feature-draft">
          <div className="mk-feature-copy">
            <span className="mk-kicker" data-c="amber">4. Draft it</span>
            <h2 className="mk-h2">Variations, EOT notices and claims, drafted in Word.</h2>
            <p className="mk-body mk-feature-body">
              Variation notices, notices of delay and EOT claims, payment claims and payment schedules, letters and
              emails. Each one takes its clause, dates, parties and references from the project’s own documents, and
              opens in a real Word editor on your letterhead.
            </p>
            <div className="mk-ask-card ui" aria-label="The request and what Astruct did">
              <div className="dp-sent">{DRAFT_PROMPT}</div>
              <div className="dp-steps">
                {DRAFT_STEPS.map((x) => <span key={x} className="dp-step is-in"><i />{x}</span>)}
              </div>
            </div>
            <Bullets items={[
              'Opens in Word as .docx, or downloads as PDF',
              'Astruct never sends. You check it and send it yourself',
            ]} />
          </div>
          <div className="mk-draft-panel"><DraftLive /></div>
        </div>
      </section>

      {/* 5. The chronology */}
      <section className="mk-sec mk-alt mk-sec-reg" id="chronology">
        <div className="mk-wrap">
          <div className="mk-reg-head">
            <div>
              <span className="mk-kicker" data-c="rose">5. Chronology</span>
              <h2 className="mk-h2">A chronology that builds itself.</h2>
            </div>
            <p className="mk-lede">
              Astruct builds a day-by-day record of the project from the documents and mail it reads. Every entry
              opens the letter, email or drawing it came from. The AI works from it when it answers and drafts, so it
              knows what happened and when. Export it as CSV.
            </p>
          </div>
          <Chronology />
        </div>
      </section>

      {/* 6. Made for Australian construction */}
      <section className="mk-sec" id="australian">
        <div className="mk-wrap">
          <div className="mk-head">
            <span className="mk-kicker" data-c="ink">6. Made for Australia</span>
            <h2 className="mk-h2">Made for Australian construction. Not general-purpose AI.</h2>
            <p className="mk-lede">
              Astruct knows the contracts you sign, the security of payment Acts in each state, and how project
              correspondence is drafted. It says what the contract and the Act say. It does not give legal advice.
            </p>
          </div>
          <div className="mk-sec-grid">
            {KNOWS.map((k) => (
              <div className="mk-sec-item" key={k.title}>
                <h3>{k.title}</h3>
                <p>{k.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mk-marquee-in">
          <Marquee items={CONTRACTS} dur={70} />
          <Marquee items={LAWS} rev law dur={60} />
        </div>
      </section>

      {/* Trust */}
      <section className="mk-sec mk-alt" id="security">
        <div className="mk-wrap">
          <div className="mk-sec-top">
            <div className="mk-head">
              <h2 className="mk-h2">Your project data is stored in Australia.</h2>
              <p className="mk-lede">
                Stored in Sydney. Model requests go to OpenAI in the United States under its business API terms and are
                not used for training. Astruct never sends a letter or email. You do.
              </p>
              <p style={{ marginTop: 24 }}><Link className="mk-link" href="/security">How Astruct handles your data<IArrow /></Link></p>
            </div>
            <DataFlow />
          </div>
          <div className="mk-sec-grid">
            {SAFE.map((s) => (
              <div className="mk-sec-item" key={s.title}>
                <span className="mk-sec-ic">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mk-sec" id="pricing">
        <div className="mk-wrap">
          <div className="mk-head">
            <h2 className="mk-h2">Priced per project. Every user included.</h2>
            <p className="mk-lede">From AU$199 a project a month ex GST, with unlimited users, plus credits for AI use. {TRIAL_LINE}</p>
          </div>
          <PricingCards />
        </div>
      </section>

      {/* FAQ */}
      <section className="mk-sec mk-alt" id="faq">
        <div className="mk-wrap mk-faq-grid">
          <div className="mk-faq-side">
            <h2 className="mk-h2">Questions</h2>
            <p className="mk-body">What people ask before they start a trial.</p>
            <p><Link className="mk-link" href="/support">More answers in the help centre<IArrow /></Link></p>
          </div>
          <Faq items={HOME_FAQ} />
        </div>
      </section>

      {/* Close */}
      <section className="mk-sec mk-close">
        <div className="mk-field mk-field-close" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="mk-wrap">
          <h2 className="mk-h2">Start with one project.</h2>
          <p className="mk-lede" style={{ marginTop: 22, marginLeft: 'auto', marginRight: 'auto', maxWidth: 620 }}>
            Upload everything for the project, connect your mail and ask your first question.
          </p>
          <Actions />
          <p className="mk-fine" style={{ marginTop: 18 }}>{TRIAL_LINE}</p>
        </div>
      </section>
    </>
  )
}
