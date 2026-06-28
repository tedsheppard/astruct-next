import Link from 'next/link'
import { ArrowRight, ShieldCheck, FileText, Clock, Scale, Bell, Lock, Sparkles } from 'lucide-react'
import { Container, Section, SectionHeading } from '@/components/site/primitives'
import { PageHero, CTASection } from '@/components/site/sections'
import { FEATURE_PAGES } from '@/lib/site/features-content'

export const metadata = {
  title: 'Features',
  description: 'Everything in the security-of-payment cycle — claims, schedules, variations, notices, retention and AI validity checks.',
}

const ICONS = [ShieldCheck, FileText, Clock, Scale, Bell, Lock, Sparkles]

export default function FeaturesHub() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title="One platform for the whole payment cycle."
        lede="From the first progress claim to the last retention release — every document, every deadline, every Australian jurisdiction."
      />
      <Section>
        <Container wide>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURE_PAGES.map((f, i) => {
              const Icon = ICONS[i % ICONS.length]
              return (
                <Link key={f.slug} href={`/features/${f.slug}`} className="site-card site-card-hover group p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--site-brand-tint)] text-[var(--site-brand)]">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-5 text-[19px] font-bold text-[var(--site-text)]">{f.navTitle}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--site-body)]">{f.lede}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--site-brand)]">
                    Learn more <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              )
            })}
          </div>
        </Container>
      </Section>
      <CTASection />
    </>
  )
}
