'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Container, Section, SectionHeading } from '@/components/site/primitives'
import { CTASection } from '@/components/site/sections'
import { FAQ } from '@/components/site/visuals'
import { cn } from '@/lib/utils'
import { startFreeHref, DEMO_HREF } from '@/lib/site/brand'

type Tier = { name: string; price: string; cadence?: string; blurb: string; cta: string; href: string; featured?: boolean; features: string[] }

const SUB_TIERS: Tier[] = [
  { name: 'Free', price: '$0', blurb: 'For your first project. Make compliant claims and get paid.', cta: 'Start free', href: 'start', features: ['1 active project', 'Compliant payment claims', 'Statutory endorsement & deadlines', 'PDF generation & serving', 'Variations & retention tracking'] },
  { name: 'Pro', price: '$—', cadence: '/month', blurb: 'For busy subcontractors running multiple jobs.', cta: 'Start free', href: 'start', featured: true, features: ['Unlimited projects & claims', 'AI validity checks', 'Project document library', 'Priority email support', 'Everything in Free'] },
  { name: 'Enterprise', price: 'Custom', blurb: 'For larger trade businesses and groups.', cta: 'Talk to us', href: 'demo', features: ['Multiple users & teams', 'Custom onboarding', 'Volume pricing', 'Dedicated support', 'Everything in Pro'] },
]

const MC_TIERS: Tier[] = [
  { name: 'Starter', price: '$—', cadence: '/month', blurb: 'For smaller builders assessing a handful of contracts.', cta: 'Book a demo', href: 'demo', features: ['Assess incoming claims', 'Issue compliant payment schedules', 'Business-day deadline tracking', 'Variations & retention', 'Up to a set number of contracts'] },
  { name: 'Business', price: '$—', cadence: '/month', blurb: 'For head contractors running projects at scale.', cta: 'Book a demo', href: 'demo', featured: true, features: ['Unlimited contracts & claims', 'Shared workspaces with subcontractors', 'AI validity checks', 'Multiple assessors & roles', 'Audit trail & exports'] },
  { name: 'Enterprise', price: 'Custom', blurb: 'For Tier 1 and 2 builders with bespoke needs.', cta: 'Talk to us', href: 'demo', features: ['Custom contract & user volumes', 'SSO & advanced controls', 'Dedicated onboarding & support', 'Custom integrations', 'Everything in Business'] },
]

export default function PricingPage() {
  const [aud, setAud] = useState<'sub' | 'mc'>('sub')
  const tiers = aud === 'sub' ? SUB_TIERS : MC_TIERS

  return (
    <>
      <Section className="!pb-10 !pt-16">
        <Container wide>
          <div className="mx-auto max-w-2xl text-center">
            <SectionHeading align="center" eyebrow="Pricing" title="Simple pricing for both sides of the chain." intro="Free to start. Plans scale with the work you do — whether you make claims or assess them." className="mx-auto" />
            {/* Toggle */}
            <div className="mt-8 inline-flex rounded-full border border-[var(--site-line)] bg-[var(--site-paper)] p-1">
              {([['sub', 'Subcontractors'], ['mc', 'Main contractors']] as const).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setAud(k)}
                  className={cn(
                    'rounded-full px-5 py-2 text-[14px] font-semibold transition-colors',
                    aud === k ? 'bg-white text-[var(--site-text)] shadow-sm' : 'text-[var(--site-muted)] hover:text-[var(--site-text)]',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {tiers.map((t) => (
              <div key={t.name} className={cn('site-card flex flex-col p-7', t.featured && 'ring-2 ring-[var(--site-brand)]')}>
                {t.featured && <span className="mb-3 inline-flex w-fit items-center rounded-full bg-[var(--site-brand-tint)] px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-[var(--site-brand-700)]">Most popular</span>}
                <h3 className="text-[20px] font-bold text-[var(--site-text)]">{t.name}</h3>
                <div className="mt-3 flex items-end gap-1">
                  <span className="font-display text-[36px] font-bold tracking-tight text-[var(--site-text)]">{t.price}</span>
                  {t.cadence && <span className="mb-1.5 text-[14px] text-[var(--site-muted)]">{t.cadence}</span>}
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--site-body)]">{t.blurb}</p>
                {t.href === 'start' ? (
                  <a href={startFreeHref()} className={cn('site-btn mt-5 w-full', t.featured ? 'site-btn-primary' : 'site-btn-ghost')}>{t.cta}</a>
                ) : (
                  <Link href={DEMO_HREF} className={cn('site-btn mt-5 w-full', t.featured ? 'site-btn-primary' : 'site-btn-ghost')}>{t.cta}</Link>
                )}
                <ul className="mt-6 space-y-2.5 border-t border-[var(--site-line)] pt-6">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[14px] text-[var(--site-body)]">
                      <Check size={17} className="mt-0.5 flex-none text-[var(--site-green)]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-[13px] text-[var(--site-muted)]">
            Prices shown as “$—” are being finalised. <Link href={DEMO_HREF} className="font-semibold text-[var(--site-brand)]">Talk to us</Link> for current pricing.
          </p>
        </Container>
      </Section>

      <Section tone="paper">
        <Container wide>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="FAQ" title="Pricing questions" />
            <FAQ
              items={[
                { q: 'Is there really a free plan?', a: 'Yes — subcontractors can start free on their first project, with no credit card. It includes compliant claims, the statutory endorsement and deadline tracking.' },
                { q: 'How is pricing structured for head contractors?', a: 'Head-contractor plans scale with the number of contracts and assessors you run, with custom enterprise pricing for larger builders. Book a demo and we’ll size it to your projects.' },
                { q: 'Can I change plans later?', a: 'Yes — you can upgrade or change plans as your needs change.' },
                { q: 'Do both parties pay?', a: 'Each organisation has its own plan. A subcontractor on the free plan can still work in a shared workspace created by a head contractor.' },
              ]}
            />
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  )
}
