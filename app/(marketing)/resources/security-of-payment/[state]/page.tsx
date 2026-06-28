import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ChevronRight } from 'lucide-react'
import { Container, Section, SectionHeading, Pill } from '@/components/site/primitives'
import { CTASection } from '@/components/site/sections'
import { FAQ, DeadlineTimeline, Disclaimer } from '@/components/site/visuals'
import { JURISDICTIONS, resourceHref } from '@/lib/site/brand'
import { SOPA_CONTENT } from '@/lib/site/sopa-content'

export function generateStaticParams() {
  return JURISDICTIONS.map((j) => ({ state: j.code }))
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await params
  const j = JURISDICTIONS.find((x) => x.code === state)
  if (!j) return {}
  return {
    title: `Security of Payment in ${j.state} — a plain-English guide`,
    description: `How the ${j.act} works: payment claims, payment schedules, timeframes and adjudication in ${j.state}.`,
  }
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params
  const j = JURISDICTIONS.find((x) => x.code === state)
  const c = SOPA_CONTENT[state]
  if (!j || !c) notFound()

  const facts: { k: string; v: string }[] = [
    { k: 'Legislation', v: j.act },
    { k: 'Model', v: c.model === 'east' ? 'East Coast (claim → schedule → adjudication)' : 'West Coast (implied terms → payment dispute → adjudication)' },
    ...(c.scheduleDays ? [{ k: 'Payment schedule due', v: `${c.scheduleDays} business days` }] : []),
    ...(c.claimWindow ? [{ k: 'Claim window', v: `Up to ${c.claimWindow} after the work` }] : []),
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="site-grid-bg pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_65%)]" />
        <Container wide className="relative py-14 sm:py-16">
          <nav className="flex items-center gap-1.5 text-[13px] text-[var(--site-muted)]">
            <Link href="/resources" className="hover:text-[var(--site-text)]">Resources</Link>
            <ChevronRight size={14} />
            <span className="text-[var(--site-text)]">Security of Payment · {j.abbr}</span>
          </nav>
          <div className="mt-5 max-w-3xl site-fade">
            <Pill tint className="mb-4">{j.abbr} · Security of Payment</Pill>
            <h1 className="text-[36px] font-bold leading-[1.05] tracking-tight text-[var(--site-text)] sm:text-[48px]">
              Security of Payment in {j.state}
            </h1>
            <p className="mt-5 text-[18px] leading-relaxed text-[var(--site-body)]">{c.intro}</p>
          </div>
        </Container>
      </section>

      {/* Key facts */}
      <Section tone="paper" className="!py-12">
        <Container wide>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--site-line)] bg-[var(--site-line)] sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((f) => (
              <div key={f.k} className="bg-white p-5">
                <p className="font-mono text-[11px] uppercase tracking-wide text-[var(--site-muted)]">{f.k}</p>
                <p className="mt-2 text-[14px] font-medium leading-snug text-[var(--site-text)]">{f.v}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Who it applies to + endorsement */}
      <Section className="!pt-16 !pb-10">
        <Container wide>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow="Scope" title="Who and what it covers" intro={c.whoApplies} />
            </div>
            <div className="site-card p-6">
              <p className="font-mono text-[11px] uppercase tracking-wide text-[var(--site-brand)]">Statutory endorsement</p>
              {c.model === 'east' ? (
                <p className="mt-3 rounded-lg border border-[var(--site-line)] bg-[var(--site-paper)] px-4 py-3 text-[13.5px] italic leading-snug text-[var(--site-body)]">
                  “{j.endorsement}”
                </p>
              ) : null}
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--site-body)]">{c.endorsementNote}</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* How it works */}
      {c.model === 'east' && (
        <Section tone="paper" className="!py-14">
          <Container wide>
            <SectionHeading eyebrow="How it works" title="Claim, schedule, adjudicate" intro="The East Coast model runs on tight timeframes. Miss one and the consequences are real." />
            <DeadlineTimeline days={c.scheduleDays ?? 10} className="mt-10" />
          </Container>
        </Section>
      )}

      {/* State-specific notes */}
      <Section className="!py-16">
        <Container wide>
          <SectionHeading eyebrow="Key points" title={`What to watch in ${j.state}`} />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {c.notes.map((n) => (
              <div key={n.title} className="site-card p-6">
                <h3 className="text-[17px] font-bold text-[var(--site-text)]">{n.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--site-body)]">{n.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Adjudication */}
      <Section tone="paper" className="!py-14">
        <Container wide>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="If you’re not paid" title="Adjudication" />
            <p className="text-[16px] leading-relaxed text-[var(--site-body)]">{c.adjudication}</p>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section className="!py-16">
        <Container wide>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="FAQ" title={`${j.abbr} questions`} />
            <FAQ items={c.faqs} />
          </div>
          <Disclaimer className="mt-12" />
          {/* Other jurisdictions */}
          <div className="mt-10">
            <p className="font-mono text-[11px] uppercase tracking-wide text-[var(--site-muted)]">Other jurisdictions</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {JURISDICTIONS.filter((x) => x.code !== j.code).map((x) => (
                <Link key={x.code} href={resourceHref(x.code)} className="site-pill site-card-hover">
                  {x.abbr}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <CTASection
        title={`Make compliant ${j.abbr} claims with Astruct.`}
        body="Astruct applies the right timeframes and wording for your jurisdiction — free to start."
      />
    </>
  )
}
