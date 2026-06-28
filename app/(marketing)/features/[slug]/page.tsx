import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Container, Section, SectionHeading } from '@/components/site/primitives'
import { PageHero, Split, CardGrid, CTASection } from '@/components/site/sections'
import { FAQ, LedgerDiagram, DeadlineTimeline, StateCoverage, ComparisonTable, ClaimCardVisual, AiCardsVisual } from '@/components/site/visuals'
import { FEATURE_PAGES, FEATURE_BY_SLUG, type VisualKey } from '@/lib/site/features-content'

export function generateStaticParams() {
  return FEATURE_PAGES.map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const f = FEATURE_BY_SLUG[slug]
  if (!f) return {}
  return { title: f.navTitle, description: f.lede }
}

function Visual({ k }: { k: VisualKey }) {
  switch (k) {
    case 'ledger': return <LedgerDiagram />
    case 'timeline': return <DeadlineTimeline days={10} />
    case 'coverage': return <StateCoverage />
    case 'comparison': return <ComparisonTable />
    case 'claimCard': return <ClaimCardVisual />
    case 'aiCards': return <AiCardsVisual />
  }
}

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const f = FEATURE_BY_SLUG[slug]
  if (!f) notFound()

  return (
    <>
      <PageHero eyebrow={f.eyebrow} title={f.h1} lede={f.lede} />

      {f.splits.map((s, i) => (
        <Split
          key={i}
          eyebrow={s.eyebrow}
          title={s.title}
          body={s.body}
          points={s.points}
          reverse={s.reverse}
          tone={i % 2 === 1 ? 'paper' : 'white'}
          visual={<Visual k={s.visual} />}
        />
      ))}

      {f.cards && (
        <Section tone="paper">
          <Container wide>
            <SectionHeading eyebrow="In detail" title={f.cards.heading} intro={f.cards.intro} />
            <div className="mt-10">
              <CardGrid items={f.cards.items} />
            </div>
          </Container>
        </Section>
      )}

      <Section>
        <Container wide>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="FAQ" title="Common questions" />
            <FAQ items={f.faqs} />
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  )
}
