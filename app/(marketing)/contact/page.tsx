import { Mail, MessageSquare } from 'lucide-react'
import { Container } from '@/components/site/primitives'
import LeadForm from '@/components/site/lead-form'
import { DEMO_HREF } from '@/lib/site/brand'
import Link from 'next/link'

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with the Astruct team — questions about claims, schedules, pricing or your account.',
}

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="site-grid-bg pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_60%)]" />
      <Container wide className="relative grid gap-12 py-16 lg:grid-cols-2 lg:py-20">
        <div className="site-fade">
          <p className="site-eyebrow mb-4">Contact</p>
          <h1 className="text-[40px] font-bold leading-[1.05] tracking-tight text-[var(--site-text)] sm:text-[48px]">
            Talk to us.
          </h1>
          <p className="mt-5 max-w-md text-[18px] leading-relaxed text-[var(--site-body)]">
            Questions about Security of Payment, your claims, or how Astruct fits your business? We&apos;re happy to help.
          </p>
          <div className="mt-8 space-y-4">
            <a href="mailto:support@astruct.io" className="flex items-center gap-3 text-[15px] text-[var(--site-body)] hover:text-[var(--site-text)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--site-brand-tint)] text-[var(--site-brand)]"><Mail size={18} /></span>
              support@astruct.io
            </a>
            <Link href={DEMO_HREF} className="flex items-center gap-3 text-[15px] text-[var(--site-body)] hover:text-[var(--site-text)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--site-brand-tint)] text-[var(--site-brand)]"><MessageSquare size={18} /></span>
              Prefer a walkthrough? Book a demo
            </Link>
          </div>
        </div>
        <div className="lg:pt-8">
          <LeadForm type="contact" source="contact" />
        </div>
      </Container>
    </section>
  )
}
