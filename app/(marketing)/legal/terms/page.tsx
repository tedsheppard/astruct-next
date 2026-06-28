import { Container } from '@/components/site/primitives'

export const metadata = {
  title: 'Terms of Website Use',
  description: 'The terms governing your use of the Astruct website.',
}

const UPDATED = 'June 2026'

export default function TermsPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-3xl">
        <p className="site-eyebrow mb-3">Legal</p>
        <h1 className="text-[36px] font-bold tracking-tight text-[var(--site-text)] sm:text-[44px]">Terms of Website Use</h1>
        <p className="mt-3 text-[14px] text-[var(--site-muted)]">Last updated: {UPDATED}</p>

        <div className="site-prose mt-10">
          <p>
            These terms govern your use of the Astruct website at astruct.io (the <strong>“Site”</strong>). By using the
            Site you agree to these terms. Your use of the Astruct application and services is governed by a separate
            services agreement.
          </p>

          <h2>1. About these terms</h2>
          <p>
            The Site is operated by Astruct (<strong>“we”</strong>, <strong>“us”</strong>, <strong>“our”</strong>). We may
            update these terms from time to time by posting a revised version on this page. Your continued use of the Site
            after changes are posted means you accept the updated terms.
          </p>

          <h2>2. Use of the Site</h2>
          <p>You agree to use the Site only for lawful purposes. You must not:</p>
          <ul>
            <li>use the Site in any way that breaches any applicable law or regulation;</li>
            <li>attempt to gain unauthorised access to the Site, its servers, or any connected systems;</li>
            <li>introduce malicious code, or interfere with the proper operation of the Site;</li>
            <li>use automated means to scrape or copy content except as permitted by us in writing.</li>
          </ul>

          <h2>3. No legal advice</h2>
          <p>
            The Site contains general information about security-of-payment legislation and construction contracting in
            Australia, including state and territory guides. This information is provided for general guidance only. It is
            <strong> not legal advice</strong>, may not be current, and may not apply to your circumstances. You should
            obtain your own professional advice before acting on anything you read on the Site. We are not liable for any
            loss arising from reliance on the information provided.
          </p>

          <h2>4. Intellectual property</h2>
          <p>
            All content on the Site — including text, graphics, logos, and software — is owned by us or our licensors and
            is protected by intellectual property laws. You may view and print content for your own internal,
            non-commercial use. You must not otherwise reproduce, distribute, or commercially exploit it without our
            written permission.
          </p>

          <h2>5. Third-party links</h2>
          <p>
            The Site may link to third-party websites. We do not control and are not responsible for the content of those
            sites. A link does not imply our endorsement.
          </p>

          <h2>6. Disclaimers and liability</h2>
          <p>
            The Site is provided “as is”. To the maximum extent permitted by law, we exclude all warranties and are not
            liable for any loss or damage arising from your use of the Site. Nothing in these terms excludes any rights or
            guarantees you have under the Australian Consumer Law that cannot lawfully be excluded.
          </p>

          <h2>7. Governing law</h2>
          <p>
            These terms are governed by the laws of Australia. You submit to the non-exclusive jurisdiction of the courts
            of Australia.
          </p>

          <h2>8. Contact</h2>
          <p>
            Questions about these terms can be sent to <a href="mailto:support@astruct.io">support@astruct.io</a>.
          </p>

          <p className="mt-10 rounded-xl border border-[var(--site-line)] bg-[var(--site-paper)] px-5 py-4 text-[13px] text-[var(--site-muted)]">
            This page is a general template and should be reviewed by your legal adviser before you rely on it.
          </p>
        </div>
      </div>
    </Container>
  )
}
