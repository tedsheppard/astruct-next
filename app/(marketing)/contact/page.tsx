/**
 * Contact. The ways to reach a person on the left, the form on the right.
 * Same fields and the same /api/leads route as before.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, MessageSquare } from 'lucide-react'
import { AxRoot, AxHeader, AxFooter } from '@/components/site/ax-chrome'
import AxLeadForm from '@/components/site/ax-lead-form'
import { DEMO_HREF } from '@/lib/site/brand'
import '../landing/landing.css'
import '../ax-pages.css'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Astruct team about claims, schedules, pricing or your account.',
}

export default function ContactPage() {
  return (
    <AxRoot>
      <AxHeader />

      <section className="ax-sec ax-sec-first is-in">
        <div className="ax-split-form">
          <div>
            <div className="ax-page-head" style={{ marginBottom: 0 }}>
              <span className="ax-pill"><i />Contact</span>
              <h1>Talk to us.</h1>
              <p className="ax-lede">Questions about Security of Payment, your claims, or how Astruct fits your business? We are happy to help.</p>
            </div>
            <div className="ax-ways">
              <a className="ax-way" href="mailto:support@astruct.io">
                <span className="ax-way-ico"><Mail size={17} /></span>
                <span>support@astruct.io<small>We reply the same business day, most days.</small></span>
              </a>
              <Link className="ax-way" href={DEMO_HREF}>
                <span className="ax-way-ico"><MessageSquare size={17} /></span>
                <span>Prefer a walkthrough? Book a demo<small>Thirty minutes on your own contracts.</small></span>
              </Link>
            </div>
          </div>
          <AxLeadForm type="contact" source="contact" />
        </div>
      </section>

      <AxFooter />
    </AxRoot>
  )
}
