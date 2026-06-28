import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container, Section, SectionHeading } from '@/components/site/primitives'
import { PageHero, CTASection } from '@/components/site/sections'
import { Disclaimer } from '@/components/site/visuals'
import { JURISDICTIONS, resourceHref } from '@/lib/site/brand'

export const metadata = {
  title: 'Security of Payment resources',
  description:
    'Plain-English guides to the Security of Payment Act in every Australian state and territory — payment claims, schedules, timeframes and adjudication.',
}

export default function ResourcesHub() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Security of Payment, state by state."
        lede="Every Australian jurisdiction has its own Act, its own timeframes and its own wording. These plain-English guides explain how each one works — and how to make a claim that counts."
        primary="none"
      />
      <Section>
        <Container wide>
          <SectionHeading eyebrow="Choose your jurisdiction" title="Pick the state or territory your work is in." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {JURISDICTIONS.map((j) => (
              <Link key={j.code} href={resourceHref(j.code)} className="site-card site-card-hover group p-6">
                <div className="flex items-center justify-between">
                  <span className="font-display text-[24px] font-bold text-[var(--site-text)]">{j.abbr}</span>
                  <span className="site-pill h-6 text-[11px] text-[var(--site-muted)]">{j.scheduleDays} bd schedule</span>
                </div>
                <p className="mt-3 text-[14px] font-medium text-[var(--site-text)]">{j.state}</p>
                <p className="mt-1 text-[12.5px] leading-snug text-[var(--site-muted)]">{j.act.replace(/ \(.*\)$/, '')}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[var(--site-brand)]">
                  Read the guide <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
          <Disclaimer className="mt-12" />
        </Container>
      </Section>
      <CTASection />
    </>
  )
}
