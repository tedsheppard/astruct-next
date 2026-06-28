import { Container, Section, SectionHeading } from '@/components/site/primitives'
import { PageHero, CardGrid, CTASection } from '@/components/site/sections'

export const metadata = {
  title: 'About',
  description: 'Astruct is Security of Payment software built for Australian construction — made by people who know the Act.',
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Built for the people who build."
        lede="Astruct exists to make security of payment work the way it was meant to — getting the people who do the work paid, on time, under the Act."
        primary="none"
      />

      <Section>
        <Container wide>
          <div className="grid gap-12 lg:grid-cols-2">
            <SectionHeading eyebrow="Why we exist" title="Payment shouldn’t be the hardest part of the job." />
            <div className="space-y-4 text-[16px] leading-relaxed text-[var(--site-body)]">
              <p>
                Australia’s security-of-payment laws give everyone in the construction chain a right to be paid for the
                work they do. But the process is technical and unforgiving — the wrong wording, a missed deadline, or a
                figure that doesn’t add up can cost real money.
              </p>
              <p>
                Astruct turns that complexity into software. Claims and schedules that are compliant by construction.
                Deadlines counted to the day. A ledger that computes the same way every time. And AI that checks the work
                without ever touching the maths.
              </p>
              <p>
                We build for both sides of the chain — the subcontractor making a claim, and the head contractor
                assessing it — because getting paid fairly is in everyone’s interest.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="paper">
        <Container wide>
          <SectionHeading eyebrow="What we believe" title="The principles behind the product." />
          <div className="mt-10">
            <CardGrid
              items={[
                { title: 'Compliance by construction', body: 'The rules of the Act should be built into the tool, not left to chance or memory.' },
                { title: 'Deterministic maths', body: 'The same inputs always produce the same figure. AI advises; it never changes a number.' },
                { title: 'Both sides matter', body: 'A fair payment system works for the claimant and the assessor. We build for both.' },
                { title: 'Every jurisdiction', body: 'Australian construction crosses borders. The right Act should apply automatically.' },
                { title: 'Plain English', body: 'The law is complex. The software shouldn’t be. Clear documents, clear deadlines.' },
                { title: 'Made in Australia', body: 'Built here, for the Australian Acts and the way our industry actually works.' },
              ]}
            />
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  )
}
