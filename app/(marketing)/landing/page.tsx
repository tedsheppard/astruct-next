import type { Metadata } from 'next'
import Link from 'next/link'
import { Faq, HOME_FAQ, faqJsonLd } from '@/components/mk/faq'
import { GAutodesk, GDrive, GDropbox, GGmail, GOneDrive, GOutlook, GSharePoint, GUpload, IArrow } from '@/components/mk/icons'
import { PricingCards } from '@/components/mk/pricing'
import { BOOKING_LABEL, BOOKING_URL, CTA_LABEL, TRIAL_LINE, TRIAL_URL } from '@/components/mk/links'

// The root path is rewritten here by proxy.ts, so this page is served at "/".
export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

// 19 Oct 2026: restrained and editorial. Each section is a heading, a few
// plain sentences and one real screenshot from the app, taken on the
// Kestrel Street demo project (fictional parties). The order follows Ted's
// description: documents and mail, search, questions, drafting, chronology,
// then Australian contracts and security of payment.

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
  ['HIA and MBA', 'Residential'],
  ['Bespoke', 'Amended and one-off contracts'],
]

// The security of payment Act in each state and territory (the app's lib/sopa.ts).
const LAWS: [string, string][] = [
  ['NSW', 'Building and Construction Industry Security of Payment Act 1999'],
  ['Vic', 'Building and Construction Industry Security of Payment Act 2002'],
  ['Qld', 'Building Industry Fairness (Security of Payment) Act 2017'],
  ['WA', 'Building and Construction Industry (Security of Payment) Act 2021'],
  ['SA', 'Building and Construction Industry Security of Payment Act 2009'],
  ['Tas', 'Building and Construction Industry Security of Payment Act 2009'],
  ['ACT', 'Building and Construction Industry (Security of Payment) Act 2009'],
  ['NT', 'Construction Contracts (Security of Payments) Act 2004'],
]

// Connections, named only as far as they are live in the app.
type Conn = { name: string; body?: string; logo?: React.ReactNode; status: 'Available' | 'On request' | 'Coming soon' }
const CONNECTIONS: Conn[] = [
  { name: 'Uploads', body: 'Files, folders and zips, thousands at a time.', logo: <GUpload />, status: 'Available' },
  { name: 'Outlook', body: 'Personal and shared Microsoft 365 mailboxes. A shared mailbox needs your admin to approve Astruct once.', logo: <GOutlook />, status: 'Available' },
  { name: 'OneDrive and SharePoint', body: 'Project folders and document libraries.', logo: <><GOneDrive /><GSharePoint /></>, status: 'Available' },
  { name: 'Gmail and Google Drive', body: 'Mail and Drive folders, connected in one click.', logo: <><GGmail /><GDrive /></>, status: 'Available' },
  { name: 'Dropbox', body: 'Project folders, connected in one click.', logo: <GDropbox />, status: 'Available' },
  { name: 'Autodesk Construction Cloud', body: 'Docs folders and files across your ACC and BIM 360 projects, connected in one click.', logo: <GAutodesk />, status: 'Available' },
  // eslint-disable-next-line @next/next/no-img-element
  { name: 'Procore', body: 'Drawings, documents, RFIs and submittals. Your Procore admin sets up read-only access once and you paste two keys.', logo: <img src="/logos/procore_logo.png" alt="" width={18} height={18} />, status: 'Available' },
  // eslint-disable-next-line @next/next/no-img-element
  { name: 'Aconex', body: 'Document register and mail. Your Aconex Lobby admin makes read-only keys once and you paste them in.', logo: <img src="/logos/aconex_logo.png" alt="" width={18} height={18} />, status: 'Available' },
  // Coming soon in the app (lib/connectors/registry.ts COMING_SOON_IDS), in Ted's order.
  { name: 'InEight / TeamBinder', status: 'Coming soon' },
  { name: 'Box', status: 'Coming soon' },
  { name: 'Xero', status: 'Coming soon' },
  { name: 'MYOB', status: 'Coming soon' },
  { name: 'Payapps', status: 'Coming soon' },
  { name: 'HammerTech', status: 'Coming soon' },
]

const DATA: { title: string; body: string }[] = [
  {
    title: 'Stored in Sydney',
    body: 'Projects, documents, mail and drafts are stored in Australia, in Sydney. Astruct reads only the mailboxes and apps you connect.',
  },
  {
    title: 'Not used for training',
    body: 'Model requests go to OpenAI in the United States under its business API terms and aren’t used to train models. With your own API key, they go to that provider under your agreement with them.',
  },
  {
    title: 'Astruct doesn’t send',
    body: 'Astruct prepares drafts. You check them and send them yourself, from your own mailbox or as a signed letter.',
  },
]

function Shot({ src, w, h, alt, caption, eager }: { src: string; w: number; h: number; alt: string; caption?: string; eager?: boolean }) {
  return (
    <figure className="ed-shot">
      <div className="ed-shot-frame">
        <div className="ed-shot-bar" aria-hidden="true">app.astruct.io</div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={w} height={h} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
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

      <section className="ed-hero">
        <div className="mk-wrap">
          <h1 className="mk-h1 ed-hero-h1">AI for Australian construction.</h1>
          <div className="ed-hero-row">
            <p className="mk-lede ed-hero-lede">
              Upload a project’s contract, drawings and correspondence, and connect the project mailbox. Ask which
              clause covers latent conditions and Astruct shows you the clause and the page it’s on.
            </p>
            <div className="ed-hero-cta">
              <Actions />
              <p className="mk-fine">{TRIAL_LINE}</p>
            </div>
          </div>
          <Shot
            src="/shots/project.webp" w={2400} h={800} eager
            alt="The Kestrel Street Mixed-Use, Stage 2 project page in Astruct: the AS 4903-2000 subcontract, the parties, two Outlook mailboxes and a SharePoint library checked minutes ago, a box to ask about the project, and documents filed under contract, correspondence, notices, RFIs, drawings and other."
            caption="A project in Astruct. Kestrel Street is a demo project and its parties are fictional."
          />
        </div>
      </section>

      <section className="mk-sec ed-row" id="project">
        <div className="mk-wrap">
          <div className="ed-head">
            <h2 className="mk-h2">Documents and mail</h2>
            <div className="ed-copy">
              <p>
                Start a project and upload what you have: the contract, specification, drawings, programme and
                correspondence. Folders and zip files keep their structure, and you can add thousands of files at
                once. Scanned PDFs, Word files, spreadsheets and saved emails are all read.
              </p>
              <p>
                Connect Outlook or Gmail and new project mail comes in within about five minutes. Each document and
                email is read when it arrives and filed under contract, correspondence, notices, claims, RFIs or
                drawings. Astruct reads your mail. It never sends from your mailbox.
              </p>
            </div>
          </div>
          <Shot
            src="/shots/library.webp" w={1240} h={720}
            alt="The Library for Kestrel Street Mixed-Use, Stage 2: twenty documents filed by category, each with its reference, date, sender, recipient and page count."
            caption="The project library, filed by type."
          />

          <div className="ed-conn" id="sources">
            <div className="ed-conn-head">
              <h3 className="mk-h3">Connections</h3>
              <p className="mk-fine">
                Systems marked coming soon cannot connect yet. Export the files from them and upload those
                meanwhile.
              </p>
            </div>
            <ul className="ed-conn-list" aria-label="What Astruct connects to">
              {CONNECTIONS.map((c) => (
                <li key={c.name} className={c.status === 'Available' ? undefined : 'is-request'}>
                  <span className="ed-conn-logo" aria-hidden="true">{c.logo}</span>
                  <span className="ed-conn-name">{c.name}</span>
                  <span className="ed-conn-body">{c.body}</span>
                  <span className="ed-conn-status">{c.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mk-sec ed-row" id="find">
        <div className="mk-wrap">
          <div className="ed-head">
            <h2 className="mk-h2">Search</h2>
            <div className="ed-copy">
              <p>
                Search the documents and mail on a project together. Type it the way you’d say it, like “the crane
                emails from September”, or use Boolean with AND, OR, NOT, exact phrases, wildcards and w/5 for words
                within five of each other.
              </p>
              <p>
                Each result opens on its page, with a line on why it matched. Documents are dated by the date on the
                document, not the day someone uploaded it.
              </p>
              <p><Link className="mk-link" href="/support/boolean-search">Boolean search reference<IArrow /></Link></p>
            </div>
          </div>
          <Shot
            src="/shots/search.webp" w={2000} h={887}
            alt="A search for “bracket” across the Kestrel Street project, returning site instruction SI-014 on page 1 and the email that carried it, with the matching words highlighted."
          />
        </div>
      </section>

      <section className="mk-sec ed-row" id="ask">
        <div className="mk-wrap">
          <div className="ed-head">
            <h2 className="mk-h2">Questions about the contract</h2>
            <div className="ed-copy">
              <p>
                Ask what the notice period is for a variation, whether the façade brackets on L4 to L9 are in your
                scope, or what the specification says about slab edge tolerances before you answer an RFI.
              </p>
              <p>
                Astruct answers from the project’s own contract, specification, drawings and correspondence, and gives
                the document, clause and page for each point so you can read it yourself.
              </p>
              <p className="ed-note">It tells you what the documents say. It doesn’t give legal advice.</p>
            </div>
          </div>
          <Shot
            src="/shots/ask.webp" w={1800} h={872}
            alt="A question about the notice period for a variation on Kestrel Street. The answer quotes clause 36.1 of the subcontract, five business days, and works out when the notice for SI-014 is due."
          />
        </div>
      </section>

      <section className="mk-sec ed-row" id="draft">
        <div className="mk-wrap">
          <div className="ed-head">
            <h2 className="mk-h2">Drafting</h2>
            <div className="ed-copy">
              <p>
                Ask for a notice of delay for the tower crane outage on 14 October. Astruct drafts it under clause 34.2
                of the subcontract, addressed to the contractor’s representative, and asks you for anything it can’t
                take from the documents, such as who signs it.
              </p>
              <p>
                It drafts variation notices, notices of delay, EOT claims, payment claims, payment schedules, letters
                and emails. Drafts open in a Word editor on your letterhead and download as .docx or PDF. Astruct
                doesn’t send anything. You check the draft and send it yourself.
              </p>
            </div>
          </div>
          <Shot
            src="/shots/draft.webp" w={1440} h={560}
            alt="A notice of delay for tower crane TC1 open in the Word editor, addressed to Dana Whitlock, Contractor’s Representative, Harrow & Vale Constructions, with Astruct asking which clause the notice is given under."
          />
        </div>
      </section>

      <section className="mk-sec ed-row" id="chronology">
        <div className="mk-wrap">
          <div className="ed-head">
            <h2 className="mk-h2">Chronology</h2>
            <div className="ed-copy">
              <p>
                Astruct keeps a day-by-day record of the project from the dates in its documents and mail, such as the
                day SI-014 was issued or the day the tower crane was restricted. Each entry links to the letter, email
                or drawing it came from.
              </p>
              <p>
                Answers and drafts work from the same record, so an EOT claim quotes the dates the documents give.
                Export it as CSV when you need it in a claim or a programme review.
              </p>
            </div>
          </div>
          <Shot
            src="/shots/chronology.webp" w={2000} h={1062}
            alt="The chronology for Kestrel Street Mixed-Use, Stage 2, listing a site diary, a site instruction about façade brackets, payment claim PC-08 and a letter about tower crane access, each with the date and page it came from."
          />
        </div>
      </section>

      <section className="mk-sec" id="australian">
        <div className="mk-wrap">
          <div className="ed-head">
            <h2 className="mk-h2">Australian contracts and security of payment</h2>
            <div className="ed-copy">
              <p>
                Astruct reads the contract you give it, with the special conditions read against the general
                conditions clause by clause. That covers the AS 4000 and AS 2124 families and their subcontracts,
                ABIC, GC21 and the residential forms, and bespoke or heavily amended contracts read the same way.
              </p>
              <p>
                It knows the security of payment Act in each state and territory, including what a payment claim has
                to state and how long each Act allows for a payment schedule. Letters and notices are set out the way
                contract administrators write them, with the reference, clause, dates and facts.
              </p>
              <p className="ed-note">Astruct tells you what the contract and the Act say. It doesn’t give legal advice.</p>
            </div>
          </div>
          <div className="ed-lists">
            <div>
              <h3 className="mk-h3">Standard forms</h3>
              <ul className="ed-list ed-list-2">
                {CONTRACTS.map(([a, b]) => <li key={a}><b>{a}</b><span>{b}</span></li>)}
              </ul>
            </div>
            <div>
              <h3 className="mk-h3">Security of payment Acts</h3>
              <ul className="ed-list ed-list-law">
                {LAWS.map(([a, b]) => <li key={a}><b>{a}</b><span>{b}</span></li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mk-sec" id="security">
        <div className="mk-wrap">
          <div className="ed-head">
            <h2 className="mk-h2">Data and security</h2>
            <div className="ed-copy">
              <p>
                Project correspondence is commercially sensitive. This is where it’s kept, who processes it, and what
                Astruct does with it.
              </p>
              <p><Link className="mk-link" href="/security">Security details<IArrow /></Link></p>
            </div>
          </div>
          <div className="mk-cols">
            {DATA.map((s) => (
              <div key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mk-sec" id="pricing">
        <div className="mk-wrap">
          <div className="ed-head">
            <h2 className="mk-h2">Pricing</h2>
            <div className="ed-copy">
              <p>
                AU$199 a month ex GST for the first project, and less for each one after that. Add as many users as you
                need. AI use is billed in credits, or you can run it on your own OpenAI or Anthropic API key.
              </p>
              <p className="ed-note">{TRIAL_LINE}</p>
            </div>
          </div>
          <PricingCards />
        </div>
      </section>

      <section className="mk-sec" id="faq">
        <div className="mk-wrap mk-faq-grid">
          <div className="mk-faq-side">
            <h2 className="mk-h2">Questions</h2>
            <p className="mk-body">What people usually ask before a trial.</p>
            <p><Link className="mk-link" href="/support">Help centre<IArrow /></Link></p>
          </div>
          <Faq items={HOME_FAQ} />
        </div>
      </section>

      <section className="mk-sec ed-close">
        <div className="mk-wrap ed-close-row">
          <div>
            <h2 className="mk-h2">Try it on one project</h2>
            <p className="mk-body">
              Upload the documents for a job you’re running now, connect the project mailbox, and ask it something
              you’d normally go through the files for.
            </p>
          </div>
          <div className="ed-hero-cta">
            <Actions />
            <p className="mk-fine">{TRIAL_LINE}</p>
          </div>
        </div>
      </section>
    </>
  )
}
