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
} from 'lucide-react'
import DemoForm from '@/components/site/demo-form'

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

export default function HomePage() {
  return (
    <div className="astruct-flat">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-[var(--flat-border)] bg-[var(--flat-paper)]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="flat-chip mb-6 h-8 gap-2 px-3 text-[12.5px] font-semibold uppercase tracking-[0.08em]">
            <Mail size={14} /> Your AI notice administrator
          </div>
          <h1 className="max-w-4xl text-[38px] sm:text-[52px]">
            Don&apos;t lose your contractual rights because someone missed an email.
          </h1>
          <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-[var(--flat-body)]">
            Contractors lose millions every year because a variation, delay event or latent condition slipped
            through an inbox and the notice deadline passed unanswered. AI that makes contract admin &ldquo;20% more
            efficient&rdquo; won&apos;t save you from that. Catching one missed notice could save you $500,000.
          </p>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--flat-muted)]">
            Astruct connects to your project email and your contract, watches for events that trigger contractual
            notices, and makes sure none of them are ever missed.
          </p>
          <div className="mt-10 max-w-md">
            <DemoForm />
          </div>
        </div>
      </section>

      {/* ── How it works: setup + loop ──────────────────────────────────── */}
      <section className="border-b border-[var(--flat-border)] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="site-eyebrow text-[var(--flat-brand)]">How it works</p>
          <h2 className="mt-3 max-w-2xl text-[30px] sm:text-[36px]">Connect your email and contract. Astruct runs the loop.</h2>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-[var(--flat-body)]">
            Set up once: connect your project email and upload the contract. From there, Astruct watches every
            incoming message for events that may trigger a contractual right or obligation, and runs the same
            eight-step loop every time.
          </p>

          <div className="mt-12 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {LOOP_STEPS.map((s, i) => (
              <div key={s.t} className="border border-[var(--flat-border)] p-5">
                <div className="flat-chip h-10 w-10 text-[var(--flat-brand)]">
                  <s.icon size={19} />
                </div>
                <p className="mt-4 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[var(--flat-muted)]">
                  Step {i + 1}
                </p>
                <h3 className="mt-1 text-[16px] font-semibold text-[var(--flat-ink)]">{s.t}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--flat-body)]">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Worked example ──────────────────────────────────────────────── */}
      <section className="border-b border-[var(--flat-border)] bg-[var(--flat-paper)]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="site-eyebrow text-[var(--flat-brand)]">The loop, in practice</p>
          <h2 className="mt-3 max-w-2xl text-[30px] sm:text-[36px]">One email. One missed notice avoided.</h2>

          <div className="mt-12 flex flex-col">
            {WORKED_EXAMPLE.map((step, i) => (
              <div key={step.t} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 flex-none items-center justify-center text-[13px] font-semibold ${
                      step.urgent ? 'bg-[var(--flat-gold)] text-white' : 'bg-[var(--flat-ink)] text-white'
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < WORKED_EXAMPLE.length - 1 && <div className="w-px flex-1 bg-[var(--flat-border)]" />}
                </div>
                <div className={`flex-1 border border-[var(--flat-border)] px-5 py-4 ${i < WORKED_EXAMPLE.length - 1 ? 'mb-4' : ''} ${step.urgent ? 'border-[var(--flat-gold)] bg-[var(--flat-ink)]' : 'bg-white'}`}>
                  <div className="flex items-center gap-2">
                    {step.urgent && <AlertTriangle size={16} className="text-[var(--flat-gold)]" />}
                    <p className={`text-[15.5px] font-semibold ${step.urgent ? 'text-white' : 'text-[var(--flat-ink)]'}`}>
                      {step.t}
                    </p>
                  </div>
                  <p className={`mt-1 text-[13.5px] ${step.urgent ? 'text-white/70' : 'text-[var(--flat-body)]'}`}>{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Event types watched ─────────────────────────────────────────── */}
      <section className="border-b border-[var(--flat-border)] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="site-eyebrow text-[var(--flat-brand)]">What Astruct watches for</p>
          <h2 className="mt-3 max-w-2xl text-[26px] sm:text-[30px]">Any event that may trigger a notice.</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {EVENT_TYPES.map((e) => (
              <li key={e} className="flex items-center gap-3 border border-[var(--flat-border)] px-4 py-3 text-[14.5px] text-[var(--flat-body)]">
                <span className="h-2 w-2 flex-none bg-[var(--flat-brand)]" />
                {e}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Closing CTA (dark navy + gold) ──────────────────────────────── */}
      <section className="bg-[var(--flat-navy-deep)]">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="mx-auto max-w-2xl text-[30px] text-white sm:text-[38px]">
            Never miss a time bar again.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-white/70">
            Astruct watches your project emails, identifies events that trigger contractual notices, and makes sure
            you never miss a deadline.
          </p>
          <div className="mx-auto mt-10 max-w-md text-left">
            <DemoForm dark />
          </div>
        </div>
      </section>
    </div>
  )
}
