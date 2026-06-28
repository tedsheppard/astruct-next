import { Container, Section, SectionHeading } from '@/components/site/primitives'
import { PageHero, Split, CardGrid, CTASection } from '@/components/site/sections'
import { FAQ, DeadlineTimeline, LedgerDiagram, AiCardsVisual } from '@/components/site/visuals'

export const metadata = {
  title: 'For main contractors',
  description:
    'Assess subcontractor payment claims, issue compliant payment schedules inside the statutory window, and keep variations, retention and security straight across every contract.',
}

export default function MainContractorsPage() {
  return (
    <>
      <PageHero
        eyebrow="For main contractors"
        title="Assess at scale. Stay inside the window."
        lede="Head contractors carry the compliance risk on the way down the chain. Astruct gives you one queue for every subcontractor claim, the deadline tracked to the day, and a defensible payment schedule every time."
        primary="demo"
        primaryLabel="Book a demo"
      />

      <Split
        eyebrow="One assessment queue"
        title="Every claim in one place"
        body="Receive payment claims from every subcontractor into a single queue. See what has landed, what has been scheduled, and what is approaching its deadline — across all your contracts."
        points={[
          'All incoming claims in one view, across every contract',
          'See the scheduled, paid and outstanding position at a glance',
          'Assign and track who is assessing what',
        ]}
        visual={<LedgerDiagram />}
      />

      <Split
        reverse
        tone="paper"
        eyebrow="Never miss a deadline"
        title="The statutory clock, handled"
        body="Miss a payment schedule and you can become liable for the full claimed amount. Astruct counts the business-day window for each jurisdiction and surfaces what is due, well before it is."
        points={[
          'Business-day countdown per jurisdiction, holidays excluded',
          'Clear alerts as a schedule deadline approaches',
          'Issue on time and keep control of what gets paid',
        ]}
        visual={<DeadlineTimeline days={10} />}
      />

      <Split
        eyebrow="Defensible schedules"
        title="Reasons that stand up"
        body="Certify each line in full, in part, or not at all, with the reason recorded. If a matter goes to adjudication, your schedule already sets out the amount proposed and why."
        points={[
          'Line-by-line certification with reasons for withholding',
          'Variations and retention assessed in the same ledger',
          'AI checks the schedule for completeness before it is issued',
        ]}
        visual={<AiCardsVisual />}
      />

      <Section tone="paper">
        <Container wide>
          <SectionHeading eyebrow="Why head contractors choose Astruct" title="Compliance risk, contained." />
          <div className="mt-10">
            <CardGrid
              items={[
                { title: 'Across every jurisdiction', body: 'Run contracts in any state or territory — the right Act and timeframes apply automatically.' },
                { title: 'Variations under control', body: 'Approved and unapproved variations tracked separately, assessed transparently.' },
                { title: 'Retention & security', body: 'A running position on retention withheld, released and held as security.' },
                { title: 'Shared records', body: 'Invite subcontractors into a shared workspace, or assess claims you receive as PDFs.' },
                { title: 'An audit trail', body: 'Every claim, schedule and reason recorded — defensible if challenged.' },
                { title: 'Free to trial', body: 'Start on a single contract and scale up as your project grows.' },
              ]}
            />
          </div>
        </Container>
      </Section>

      <Section>
        <Container wide>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="FAQ" title="Questions from head contractors" />
            <FAQ
              items={[
                { q: 'Do my subcontractors need an account?', a: 'No. You can assess claims you receive as PDFs, or invite subcontractors into a shared workspace so both sides work on the same record. Either way works.' },
                { q: 'Can I run contracts in multiple states?', a: 'Yes. Astruct applies the correct Act and statutory timeframes for the jurisdiction of each contract, so a Brisbane job and a Perth job are both handled correctly.' },
                { q: 'What happens if I miss a schedule deadline?', a: 'Under most Acts you can become liable for the full claimed amount. Astruct tracks the business-day window and alerts you before the deadline so it is not missed by accident.' },
                { q: 'How does pricing work for head contractors?', a: 'There are plans scaled to the number of contracts and users you run, with custom enterprise pricing for larger builders. See the pricing page or book a demo.' },
              ]}
            />
          </div>
        </Container>
      </Section>

      <CTASection title="See Astruct on your own contracts." body="Book a walkthrough and we’ll show you the assessment queue, the deadline tracker and the ledger." />
    </>
  )
}
