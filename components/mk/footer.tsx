import Link from 'next/link'
import { Brand } from './mark'
import { ThemeSwitch } from './client-bits'
import { CONTACT_EMAIL, CTA_LABEL, LOGIN_URL, TRIAL_URL } from './links'

export default function Footer() {
  return (
    <footer className="mk-footer">
      <div className="mk-wrap">
        <div className="mk-footer-top">
          <div className="mk-footer-brand">
            <Brand />
            <p>AI for construction. Every document for a project in one place, searchable, with answers and drafts from AI made for Australian contracts.</p>
          </div>
          <div>
            <h4>Product</h4>
            <ul>
              <li><Link href="/#project">One place</Link></li>
              <li><Link href="/#find">Find anything</Link></li>
              <li><Link href="/#ask">Ask it</Link></li>
              <li><Link href="/#draft">Draft it</Link></li>
              <li><Link href="/#chronology">Chronology</Link></li>
              <li><Link href="/#australian">Made for Australia</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/security">Security</Link></li>
            </ul>
          </div>
          <div>
            <h4>Support</h4>
            <ul>
              <li><Link href="/support">Help centre</Link></li>
              <li><Link href="/support/sign-up-and-trial">Getting started</Link></li>
              <li><Link href="/support/boolean-search">Boolean search</Link></li>
              <li><Link href="/#faq">Questions</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4>Get started</h4>
            <ul>
              <li><a href={TRIAL_URL}>{CTA_LABEL}</a></li>
              <li><a href={LOGIN_URL}>Log in</a></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
              <li><Link href="/legal/privacy">Privacy policy</Link></li>
              <li><Link href="/legal/terms">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mk-footer-bottom">
          <span>© {new Date().getFullYear()} Astruct. All rights reserved.</span>
          <span>Prices in Australian dollars, excluding GST.</span>
          <ThemeSwitch />
        </div>
      </div>
    </footer>
  )
}
