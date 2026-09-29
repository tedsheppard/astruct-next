import type { Metadata } from 'next'
import Link from 'next/link'
import { IArrow } from '@/components/mk/icons'
import { CONTACT_EMAIL, SIGNUP_URL } from '@/components/mk/links'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Email the Astruct team at ${CONTACT_EMAIL}.`,
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <section className="mk-page-head" style={{ paddingBottom: 'clamp(120px, 16vw, 220px)' }}>
      <div className="mk-wrap">
        <span className="mk-kicker">Contact</span>
        <h1 className="mk-h2">Write to the Astruct team.</h1>
        <p className="mk-lede">Questions about the product, the pilot, security or billing. We reply within two business days.</p>
        <p style={{ marginTop: 48 }}>
          <a className="mk-contact-mail" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
        <div className="mk-cta-row" style={{ marginTop: 64 }}>
          <a className="mk-btn" href={SIGNUP_URL}>Start free trial</a>
          <Link className="mk-link" href="/apply">Apply for the private pilot<IArrow /></Link>
        </div>
      </div>
    </section>
  )
}
