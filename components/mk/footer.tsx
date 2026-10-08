import Link from 'next/link'
import { Brand } from './mark'
import { ThemeSwitch } from './client-bits'
import { CONTACT_EMAIL, LOGIN_URL, SIGNUP_URL } from './links'

export default function Footer() {
  return (
    <footer className="mk-footer">
      <div className="mk-wrap">
        <div className="mk-footer-top">
          <div className="mk-footer-brand">
            <Brand />
            <p>Project Brain for Australian construction contracts. Search the whole project and draft from all of it.</p>
          </div>
          <div>
            <h4>Product</h4>
            <ul>
              <li><Link href="/#search">Search everything</Link></li>
              <li><Link href="/#draft">Draft from everything</Link></li>
              <li><Link href="/#safe-ai">Safe AI</Link></li>
              <li><Link href="/#company">One company account</Link></li>
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
              <li><a href={SIGNUP_URL}>Get early access</a></li>
              <li><Link href="/apply">Private pilot</Link></li>
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
