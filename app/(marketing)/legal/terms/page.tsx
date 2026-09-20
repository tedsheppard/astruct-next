/**
 * Terms of website use. The text is unchanged; it sits on the site's chrome
 * with the contents beside it.
 */
import type { Metadata } from 'next'
import { AxRoot, AxHeader, AxFooter } from '@/components/site/ax-chrome'
import '../../landing/landing.css'
import '../../ax-pages.css'

export const metadata: Metadata = {
  title: 'Terms of website use',
  description: 'The terms governing your use of the Astruct website.',
}

const UPDATED = 'June 2026'

const SECTIONS = [
  ['about', '1. About these terms'],
  ['use', '2. Use of the Site'],
  ['advice', '3. No legal advice'],
  ['ip', '4. Intellectual property'],
  ['links', '5. Third-party links'],
  ['liability', '6. Disclaimers and liability'],
  ['law', '7. Governing law'],
  ['contact', '8. Contact'],
]

export default function TermsPage() {
  return (
    <AxRoot>
      <AxHeader />

      <section className="ax-sec ax-sec-first is-in">
        <div className="ax-page-head">
          <span className="ax-pill"><i />Legal</span>
          <h1>Terms of website use</h1>
          <p className="ax-fine" style={{ marginTop: 14 }}>Last updated: {UPDATED}</p>
        </div>

        <div className="ax-doc">
          <nav className="ax-doc-nav" aria-label="Contents">
            <b>Contents</b>
            {SECTIONS.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
          </nav>

          <div className="ax-legal">
            <p>
              These terms govern your use of the Astruct website at astruct.io (the <strong>&ldquo;Site&rdquo;</strong>). By using the
              Site you agree to these terms. Your use of the Astruct application and services is governed by a separate
              services agreement.
            </p>

            <h2 id="about">1. About these terms</h2>
            <p>
              The Site is operated by Astruct (<strong>&ldquo;we&rdquo;</strong>, <strong>&ldquo;us&rdquo;</strong>, <strong>&ldquo;our&rdquo;</strong>). We may
              update these terms from time to time by posting a revised version on this page. Your continued use of the Site
              after changes are posted means you accept the updated terms.
            </p>

            <h2 id="use">2. Use of the Site</h2>
            <p>You agree to use the Site only for lawful purposes. You must not:</p>
            <ul>
              <li>use the Site in any way that breaches any applicable law or regulation;</li>
              <li>attempt to gain unauthorised access to the Site, its servers, or any connected systems;</li>
              <li>introduce malicious code, or interfere with the proper operation of the Site;</li>
              <li>use automated means to scrape or copy content except as permitted by us in writing.</li>
            </ul>

            <h2 id="advice">3. No legal advice</h2>
            <p>
              The Site contains general information about security-of-payment legislation and construction contracting in
              Australia, including state and territory guides. This information is provided for general guidance only. It is
              <strong> not legal advice</strong>, may not be current, and may not apply to your circumstances. You should
              obtain your own professional advice before acting on anything you read on the Site. We are not liable for any
              loss arising from reliance on the information provided.
            </p>

            <h2 id="ip">4. Intellectual property</h2>
            <p>
              All content on the Site, including text, graphics, logos, and software, is owned by us or our licensors and
              is protected by intellectual property laws. You may view and print content for your own internal,
              non-commercial use. You must not otherwise reproduce, distribute, or commercially exploit it without our
              written permission.
            </p>

            <h2 id="links">5. Third-party links</h2>
            <p>
              The Site may link to third-party websites. We do not control and are not responsible for the content of those
              sites. A link does not imply our endorsement.
            </p>

            <h2 id="liability">6. Disclaimers and liability</h2>
            <p>
              The Site is provided &ldquo;as is&rdquo;. To the maximum extent permitted by law, we exclude all warranties and are not
              liable for any loss or damage arising from your use of the Site. Nothing in these terms excludes any rights or
              guarantees you have under the Australian Consumer Law that cannot lawfully be excluded.
            </p>

            <h2 id="law">7. Governing law</h2>
            <p>
              These terms are governed by the laws of Australia. You submit to the non-exclusive jurisdiction of the courts
              of Australia.
            </p>

            <h2 id="contact">8. Contact</h2>
            <p>
              Questions about these terms can be sent to <a href="mailto:support@astruct.io">support@astruct.io</a>.
            </p>

            <p className="ax-legal-note">
              This page is a general template and should be reviewed by your legal adviser before you rely on it.
            </p>
          </div>
        </div>
      </section>

      <AxFooter />
    </AxRoot>
  )
}
