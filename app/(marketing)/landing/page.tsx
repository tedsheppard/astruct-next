/**
 * Astruct homepage — a literal structural port of auswitness/src/app/page.tsx.
 *
 * The section shapes below (Hero two-column with a right-side proof panel,
 * HowItWorks icon-chip grid, the FAQ two-column grid, the dark navy+gold
 * ClosingCta) are copied from that file's actual JSX and Tailwind classes —
 * only copy, icons, hrefs and the AusWitness design-token names (now
 * `--aw-*`, see app/(marketing)/site.css `.aw-home`) changed. SiteHeader and
 * SiteFooter are also ported (components/site/auswitness/header-footer.tsx)
 * and swapped in for this one route by components/site/site-header.tsx and
 * site-footer.tsx. AusWitness's Pricing, Audiences, Documents and LegalBasis
 * sections are dropped — this page is deliberately one workflow, not a
 * feature/pricing grid — as is TrustedBy (no customer logos to show yet).
 * The 8-step loop, worked example and event-type content are unchanged from
 * the prior pass, just re-hosted in AusWitness's real markup.
 */
import {
  Mail,
  FileSearch,
  Gavel,
  CalendarClock,
  BellRing,
  FileEdit,
  ListChecks,
  RefreshCcw,
  AlertTriangle,
  CheckCircle2,
  Check,
} from 'lucide-react'
import DemoForm from '@/components/site/demo-form'
import { Container } from '@/components/site/auswitness/ui'

export const metadata = {
  title: 'Your AI notice administrator',
  description:
    'Astruct watches your project emails, identifies events that trigger contractual notices, and makes sure you never miss a time bar.',
}

const LOOP_STEPS = [
  { icon: FileSearch, t: 'Identify the clause', d: 'Astruct matches the event against your uploaded contract and finds the clause that applies.' },
  { icon: CalendarClock, t: 'Calculate the deadline', d: 'The notice period is calculated from the contract terms and the date of the triggering event.' },
  { icon: ListChecks, t: 'Diarise the due date', d: 'The deadline is added to a tracked calendar so it can never quietly slip past.' },
  { icon: BellRing, t: 'Alert the responsible person', d: 'The person accountable for the notice is alerted, with time to act before the deadline.' },
  { icon: FileEdit, t: 'Draft the first notice', d: 'A first draft of the notice is prepared, referencing the clause and the event.' },
  { icon: RefreshCcw, t: 'Track follow-up requirements', d: 'Astruct tracks whether further or substantiating notices are required under the contract.' },
  { icon: Gavel, t: 'Calculate follow-up deadlines', d: 'Any follow-up notice periods are calculated and diarised the same way.' },
  { icon: CheckCircle2, t: 'Prepare the next notice', d: 'When a follow-up notice falls due, Astruct has the next draft ready to go.' },
]

const EVENT_TYPES = [
  'A direction that may be a variation',
  'A delay event',
  'A latent condition',
  'A disruption',
  'An instruction',
  'A change in scope',
  'Another notice-triggering event',
]

const WORKED_EXAMPLE = [
  { t: 'Site email received', d: '"Please proceed with revised footing design..."', urgent: false },
  { t: 'Astruct detects a potential direction', d: 'Flagged as a possible variation-triggering event', urgent: false },
  { t: 'Clause 36 — Variations', d: 'Notice required within 5 business days', urgent: false },
  { t: 'Notice due: Thursday, 4:00pm', d: 'Diarised, alerted, and counting down', urgent: true },
  { t: 'Draft notice ready', d: 'Referencing Clause 36 and the triggering instruction', urgent: false },
  { t: 'Further substantiation notice required', d: 'Due in 14 days — already diarised', urgent: false },
]

const FAQS = [
  {
    q: 'What events does Astruct detect?',
    a: 'Anything in a project email that may trigger a contractual right or obligation — directions that could be variations, delay events, latent conditions, disruption, instructions and changes in scope. Astruct matches what it finds against your uploaded contract, not a generic checklist.',
  },
  {
    q: 'Does it read every email?',
    a: 'Yes. Once your project email is connected, every incoming message is checked for a notice-triggering event, not just the ones someone happens to flag or forward.',
  },
  {
    q: 'What if I miss a notice already?',
    a: "Astruct still helps: once it's connected it starts diarising every deadline from that point on, and flags anything already open so it doesn't quietly slip further.",
  },
  {
    q: 'Which contracts does it support?',
    a: 'Upload the contract and Astruct reads the actual clauses — notice periods, follow-up and substantiation requirements — rather than assuming a standard form. It works across the major Australian construction contract suites.',
  },
  {
    q: 'How is this different from a calendar reminder?',
    a: "A reminder only works once a human has already read the email, understood the clause, and calculated the deadline. Astruct does all three of those steps itself, then keeps tracking whatever notice comes after the first one.",
  },
]

export default function HomePage() {
  return (
    <div className="aw-home">
      <Hero />
      <HowItWorks />
      <WorkedExample />
      <EventTypes />
      <Faq />
      <ClosingCta />
    </div>
  )
}

/* ---------------------------------- Hero ---------------------------------- */

function Hero() {
  return (
    <section className="border-b border-[var(--aw-border)]">
      <Container className="grid gap-14 py-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-24">
        <div>
          <h1 className="max-w-4xl text-[2rem] text-[var(--aw-ink)] sm:text-5xl lg:text-[3.4rem]">
            Don&apos;t lose your contractual rights because someone missed an email.
          </h1>
          <p className="mt-7 max-w-lg text-[17px] leading-relaxed text-[var(--aw-ink-soft)]">
            Contractors lose millions every year because a variation, delay event or latent condition slipped through
            an inbox and the notice deadline passed unanswered. AI that makes contract admin &ldquo;20% more
            efficient&rdquo; won&apos;t save you from that. Catching one missed notice could save you $500,000.
          </p>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[var(--aw-ink-faint)]">
            Astruct connects to your project email and your contract, watches for events that trigger contractual
            notices, and makes sure none of them are ever missed.
          </p>
        </div>

        {/*
          Proof panel: the same two-zone pattern as AusWitness's hero
          (a demo up top, claims underneath on a different ground) — here the
          top zone is a compact version of the worked example rather than a
          witnessing video, since there is no equivalent asset for Astruct.
        */}
        <div className="rounded-none border border-[var(--aw-border)]">
          <div className="bg-[var(--aw-surface-muted)] p-6 sm:p-8">
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--aw-ink-faint)]">
              One email, tracked automatically
            </p>
            <div className="mt-4 space-y-2.5">
              {[
                { label: 'Clause 36 — Variations', tone: 'default' as const },
                { label: 'Notice due: Thursday, 4:00pm', tone: 'urgent' as const },
                { label: 'Follow-up notice due in 14 days', tone: 'default' as const },
              ].map((row) => (
                <div
                  key={row.label}
                  className={
                    row.tone === 'urgent'
                      ? 'flex items-center gap-2 border border-[var(--aw-gold)] bg-[var(--aw-ink)] px-4 py-3 text-[14px] font-semibold text-white'
                      : 'flex items-center gap-2 border border-[var(--aw-border)] bg-white px-4 py-3 text-[14px] text-[var(--aw-ink)]'
                  }
                >
                  {row.tone === 'urgent' && <AlertTriangle className="h-4 w-4 shrink-0 text-[var(--aw-gold)]" />}
                  {row.label}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--aw-border)] bg-[var(--aw-surface)] px-8 py-7">
            <ul className="space-y-3.5">
              {[
                { key: 'watch', text: 'Watches every project email for notice-triggering events' },
                { key: 'match', text: 'Matches each one against the clause in your actual contract' },
                { key: 'deadline', text: 'Calculates and diarises the notice deadline' },
                { key: 'draft', text: 'Has a first draft of the notice ready before it falls due' },
              ].map((item) => (
                <li key={item.key} className="flex items-start gap-3 text-[15px] text-[var(--aw-ink)]">
                  <Check className="mt-[3px] h-[18px] w-[18px] shrink-0 text-[var(--aw-brand)]" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <Container className="pb-16 lg:pb-24">
        <div className="max-w-md">
          <DemoForm />
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------- How it works ------------------------------ */

function HowItWorks() {
  return (
    <section id="how" className="border-b border-[var(--aw-border)] py-20">
      <Container>
        <h2 className="text-4xl text-[var(--aw-ink)] sm:text-5xl">How it works</h2>
        <p className="mt-4 max-w-xl text-[17px] text-[var(--aw-ink-soft)]">
          Set up once: connect your project email and upload the contract. From there, Astruct watches every
          incoming message and runs the same eight-step loop every time.
        </p>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
          {LOOP_STEPS.map((s, i) => (
            <div key={s.t} className="flex flex-col gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-none bg-[var(--aw-brand-soft)] text-[var(--aw-brand)]">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[var(--aw-ink)]">Step {i + 1}</p>
                <h3 className="mt-1.5 text-[17px] font-semibold tracking-tight text-[var(--aw-ink)]">{s.t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--aw-ink-soft)]">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------ Worked example ----------------------------- */

function WorkedExample() {
  return (
    <section className="border-b border-[var(--aw-border)] bg-[var(--aw-surface-muted)] py-20">
      <Container>
        <h2 className="text-4xl text-[var(--aw-ink)] sm:text-5xl">One email. One missed notice avoided.</h2>
        <p className="mt-4 max-w-xl text-[17px] text-[var(--aw-ink-soft)]">The loop, in practice.</p>

        <div className="mt-12 flex max-w-2xl flex-col">
          {WORKED_EXAMPLE.map((step, i) => (
            <div key={step.t} className="flex gap-5">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 flex-none items-center justify-center rounded-none text-[13px] font-semibold ${
                    step.urgent ? 'bg-[var(--aw-gold)] text-white' : 'bg-[var(--aw-ink)] text-white'
                  }`}
                >
                  {i + 1}
                </div>
                {i < WORKED_EXAMPLE.length - 1 && <div className="w-px flex-1 bg-[var(--aw-border-strong)]" />}
              </div>
              <div
                className={`flex-1 border px-5 py-4 ${i < WORKED_EXAMPLE.length - 1 ? 'mb-4' : ''} ${
                  step.urgent ? 'border-[var(--aw-gold)] bg-[var(--aw-ink)]' : 'border-[var(--aw-border)] bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  {step.urgent && <AlertTriangle className="h-4 w-4 text-[var(--aw-gold)]" />}
                  <p className={`text-[15.5px] font-semibold ${step.urgent ? 'text-white' : 'text-[var(--aw-ink)]'}`}>
                    {step.t}
                  </p>
                </div>
                <p className={`mt-1 text-[13.5px] ${step.urgent ? 'text-white/70' : 'text-[var(--aw-ink-soft)]'}`}>
                  {step.d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* -------------------------------- Event types ------------------------------ */

function EventTypes() {
  return (
    <section className="border-b border-[var(--aw-border)] py-20">
      <Container>
        <h2 className="text-4xl text-[var(--aw-ink)] sm:text-5xl">What Astruct watches for</h2>
        <p className="mt-4 max-w-xl text-[17px] text-[var(--aw-ink-soft)]">Any event that may trigger a notice.</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {EVENT_TYPES.map((t) => (
            <li key={t} className="flex gap-2.5 border border-[var(--aw-border)] px-4 py-3 text-[15px] text-[var(--aw-ink)]">
              <Mail className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[var(--aw-brand)]" />
              {t}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

/* ----------------------------------- FAQ ----------------------------------- */

function Faq() {
  return (
    <section id="faq" className="border-b border-[var(--aw-border)] py-20">
      <Container>
        <h2 className="text-4xl text-[var(--aw-ink)] sm:text-5xl">Common questions</h2>
        <div className="mt-10 grid gap-x-14 gap-y-9 lg:grid-cols-2">
          {FAQS.map((f) => (
            <div key={f.q}>
              <h3 className="text-[17px] font-semibold tracking-tight text-[var(--aw-ink)]">{f.q}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--aw-ink-soft)]">{f.a}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* -------------------------------- Closing CTA ------------------------------ */

function ClosingCta() {
  return (
    <section className="bg-[var(--aw-navy-deep)] py-20 text-white">
      <Container className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl">Never miss a time bar again.</h2>
          <p className="mt-3 max-w-lg text-[17px] text-white/70">
            Astruct watches your project emails, identifies events that trigger contractual notices, and makes sure
            you never miss a deadline.
          </p>
        </div>
        <div className="w-full max-w-md text-left">
          <DemoForm dark />
        </div>
      </Container>
    </section>
  )
}
