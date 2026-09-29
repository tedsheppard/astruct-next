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
            <p>Commercial intelligence for construction projects. Built in Australia for Australian contracts.</p>
          </div>
          <div>
            <h4>Product</h4>
            <ul>
              <li><Link href="/#how-it-works">How it works</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/security">Security</Link></li>
              <li><Link href="/#faq">Questions</Link></li>
            </ul>
          </div>
          <div>
            <h4>Get started</h4>
            <ul>
              <li><a href={SIGNUP_URL}>Start free trial</a></li>
              <li><Link href="/apply">Private pilot</Link></li>
              <li><a href={LOGIN_URL}>Log in</a></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link href="/contact">Contact</Link></li>
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
