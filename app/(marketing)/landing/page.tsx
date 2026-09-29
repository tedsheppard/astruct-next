import type { Metadata } from 'next'
import Link from 'next/link'
import { HeroLoop, Walkthrough } from '@/components/mk/media'
import { AppWindow, Clause, Evidence, IssueWindow, MailList, Notice, PhoneStill, Sources, StateHistory } from '@/components/mk/fragments'
import { Faq, HOME_FAQ, faqJsonLd } from '@/components/mk/faq'
import { GGmail, GOutlook, GSharePoint, GUpload, IArrow } from '@/components/mk/icons'
import { PricingCards } from '@/components/mk/pricing'
import { SIGNUP_URL } from '@/components/mk/links'

// The root path is rewritten here by proxy.ts, so this page is served at "/".
export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

const STEPS = [
  {
    title: 'It starts with what you already have.',
    body: 'Directions, site instructions, RFI responses, programme revisions and drawing transmittals already arrive in your project mailboxes and folders. Astruct works from those, not from whatever someone remembers to upload.',
    frag: <MailList />,
  },
  {
    title: 'Astruct stays connected and keeps reading.',
    body: 'Connect Outlook or Gmail mailboxes and SharePoint libraries once. New mail is picked up within about five minutes, and Outlook mailboxes can also notify Astruct as mail arrives. Documents are read as they land.',
    note: 'Shared mailboxes and SharePoint need your Microsoft 365 admin’s consent.',
    frag: <Sources />,
  },
  {
    title: 'It spots the variation and links the evidence.',
    body: 'When a direction changes your scope or a delay hits your programme, Astruct opens an issue and links the evidence: the exact words, quoted from the email, drawing or site diary, each one a click from its source.',
    frag: <Evidence />,
  },
  {
    title: 'It finds the clause and the time bar.',
    body: 'Astruct reads your contract for the rule that governs the issue: the clause, the notice period, business or calendar days and your state’s public holidays. It computes the deadline and shows the clause text beside it.',
    note: 'Every deadline stays marked “check the clause” until your team confirms the rule for the project.',
    frag: <Clause />,
  },
  {
    title: 'It keeps the issue’s state.',
    body: 'Each issue moves from detected to sent or closed, with a history of what changed and why. Evidence that arrives after a draft is prepared flags the draft for another look.',
    frag: <StateHistory />,
  },
  {
    title: 'It prepares the notice for your review.',
    body: 'The notice of variation, delay notice or EOT claim is drafted with the particulars filled in. Nothing is sent automatically. You review it, download the .docx and send it through your normal process.',
    frag: <Notice />,
  },
]

const VS = [
  ['Where it gets information', 'Whatever you upload, when you remember to', 'Your live project mailboxes and folders, kept in sync'],
  ['What you get', 'An answer in a chat thread', 'An issue register that keeps each issue’s state'],
  ['Deadlines', 'Only if you ask, and only as good as the question', 'Computed from your contract’s clause, with the clause text shown'],
  ['Evidence', 'A summary you have to take on trust', 'Verbatim quotes that open the source email or document'],
  ['The output', 'Text to copy into a letter', 'A notice prepared for your review, as a .docx'],
]

const SECURITY = [
  { big: 'Sydney', title: 'Stored in Australia', body: 'Your projects, mail and documents are stored in Australia, in Sydney.' },
  { big: 'Zero', title: 'Zero Data Retention', body: 'Astruct uses OpenAI’s API under Zero Data Retention, so your content is not kept by OpenAI once a request is answered.' },
  { big: 'None', title: 'No training on your data', body: 'Your mail, documents and drafts are never used to train models, by us or by OpenAI.' },
  { title: 'Mailbox access set by your admin', body: 'Your administrator decides whose mailbox each person can search and use with Astruct, one user at a time.' },
  { title: 'Drafts are never sent automatically', body: 'Astruct prepares notices and correspondence. A person on your team reviews them and sends them.' },
  { title: 'Microsoft 365 on your terms', body: 'Organisation-wide connections run on your tenant’s admin consent, and your admin can revoke them at any time.' },
]

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(HOME_FAQ)) }} />

      {/* Hero */}
      <section className="mk-hero">
        <div className="mk-wrap">
          <span className="mk-kicker">Commercial intelligence for construction</span>
          <h1 className="mk-h1">Don’t get<br />time-barred.</h1>
          <p className="mk-lede">
            Astruct stays connected to your project mail and documents. It spots variations and delays as they come in,
            finds the clause and the time bar that apply, and prepares the notice for your review.
          </p>
          <div className="mk-cta-row">
            <a className="mk-btn" href={SIGNUP_URL}>Start free trial</a>
            <Link className="mk-link" href="/apply">Apply for the private pilot<IArrow /></Link>
          </div>
          <p className="mk-fine mk-hero-fine">30 days free with 100 credits. No card needed.</p>
          <div className="mk-hero-stage">
            <HeroLoop
              label="Astruct's project page: a new site instruction arrives and becomes a variation with a notice due in three business days."
              desktop={<AppWindow />}
              phone={<PhoneStill />}
            />
          </div>
        </div>
      </section>

      {/* The story */}
      <section className="mk-sec" id="how-it-works">
        <div className="mk-wrap">
          <div className="mk-head mk-reveal">
            <span className="mk-kicker">How it works</span>
            <h2 className="mk-h2">Your project already tells you what’s happening. <span className="mk-muted">Astruct keeps up with it.</span></h2>
          </div>
          <div className="mk-steps">
            {STEPS.map((s, i) => (
              <div className="mk-step mk-reveal" key={s.title}>
                <div>
                  <span className="mk-step-n">{i + 1}</span>
                  <h3 className="mk-h3">{s.title}</h3>
                  <p className="mk-body">{s.body}</p>
                  {s.note && <p className="mk-fine mk-step-note">{s.note}</p>}
                </div>
                <div className="mk-panel">{s.frag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* See it work */}
      <section className="mk-sec mk-alt" id="see-it-work">
        <div className="mk-wrap">
          <div className="mk-head mk-center mk-reveal">
            <span className="mk-kicker">See it work</span>
            <h2 className="mk-h2">From one email to a notice, ready to send.</h2>
            <p className="mk-lede">A walkthrough on the demo project, a fictional façade subcontract in Brisbane.</p>
          </div>
          <div className="mk-walk mk-reveal">
            <Walkthrough label="Astruct walkthrough on the demo project">
              <IssueWindow />
            </Walkthrough>
            <div className="mk-walk-steps" aria-label="What the walkthrough shows">
              <span>Mail arrives</span><span>Issue detected</span><span>Evidence linked</span><span>Clause and deadline</span><span>Notice prepared</span>
            </div>
          </div>
        </div>
      </section>

      {/* Not a chatbot */}
      <section className="mk-sec mk-band" id="not-a-chatbot">
        <div className="mk-wrap">
          <div className="mk-head mk-reveal">
            <span className="mk-kicker">Not another chat window</span>
            <h2 className="mk-h2">Not a chatbot you upload PDFs to.</h2>
            <p className="mk-lede">
              Chat tools answer what you ask, about what you remember to give them. Astruct works the other way round. It
              watches the project and shows you what needs doing, and by when.
            </p>
          </div>
          <div className="mk-vs mk-reveal" role="table" aria-label="Upload-and-ask tools compared with Astruct">
            <div className="mk-vs-row mk-vs-head" role="row">
              <span role="columnheader" />
              <span role="columnheader">Upload and ask</span>
              <span role="columnheader">Astruct</span>
            </div>
            {VS.map(([k, them, us]) => (
              <div className="mk-vs-row" role="row" key={k}>
                <h3 role="rowheader">{k}</h3>
                <span className="mk-vs-them" role="cell">{them}</span>
                <span className="mk-vs-us" role="cell">{us}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="mk-sec" id="connections">
        <div className="mk-wrap">
          <div className="mk-head mk-reveal">
            <span className="mk-kicker">Connections</span>
            <h2 className="mk-h2">Works where your project already lives.</h2>
            <p className="mk-lede">Connect your sources once. Astruct keeps reading them.</p>
          </div>
          <div className="mk-int mk-reveal">
            <div className="mk-int-card">
              <div className="mk-int-logos"><span className="mk-int-logo"><GOutlook /></span><span className="mk-int-logo"><GSharePoint /></span></div>
              <h3>Outlook and SharePoint</h3>
              <p>Personal and shared Microsoft 365 mailboxes, and SharePoint document libraries. Shared mailboxes and SharePoint need your admin’s consent.</p>
              <span className="mk-int-status"><i className="ui-dot" />Live</span>
            </div>
            <div className="mk-int-card">
              <div className="mk-int-logos"><span className="mk-int-logo"><GGmail /></span></div>
              <h3>Gmail</h3>
              <p>Project mailboxes on Gmail or Google Workspace, read with each person’s permission.</p>
              <span className="mk-int-status"><i className="ui-dot" />Live</span>
            </div>
            <div className="mk-int-card">
              <div className="mk-int-logos"><span className="mk-int-logo" style={{ color: 'var(--ink)' }}><GUpload /></span></div>
              <h3>Uploads and imports</h3>
              <p>Add the contract, programme, registers and past correspondence so the history is there from day one.</p>
              <span className="mk-int-status"><i className="ui-dot" />Live</span>
            </div>
            <div className="mk-int-card mk-int-others">
              <div>
                <h3 style={{ marginTop: 0 }}>Procore, Aconex and other platforms</h3>
                <p style={{ marginTop: 6 }}>Connections to project platforms such as Procore, Aconex, HammerTech and Payapps are built on request.</p>
              </div>
              <span className="mk-int-status is-request"><i className="ui-dot" />On request</span>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="mk-sec mk-alt" id="security">
        <div className="mk-wrap">
          <div className="mk-head mk-reveal">
            <span className="mk-kicker">Security</span>
            <h2 className="mk-h2">Your project data stays yours.</h2>
            <p className="mk-lede">Commercial correspondence is sensitive. Astruct is built so it stays where it should, and only the right people see it.</p>
          </div>
          <div className="mk-sec-grid mk-reveal">
            {SECURITY.map((s) => (
              <div className="mk-sec-item" key={s.title}>
                {s.big && <span className="mk-sec-big">{s.big}</span>}
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 36 }}><Link className="mk-link" href="/security">How Astruct handles your data<IArrow /></Link></p>
        </div>
      </section>

      {/* Pricing */}
      <section className="mk-sec" id="pricing">
        <div className="mk-wrap">
          <div className="mk-head mk-reveal">
            <span className="mk-kicker">Pricing</span>
            <h2 className="mk-h2">One plan. Start free.</h2>
            <p className="mk-lede">Try Astruct on a live project for 30 days. No card needed.</p>
          </div>
          <PricingCards />
        </div>
      </section>

      {/* FAQ */}
      <section className="mk-sec mk-alt" id="faq">
        <div className="mk-wrap mk-narrow">
          <div className="mk-head mk-reveal">
            <h2 className="mk-h2">Questions</h2>
          </div>
          <Faq items={HOME_FAQ} />
        </div>
      </section>

      {/* Close */}
      <section className="mk-sec mk-close">
        <div className="mk-wrap mk-reveal">
          <h2 className="mk-h2">Start with one project.</h2>
          <p className="mk-lede" style={{ marginTop: 22, marginLeft: 'auto', marginRight: 'auto', maxWidth: 620 }}>
            Connect a mailbox, add the contract, and see what Astruct finds.
          </p>
          <div className="mk-cta-row">
            <a className="mk-btn" href={SIGNUP_URL}>Start free trial</a>
            <Link className="mk-link" href="/apply">Apply for the private pilot<IArrow /></Link>
          </div>
        </div>
      </section>
    </>
  )
}
