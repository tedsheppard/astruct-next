import type { Metadata } from 'next'
import Link from 'next/link'
import { Wordmark } from '@/components/mk/mark'
import WaitlistForm from '@/components/mk/waitlist-form'
import WaitlistReveal from '@/components/mk/waitlist-reveal'
import { MetaPixel } from '@/components/mk/client-bits'
import { LOGIN_URL, CONTACT_EMAIL } from '@/components/mk/links'
import '../../(marketing)/mk.css'
import './waitlist.css'

export const metadata: Metadata = {
  title: 'Join the waitlist · Astruct',
  description: 'Astruct is onboarding customers in stages. Join the waitlist and we will email you when your place is ready.',
  alternates: { canonical: '/signup-waitlist' },
  robots: { index: false, follow: true },
}

export default function SignupWaitlistPage() {
  return (
    <div className="mk wl">
      <div className="mk-field wl-field" aria-hidden="true"><i /><i /><i /><i /></div>
      <noscript><style>{'.wl-skel{display:none!important}.wl-real[hidden]{display:block!important}'}</style></noscript>
      <WaitlistReveal>
      <main className="wl-main">
        <Link href="/" className="mk-brand wl-brand" aria-label="Astruct home">
          <Wordmark />
        </Link>
        <time className="wl-date" dateTime="2026-09-30">30 September 2026</time>
        <h1 className="wl-h">Sign-ups are paused while we onboard.</h1>
        <p className="wl-p">
          Astruct has had substantial interest and we are onboarding a number of customers now. So that every team gets a
          proper start, we are not taking instant sign-ups at the moment.
        </p>
        <p className="wl-p">Leave your details and we&rsquo;ll add you to the waitlist. We hope to onboard you soon.</p>
        <div className="mk-lg wl-card">
          <WaitlistForm />
        </div>
        <p className="wl-foot">
          Already have an account? <a className="mk-link" href={LOGIN_URL}>Log in</a>
          <span className="wl-dot" aria-hidden="true">·</span>
          <a className="mk-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </main>
      </WaitlistReveal>
      <MetaPixel />
    </div>
  )
}
