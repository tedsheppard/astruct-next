/**
 * Support. The three ways to reach us, then the questions we answer most.
 * Same substance as before, on the site's chrome.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, Mail, MessageSquare } from 'lucide-react'
import { AxRoot, AxHeader, AxFooter } from '@/components/site/ax-chrome'
import { CONTACT_HREF, DEMO_HREF, startFreeHref } from '@/lib/site/brand'
import '../landing/landing.css'
import '../ax-pages.css'

export const metadata: Metadata = {
  title: 'Support',
  description: 'Get help with Astruct: contact support, book a walkthrough, or read the Security of Payment guides.',
}

const WAYS = [
  { icon: Mail, title: 'Contact support', body: 'Questions about your account, claims or schedules. We reply fast.', href: CONTACT_HREF, cta: 'Get in touch' },
  { icon: MessageSquare, title: 'Book a walkthrough', body: 'See Astruct on your own contracts with a guided demo.', href: DEMO_HREF, cta: 'Book a demo' },
  { icon: BookOpen, title: 'Read the guides', body: 'Plain-English Security of Payment guides for every jurisdiction.', href: '/resources', cta: 'Browse resources' },
]

const FAQ = [
  { q: 'How do I get started?', a: 'Create a free account, add your first contract with its schedule of values and retention terms, and make your first claim. The setup takes minutes.' },
  { q: 'Can you help me migrate existing contracts?', a: 'Yes. For larger setups we offer guided onboarding. Book a demo and we will help you bring your contracts across.' },
  { q: 'How do I invite the other party?', a: 'From a workspace, invite the head contractor or subcontractor by email. They can accept and work on the same shared record.' },
  { q: 'Where can I learn how the Act works?', a: 'Our Resources section has a plain-English guide for every Australian state and territory, covering claims, schedules, timeframes and adjudication.' },
]

export default function SupportPage() {
  return (
    <AxRoot>
      <AxHeader />

      <section className="ax-sec ax-sec-first is-in">
        <div className="ax-page-head ax-page-head-mid">
          <span className="ax-pill"><i />Support</span>
          <h1>We are here to help.</h1>
          <p className="ax-lede">Whether you are setting up your first contract or assessing claims at scale, we will help you get it right.</p>
        </div>
        <div className="ax-tiles">
          {WAYS.map((w) => (
            <Link key={w.title} href={w.href} className="ax-tile">
              <span className="ax-tile-ico"><w.icon size={19} /></span>
              <h3>{w.title}</h3>
              <p>{w.body}</p>
              <span className="ax-tile-go">{w.cta} <ArrowRight size={14} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="ax-sec is-in" style={{ paddingTop: 0 }}>
        <div className="ax-two">
          <div className="ax-sub-head">
            <span className="ax-pill"><i />Questions</span>
            <h2>Common support questions</h2>
            <p>The ones we are asked most, answered plainly.</p>
          </div>
          <div className="ax-faq">
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="ax-sec ax-close is-in" style={{ paddingTop: 0 }}>
        <h2>Still stuck? Write to us.</h2>
        <p className="ax-lede" style={{ maxWidth: 560, margin: '16px auto 0' }}>A real person reads every message. Tell us what you are working on and we will help.</p>
        <div className="ax-cta">
          <Link className="ax-btn ax-btn-primary" href={CONTACT_HREF}>Contact support</Link>
          <a className="ax-btn ax-btn-ghost" href={startFreeHref()}>Start your free trial</a>
        </div>
        <p className="ax-fine">support@astruct.io</p>
      </section>

      <AxFooter />
    </AxRoot>
  )
}
