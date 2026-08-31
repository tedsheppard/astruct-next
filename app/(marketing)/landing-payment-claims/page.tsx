import Link from 'next/link'
import { ArrowRight, ShieldCheck, Scale, Clock, FileText, Sparkles, Building2, HardHat } from 'lucide-react'
import { Container, Section, Eyebrow, SectionHeading, Button, Pill, CheckItem } from '@/components/site/primitives'
import { LedgerDiagram, DeadlineTimeline, StateCoverage, ComparisonTable, FAQ } from '@/components/site/visuals'
import { FEATURES, startFreeHref, DEMO_HREF } from '@/lib/site/brand'

export const metadata = {
  title: 'Security of Payment software for Australian construction',
  description:
    'Astruct generates compliant payment claims and payment schedules for head contractors and subcontractors — built to the Security of Payment Act in every Australian state and territory.',
}

const ICONS = [ShieldCheck, FileText, Clock, Scale, Building2, HardHat, Sparkles]

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white">
        <div className="site-grid-bg pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div
          className="pointer-events-none absolute -top-40 right-0 h-[520px] w-[520px] rounded-full opacity-50 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(27,59,224,.16), transparent 60%)' }}
        />
        <Container wide className="relative grid items-center gap-14 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-24">
          <div className="site-fade">
            <Pill tint className="mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--site-brand)]" />
              Security of Payment, done properly
            </Pill>
            <h1 className="text-[44px] font-bold leading-[1.02] tracking-tight text-[var(--site-text)] sm:text-[56px]">
              Get paid what you&apos;re owed,<br className="hidden sm:block" /> without the paperwork war.
            </h1>
            <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-[var(--site-body)]">
              Astruct turns progress claims, payment schedules, variations and retention into compliant documents in
              minutes. Built to the Security of Payment legislation in every state and territory — for the people who
              claim, and the people who assess.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={startFreeHref()} external size="lg">
                Start free <ArrowRight size={18} />
              </Button>
              <Button href={DEMO_HREF} variant="ghost" size="lg">
                Book a demo
              </Button>
            </div>
            <p className="mt-5 text-[13.5px] text-[var(--site-muted)]">
              Free for your first project · No credit card · Every Australian jurisdiction
            </p>
          </div>

          {/* Hero visual — a compliant claim */}
          <div className="site-fade relative" style={{ animationDelay: '.08s' }}>
            <div className="site-card overflow-hidden shadow-[0_40px_80px_-40px_rgba(10,17,36,.35)]">
              <div className="flex items-center justify-between border-b border-[var(--site-line)] bg-[var(--site-paper)] px-5 py-3">
                <span className="font-display text-[14px] font-bold text-[var(--site-text)]">Payment Claim #07</span>
                <span className="site-pill h-6 text-[11px] text-[var(--site-green)]" style={{ borderColor: 'rgba(18,160,106,.3)' }}>
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--site-green)]" /> Compliant
                </span>
              </div>
              <div className="space-y-3 p-5">
                <div className="rounded-lg border border-[var(--site-line)] bg-white px-4 py-3">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--site-muted)]">Statutory endorsement</p>
                  <p className="mt-1 text-[12.5px] italic leading-snug text-[var(--site-body)]">
                    “This is a payment claim made under the Building and Construction Industry Security of Payment Act
                    1999 (NSW).”
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { k: 'Net claimed', v: '$293,992' },
                    { k: 'GST', v: '$29,399' },
                    { k: 'Payable', v: '$323,391' },
                  ].map((s, i) => (
                    <div key={s.k} className={`rounded-lg px-3 py-2.5 ${i === 2 ? 'bg-[var(--site-brand)] text-white' : 'bg-[var(--site-paper)]'}`}>
                      <p className={`font-mono text-[10px] uppercase tracking-wide ${i === 2 ? 'text-white/70' : 'text-[var(--site-muted)]'}`}>{s.k}</p>
                      <p className={`mt-0.5 font-display text-[15px] font-bold tabular-nums ${i === 2 ? 'text-white' : 'text-[var(--site-text)]'}`}>{s.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Proof band ───────────────────────────────────────────────────── */}
      <div className="border-y border-[var(--site-line)] bg-[var(--site-paper)]">
        <Container wide className="grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          {[
            { n: '8', l: 'Jurisdictions covered' },
            { n: 'A–K', l: 'Ledger, computed exactly' },
            { n: '10–15', l: 'Business-day deadlines tracked' },
            { n: '2-sided', l: 'Claim and assess in one place' },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-display text-[30px] font-bold tracking-tight text-[var(--site-text)]">{s.n}</p>
              <p className="mt-1 text-[13px] text-[var(--site-muted)]">{s.l}</p>
            </div>
          ))}
        </Container>
      </div>

      {/* ── Two-sided model ──────────────────────────────────────────────── */}
      <Section>
        <Container wide>
          <SectionHeading
            eyebrow="One record, two sides"
            title="Whether you claim up or assess down, you're on the same page."
            intro="Subcontractors make claims. Head contractors assess them and issue payment schedules. Astruct puts both sides on one shared, compliant record — so nothing falls through the cracks."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {[
              {
                icon: HardHat,
                tag: 'Subcontractors',
                title: 'Make valid claims. Get paid faster.',
                href: '/subcontractors',
                points: [
                  'Generate a compliant payment claim with the right statutory endorsement',
                  'Track variations, retention and what you’re actually owed',
                  'Know the exact date a payment schedule is due back to you',
                ],
              },
              {
                icon: Building2,
                tag: 'Main contractors',
                title: 'Assess at scale. Stay inside the window.',
                href: '/main-contractors',
                points: [
                  'Receive and assess subcontractor claims in one queue',
                  'Issue payment schedules before the statutory deadline',
                  'Keep variations, retention and security straight across every contract',
                ],
              },
            ].map((c) => (
              <Link key={c.tag} href={c.href} className="site-card site-card-hover group flex flex-col p-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--site-ink)] text-white">
                    <c.icon size={19} />
                  </span>
                  <span className="font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-[var(--site-muted)]">{c.tag}</span>
                </div>
                <h3 className="mt-5 text-[24px] font-bold text-[var(--site-text)]">{c.title}</h3>
                <ul className="mt-5 flex-1 space-y-3">
                  {c.points.map((p) => (
                    <CheckItem key={p}>{p}</CheckItem>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--site-brand)]">
                  Explore {c.tag.toLowerCase()} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Compliance you can't get wrong ───────────────────────────────── */}
      <Section tone="paper">
        <Container wide>
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Compliance, by construction"
                title="The maths and the deadlines, handled."
                intro="Security of Payment is unforgiving — a missed schedule or a wrong figure has real consequences. Astruct computes the ledger the same way every time, and counts the statutory clock in business days for the jurisdiction that applies."
              />
              <ul className="mt-8 space-y-4">
                <CheckItem>Deterministic A–K ledger — original works, variations, retention, GST — to the cent.</CheckItem>
                <CheckItem>Business-day deadline engine that knows each state&apos;s public holidays.</CheckItem>
                <CheckItem>The correct statutory endorsement on every claim, automatically.</CheckItem>
              </ul>
              <Button href="/features/security-of-payment-compliance" variant="ghost" className="mt-8">
                How compliance works <ArrowRight size={16} />
              </Button>
            </div>
            <div className="space-y-5">
              <LedgerDiagram />
              <DeadlineTimeline days={10} />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Features grid ────────────────────────────────────────────────── */}
      <Section>
        <Container wide>
          <SectionHeading
            eyebrow="Everything in the payment cycle"
            title="One platform for the whole claim."
            intro="From the first progress claim to the last retention release — every document, every deadline, every jurisdiction."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => {
              const Icon = ICONS[i % ICONS.length]
              return (
                <Link key={f.href} href={f.href} className="site-card site-card-hover group p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--site-brand-tint)] text-[var(--site-brand)]">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-5 flex items-center gap-1.5 text-[17px] font-bold text-[var(--site-text)]">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[var(--site-body)]">{f.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[13.5px] font-semibold text-[var(--site-brand)]">
                    Learn more <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* ── AI panel (dark) ──────────────────────────────────────────────── */}
      <Section tone="ink" className="relative overflow-hidden">
        <div className="site-grid-bg-dark pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <Container wide className="relative grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow className="mb-3 !text-[#8aa0ff]">Artificial intelligence</Eyebrow>
            <h2 className="text-[34px] font-bold leading-tight text-white sm:text-[42px]">
              AI that reads your contract — and never touches the maths.
            </h2>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-white/70">
              Before a claim or schedule goes out, Astruct checks it against your contract and the Act — flagging a
              missing endorsement, a late response, or a variation that isn&apos;t supported. The figures stay exactly as
              computed. The judgement stays yours.
            </p>
            <ul className="mt-7 space-y-3">
              <CheckItem tone="dark">Validity checks for claims, schedules, variations, NODs and EOTs</CheckItem>
              <CheckItem tone="dark">Reads the contract in your project library for context</CheckItem>
              <CheckItem tone="dark">Advisory only — deterministic figures are never altered</CheckItem>
            </ul>
            <Button href="/features/artificial-intelligence" variant="on-dark" className="mt-8">
              See the AI in action <ArrowRight size={16} />
            </Button>
          </div>
          <div className="space-y-3">
            {[
              { icon: ShieldCheck, t: 'Endorsement present', s: 'Matches the NSW Act wording', tone: 'ok' },
              { icon: Clock, t: 'Within the statutory window', s: 'Schedule due in 10 business days', tone: 'ok' },
              { icon: Scale, t: 'Variation 12 needs support', s: 'No signed direction found in the contract', tone: 'warn' },
            ].map((c) => (
              <div key={c.t} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <span
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-lg"
                  style={{ background: c.tone === 'ok' ? 'rgba(18,160,106,.16)' : 'rgba(245,165,36,.16)' }}
                >
                  <c.icon size={18} color={c.tone === 'ok' ? '#34d399' : '#f5a524'} />
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-white">{c.t}</p>
                  <p className="text-[13px] text-white/55">{c.s}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Jurisdiction coverage ────────────────────────────────────────── */}
      <Section>
        <Container wide>
          <SectionHeading
            align="center"
            eyebrow="Every state and territory"
            title="One tool. All eight Australian jurisdictions."
            intro="Each jurisdiction has its own Act, its own timeframes and its own wording. Astruct knows the difference — so a claim in Brisbane and a claim in Perth are both right."
            className="mx-auto"
          />
          <StateCoverage className="mt-12" />
          <p className="mt-6 text-center">
            <Link href="/resources" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--site-brand)]">
              Read the Security of Payment guides <ArrowRight size={15} />
            </Link>
          </p>
        </Container>
      </Section>

      {/* ── Comparison ───────────────────────────────────────────────────── */}
      <Section tone="paper">
        <Container wide>
          <SectionHeading
            align="center"
            eyebrow="Why Astruct"
            title="Purpose-built for the Act — not a generic invoicing tool."
            className="mx-auto"
          />
          <div className="mx-auto mt-12 max-w-4xl">
            <ComparisonTable />
          </div>
        </Container>
      </Section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <Section>
        <Container wide>
          <SectionHeading eyebrow="How it works" title="From contract to payment in three steps." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { n: '01', t: 'Set up the contract', d: 'Add the contract, schedule of values and retention terms — or upload the contract and let Astruct read it.' },
              { n: '02', t: 'Make or assess a claim', d: 'Subcontractors generate a compliant claim; head contractors assess it and issue a payment schedule.' },
              { n: '03', t: 'Stay compliant', d: 'Astruct tracks the deadline, computes the ledger, and keeps the paper trail — for every jurisdiction.' },
            ].map((s) => (
              <div key={s.n} className="site-card p-7">
                <span className="font-mono text-[13px] font-semibold text-[var(--site-brand)]">{s.n}</span>
                <h3 className="mt-3 text-[20px] font-bold text-[var(--site-text)]">{s.t}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--site-body)]">{s.d}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <Section tone="paper">
        <Container wide>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="Questions" title="The things people ask first." />
            <FAQ
              items={[
                { q: 'Is Astruct compliant with the Security of Payment Act?', a: 'Astruct is built around the security-of-payment legislation in each Australian state and territory — the statutory endorsement, the business-day timeframes for payment schedules, and the way claims and variations are treated. It helps you produce compliant documents, but it is a tool, not legal advice.' },
                { q: 'Which states and territories are covered?', a: 'All eight: Queensland, New South Wales, Victoria, South Australia, Western Australia, the ACT, the Northern Territory and Tasmania. Each has its own Act and timeframes, and Astruct applies the right ones for your contract.' },
                { q: 'Do both the head contractor and subcontractor need an account?', a: 'No. You can work solo — generating and serving claims or schedules as PDFs — or invite the other party into a shared workspace so both sides work on the same record.' },
                { q: 'Does the AI change my figures?', a: 'Never. The ledger is computed deterministically and the AI is advisory only. It checks validity and flags issues; it does not alter a single number.' },
                { q: 'How much does it cost?', a: 'It is free to start on your first project, with paid plans for main contractors and subcontractors as you scale. See the pricing page for details.' },
              ]}
            />
          </div>
        </Container>
      </Section>
    </>
  )
}
