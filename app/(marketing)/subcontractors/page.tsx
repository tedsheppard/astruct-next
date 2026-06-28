import { Container, Section, SectionHeading } from '@/components/site/primitives'
import { PageHero, Split, CardGrid, CTASection } from '@/components/site/sections'
import { FAQ, ClaimCardVisual, LedgerDiagram, DeadlineTimeline } from '@/components/site/visuals'

export const metadata = {
  title: 'For subcontractors',
  description:
    'Make valid payment claims with the right statutory endorsement, track variations and retention, and know exactly when a payment schedule is due back to you.',
}

export default function SubcontractorsPage() {
  return (
    <>
      <PageHero
        eyebrow="For subcontractors"
        title="Make valid claims. Get paid faster."
        lede="The Security of Payment Act exists to get you paid. Astruct makes sure your claim qualifies under it — the right endorsement, the right figures — and tells you exactly when the other side has to respond."
      />

      <Split
        eyebrow="A claim, not just an invoice"
        title="Qualify under the Act, every time"
        body="An invoice is easy to ignore. A payment claim under the Act starts a clock. Astruct adds the correct statutory endorsement and the detail your claim needs, so it counts."
        points={[
          'Jurisdiction-correct statutory endorsement applied automatically',
          'Reference date, claimed amount and works described properly',
          'A professional PDF ready to serve',
        ]}
        visual={<ClaimCardVisual />}
      />

      <Split
        reverse
        tone="paper"
        eyebrow="Claim what you’re owed"
        title="Every dollar in the ledger"
        body="Claim progressively against your schedule of values, add variations, and account for retention — Astruct does the maths and shows the net amount you’re actually owed this period."
        points={[
          'Claim by percentage complete or dollar value',
          'Approved and unapproved variations both tracked',
          'Retention withheld and released computed for you',
        ]}
        visual={<LedgerDiagram />}
      />

      <Split
        eyebrow="Know your dates"
        title="When must they respond?"
        body="Once you serve a claim, the other side has a set number of business days to give a payment schedule. Astruct tells you the exact date — so you know the moment your position strengthens."
        points={[
          'The schedule deadline calculated for your jurisdiction',
          'Know when non-payment becomes a debt you can pursue',
          'A clear record of what you served and when',
        ]}
        visual={<DeadlineTimeline days={10} />}
      />

      <Section tone="paper">
        <Container wide>
          <SectionHeading eyebrow="Why subcontractors choose Astruct" title="The Act, working for you." />
          <div className="mt-10">
            <CardGrid
              items={[
                { title: 'Faster claims', body: 'Generate a compliant claim in minutes instead of fighting a spreadsheet.' },
                { title: 'Right first time', body: 'The endorsement and figures the Act expects, applied for you.' },
                { title: 'Variations captured', body: 'Nothing left unclaimed — approved and unapproved variations tracked.' },
                { title: 'Deadlines visible', body: 'Know when a schedule is due and when you can act on non-payment.' },
                { title: 'Works solo', body: 'Serve PDFs to anyone, or share a workspace with your head contractor.' },
                { title: 'Free to start', body: 'Free for your first project, no credit card required.' },
              ]}
            />
          </div>
        </Container>
      </Section>

      <Section>
        <Container wide>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="FAQ" title="Questions from subcontractors" />
            <FAQ
              items={[
                { q: 'Will my claim be valid under the Act?', a: 'Astruct builds your claim with the statutory endorsement, reference date, claimed amount and a description of the works — the things that make it a payment claim rather than a plain invoice. It is a tool to help you comply, not legal advice.' },
                { q: 'Do I need the head contractor to use Astruct too?', a: 'No. You can generate and serve claims as PDFs to anyone. If your head contractor is also on Astruct, you can share a workspace and work on the same record.' },
                { q: 'When can I chase payment?', a: 'If no payment schedule is provided in time, the claimed amount typically becomes a debt due. Astruct tracks the deadline so you know exactly when that point is reached.' },
                { q: 'Is it really free to start?', a: 'Yes — free for your first project with no credit card. Paid plans cover more projects and claims as you grow.' },
              ]}
            />
          </div>
        </Container>
      </Section>

      <CTASection title="Make your next claim the easy way." body="Start free on your first project — compliant claim, correct figures, no spreadsheet." />
    </>
  )
}
