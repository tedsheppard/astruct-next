import type { Metadata } from 'next'
import Link from 'next/link'
import { Mark, Wordmark } from '@/components/mk/mark'
import TrialRequestForm from '@/components/mk/trial-request-form'
import { MetaPixel } from '@/components/mk/client-bits'
import { CONTACT_EMAIL, CTA_LABEL, LOGIN_URL, TRIAL_LINE } from '@/components/mk/links'
import '../../(marketing)/mk.css'
import './request-trial.css'

// Every "Request a free trial" on the site lands here. The form writes to the
// leads table (app/api/waitlist); Ted reads the request and sends the invite.
export const metadata: Metadata = {
  title: `${CTA_LABEL} · Astruct`,
  description: `${TRIAL_LINE} Leave your details and we will email you an invite link to Astruct, AI for construction.`,
  alternates: { canonical: '/request-trial' },
  robots: { index: true, follow: true },
}

export default function RequestTrialPage() {
  return (
    <div className="mk wl">
      <div className="mk-field wl-field" aria-hidden="true"><i /><i /><i /><i /></div>
      <main className="wl-main">
        <Link href="/" className="mk-brand wl-brand" aria-label="Astruct home">
          <Mark />
          <Wordmark />
        </Link>
        <h1 className="wl-h">{CTA_LABEL}.</h1>
        <p className="wl-p">{TRIAL_LINE}</p>
        <p className="wl-p">Leave your details and we&rsquo;ll email you an invite link.</p>
        <div className="mk-lg wl-card">
          <TrialRequestForm />
        </div>
        <p className="wl-foot">
          Already have an account? <a className="mk-link" href={LOGIN_URL}>Log in</a>
          <span className="wl-dot" aria-hidden="true">·</span>
          <a className="mk-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </main>
      <MetaPixel />
    </div>
  )
}
