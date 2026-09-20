'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { startFreeHref, DEMO_HREF } from '@/lib/site/brand'

// The plans, with the audience switch above them. The tiers, their prices
// and what is in them are unchanged; only the dress is new.
type Tier = { name: string; price: string; cadence?: string; blurb: string; cta: string; href: 'start' | 'demo'; featured?: boolean; features: string[] }

const SUB_TIERS: Tier[] = [
  { name: 'Free', price: '$0', blurb: 'For your first project. Make compliant claims and get paid.', cta: 'Start your free trial', href: 'start', features: ['1 active project', 'Compliant payment claims', 'Statutory endorsement and deadlines', 'PDF generation and serving', 'Variations and retention tracking'] },
  { name: 'Pro', price: '$—', cadence: '/month', blurb: 'For busy subcontractors running multiple jobs.', cta: 'Start your free trial', href: 'start', featured: true, features: ['Unlimited projects and claims', 'AI validity checks', 'Project document library', 'Priority email support', 'Everything in Free'] },
  { name: 'Enterprise', price: 'Custom', blurb: 'For larger trade businesses and groups.', cta: 'Talk to us', href: 'demo', features: ['Multiple users and teams', 'Custom onboarding', 'Volume pricing', 'Dedicated support', 'Everything in Pro'] },
]

const MC_TIERS: Tier[] = [
  { name: 'Starter', price: '$—', cadence: '/month', blurb: 'For smaller builders assessing a handful of contracts.', cta: 'Book a demo', href: 'demo', features: ['Assess incoming claims', 'Issue compliant payment schedules', 'Business-day deadline tracking', 'Variations and retention', 'Up to a set number of contracts'] },
  { name: 'Business', price: '$—', cadence: '/month', blurb: 'For head contractors running projects at scale.', cta: 'Book a demo', href: 'demo', featured: true, features: ['Unlimited contracts and claims', 'Shared workspaces with subcontractors', 'AI validity checks', 'Multiple assessors and roles', 'Audit trail and exports'] },
  { name: 'Enterprise', price: 'Custom', blurb: 'For Tier 1 and 2 builders with bespoke needs.', cta: 'Talk to us', href: 'demo', features: ['Custom contract and user volumes', 'SSO and advanced controls', 'Dedicated onboarding and support', 'Custom integrations', 'Everything in Business'] },
]

export default function Plans() {
  const [aud, setAud] = useState<'sub' | 'mc'>('sub')
  const tiers = aud === 'sub' ? SUB_TIERS : MC_TIERS

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
        <div className="ax-switch" role="group" aria-label="Who the plans are for">
          {([['sub', 'Subcontractors'], ['mc', 'Main contractors']] as const).map(([k, label]) => (
            <button key={k} type="button" aria-pressed={aud === k} onClick={() => setAud(k)}>{label}</button>
          ))}
        </div>
      </div>

      <div className="ax-plans">
        {tiers.map((t) => (
          <article key={t.name} className={t.featured ? 'ax-plan ax-plan-feat' : 'ax-plan'}>
            <div className="ax-plan-top">
              <h3>{t.name}</h3>
              {t.featured && <span className="ax-pill"><i />Most popular</span>}
            </div>
            <div className="ax-plan-price">
              <b>{t.price}</b>
              {t.cadence && <span>{t.cadence}</span>}
            </div>
            <p className="ax-plan-blurb">{t.blurb}</p>
            {t.href === 'start' ? (
              <a href={startFreeHref()} className={t.featured ? 'ax-btn ax-btn-primary' : 'ax-btn ax-btn-ghost'}>{t.cta}</a>
            ) : (
              <Link href={DEMO_HREF} className={t.featured ? 'ax-btn ax-btn-primary' : 'ax-btn ax-btn-ghost'}>{t.cta}</Link>
            )}
            <ul className="ax-plan-feats">
              {t.features.map((f) => <li key={f}><Check size={16} />{f}</li>)}
            </ul>
          </article>
        ))}
      </div>

      <p className="ax-fine ax-plan-note">
        Prices shown as &ldquo;$&mdash;&rdquo; are being finalised. <Link href={DEMO_HREF}>Talk to us</Link> for current pricing.
      </p>
    </>
  )
}
