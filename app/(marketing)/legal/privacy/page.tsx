import { Container } from '@/components/site/primitives'

export const metadata = {
  title: 'Privacy Policy',
  description: 'How Astruct collects, uses and protects your personal information.',
}

const UPDATED = 'June 2026'

export default function PrivacyPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-3xl">
        <p className="site-eyebrow mb-3">Legal</p>
        <h1 className="text-[36px] font-bold tracking-tight text-[var(--site-text)] sm:text-[44px]">Privacy Policy</h1>
        <p className="mt-3 text-[14px] text-[var(--site-muted)]">Last updated: {UPDATED}</p>

        <div className="site-prose mt-10">
          <p>
            Astruct (<strong>“we”</strong>, <strong>“us”</strong>, <strong>“our”</strong>) respects your privacy. This
            policy explains how we collect, use, disclose and protect personal information, consistent with the Privacy
            Act 1988 (Cth) and the Australian Privacy Principles.
          </p>

          <h2>1. Information we collect</h2>
          <p>We may collect:</p>
          <ul>
            <li><strong>Contact details</strong> you give us — such as your name, email, company and phone number when you book a demo, contact us, or create an account;</li>
            <li><strong>Account and usage information</strong> when you use the Astruct application, including the contracts, claims and documents you create;</li>
            <li><strong>Technical information</strong> such as your IP address, browser type and pages visited, collected through cookies and analytics.</li>
          </ul>

          <h2>2. How we use information</h2>
          <p>We use personal information to:</p>
          <ul>
            <li>provide, maintain and improve our website and services;</li>
            <li>respond to your enquiries and demo requests;</li>
            <li>send you service-related communications and, where you have opted in, updates about Astruct;</li>
            <li>meet our legal and regulatory obligations.</li>
          </ul>

          <h2>3. Disclosure</h2>
          <p>
            We do not sell your personal information. We may share it with service providers who help us operate (for
            example hosting, email and analytics providers), who are bound to protect it, and where required by law. Some
            providers may store data overseas; where they do, we take reasonable steps to ensure your information is
            handled consistently with this policy.
          </p>

          <h2>4. Cookies</h2>
          <p>
            We use cookies and similar technologies to operate the Site, remember your preferences, and understand how the
            Site is used. You can control cookies through your browser settings; disabling them may affect how the Site
            works.
          </p>

          <h2>5. Security</h2>
          <p>
            We take reasonable steps to protect personal information from misuse, loss, and unauthorised access — including
            encryption in transit, access controls, and reputable infrastructure providers. No system is completely
            secure, and we cannot guarantee absolute security.
          </p>

          <h2>6. Your rights</h2>
          <p>
            You may request access to, or correction of, the personal information we hold about you. To do so, or to make
            a privacy complaint, contact us using the details below. We will respond within a reasonable time.
          </p>

          <h2>7. Retention</h2>
          <p>
            We keep personal information only for as long as needed for the purposes described in this policy, or as
            required by law, after which we take reasonable steps to delete or de-identify it.
          </p>

          <h2>8. Contact</h2>
          <p>
            For privacy questions or requests, contact <a href="mailto:support@astruct.io">support@astruct.io</a>.
          </p>

          <p className="mt-10 rounded-xl border border-[var(--site-line)] bg-[var(--site-paper)] px-5 py-4 text-[13px] text-[var(--site-muted)]">
            This page is a general template and should be reviewed by your legal adviser before you rely on it.
          </p>
        </div>
      </div>
    </Container>
  )
}
