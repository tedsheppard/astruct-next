import { Container } from '@/components/site/primitives'
import { CheckItem } from '@/components/site/primitives'
import LeadForm from '@/components/site/lead-form'

export const metadata = {
  title: 'Book a demo',
  description: 'See Astruct on your own contracts — a guided walkthrough of compliant claims, payment schedules and the deadline engine.',
}

export default function BookDemoPage() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="site-grid-bg pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_60%)]" />
      <Container wide className="relative grid gap-12 py-16 lg:grid-cols-2 lg:py-20">
        <div className="site-fade">
          <p className="site-eyebrow mb-4">Book a demo</p>
          <h1 className="text-[40px] font-bold leading-[1.05] tracking-tight text-[var(--site-text)] sm:text-[48px]">
            See Astruct on your own contracts.
          </h1>
          <p className="mt-5 max-w-md text-[18px] leading-relaxed text-[var(--site-body)]">
            A 30-minute walkthrough, tailored to whether you make claims or assess them. No obligation.
          </p>
          <ul className="mt-8 space-y-3">
            <CheckItem>The compliant claim and payment schedule flow, end to end</CheckItem>
            <CheckItem>The business-day deadline engine for your jurisdiction</CheckItem>
            <CheckItem>The A–K ledger, variations, retention and AI validity checks</CheckItem>
            <CheckItem>How shared workspaces work between head contractor and subbie</CheckItem>
          </ul>
        </div>
        <div className="lg:pt-8">
          <LeadForm type="demo" source="book-a-demo" />
        </div>
      </Container>
    </section>
  )
}
