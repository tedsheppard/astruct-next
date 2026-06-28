import Link from 'next/link'
import { Mail, MessageSquare, BookOpen, ArrowRight } from 'lucide-react'
import { Container, Section, SectionHeading } from '@/components/site/primitives'
import { PageHero } from '@/components/site/sections'
import { FAQ } from '@/components/site/visuals'
import { CONTACT_HREF, DEMO_HREF } from '@/lib/site/brand'

export const metadata = {
  title: 'Support',
  description: 'Get help with Astruct — contact support, book a walkthrough, or read the Security of Payment guides.',
}

export default function SupportPage() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="We’re here to help."
        lede="Whether you’re setting up your first contract or assessing claims at scale, we’ll help you get it right."
        primary="none"
      />

      <Section className="!pt-10">
        <Container wide>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Mail, title: 'Contact support', body: 'Questions about your account, claims or schedules. We reply fast.', href: CONTACT_HREF, cta: 'Get in touch' },
              { icon: MessageSquare, title: 'Book a walkthrough', body: 'See Astruct on your own contracts with a guided demo.', href: DEMO_HREF, cta: 'Book a demo' },
              { icon: BookOpen, title: 'Read the guides', body: 'Plain-English Security of Payment guides for every jurisdiction.', href: '/resources', cta: 'Browse resources' },
            ].map((c) => (
              <Link key={c.title} href={c.href} className="site-card site-card-hover group p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--site-brand-tint)] text-[var(--site-brand)]">
                  <c.icon size={20} />
                </span>
                <h3 className="mt-5 text-[18px] font-bold text-[var(--site-text)]">{c.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--site-body)]">{c.body}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[var(--site-brand)]">
                  {c.cta} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="paper">
        <Container wide>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="FAQ" title="Common support questions" />
            <FAQ
              items={[
                { q: 'How do I get started?', a: 'Create a free account, add your first contract with its schedule of values and retention terms, and make your first claim. The setup takes minutes.' },
                { q: 'Can you help me migrate existing contracts?', a: 'Yes. For larger setups we offer guided onboarding — book a demo and we’ll help you bring your contracts across.' },
                { q: 'How do I invite the other party?', a: 'From a workspace, invite the head contractor or subcontractor by email. They can accept and work on the same shared record.' },
                { q: 'Where can I learn how the Act works?', a: 'Our Resources section has a plain-English guide for every Australian state and territory, covering claims, schedules, timeframes and adjudication.' },
              ]}
            />
          </div>
        </Container>
      </Section>
    </>
  )
}
