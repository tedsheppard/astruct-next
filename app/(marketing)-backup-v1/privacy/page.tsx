'use client'

export default function PrivacyPage() {
  return (
    <div style={{ background: '#FAFAF8', color: '#1a1a1a' }}>
      <section className="pt-36 pb-28 px-6">
        <div className="max-w-[720px] mx-auto">
          <h1
            className="text-4xl sm:text-5xl font-medium leading-[1.1] mb-4"
            style={{
              letterSpacing: '-0.03em',
              fontFamily: "'DM Serif Display', Georgia, serif",
            }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm text-[#999] mb-12">Last updated: April 2026</p>

          <div className="space-y-10 text-[15px] text-[#444] leading-[1.8]">
            <p>
              Astruct Pty Ltd (ABN pending) (&quot;Astruct&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the Astruct platform at astruct.io. This Privacy Policy explains how we collect, use, disclose, and protect your personal information in accordance with the Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
            </p>

            {/* 1 */}
            <div>
              <h2
                className="text-xl font-semibold mb-4"
                style={{
                  letterSpacing: '-0.01em',
                  fontFamily: "'DM Serif Display', Georgia, serif",
                }}
              >
                1. Information We Collect
              </h2>
              <p className="mb-3">We collect the following categories of information:</p>
              <p className="font-medium text-[#1a1a1a] mb-1">1.1 Account Information</p>
              <p className="mb-3">
                When you create an account, we collect your name, email address, and organisation name. If you subscribe to a paid plan, our payment processor (Stripe) collects your billing information. We do not store full credit card numbers on our servers.
              </p>
              <p className="font-medium text-[#1a1a1a] mb-1">1.2 Documents and Content</p>
              <p className="mb-3">
                You may upload construction contracts, correspondence, specifications, and other documents to the platform. These documents are stored securely and are only accessible to you and any team members you explicitly grant access to.
              </p>
              <p className="font-medium text-[#1a1a1a] mb-1">1.3 Usage Data</p>
              <p>
                We automatically collect information about how you interact with the platform, including pages visited, features used, queries submitted to the AI assistant, timestamps, browser type, and IP address. This data is used to improve the platform and is not shared with third parties for advertising purposes.
              </p>
            </div>

            {/* 2 */}
            <div>
              <h2
                className="text-xl font-semibold mb-4"
                style={{
                  letterSpacing: '-0.01em',
                  fontFamily: "'DM Serif Display', Georgia, serif",
                }}
              >
                2. How We Use Your Information
              </h2>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide, maintain, and improve the Astruct platform and its features.</li>
                <li>Process your documents and queries through our AI assistant to generate responses, notices, and analysis.</li>
                <li>Manage your account, subscriptions, and billing.</li>
                <li>Send transactional emails related to your account (e.g. subscription confirmations, security alerts).</li>
                <li>Monitor platform performance, diagnose technical issues, and prevent abuse.</li>
                <li>Comply with legal obligations under Australian law.</li>
              </ul>
            </div>

            {/* 3 */}
            <div>
              <h2
                className="text-xl font-semibold mb-4"
                style={{
                  letterSpacing: '-0.01em',
                  fontFamily: "'DM Serif Display', Georgia, serif",
                }}
              >
                3. AI Processing
              </h2>
              <p className="mb-3">
                When you use the AI assistant, document generation, review tables, or calendar extraction features, portions of your uploaded documents and queries are sent to third-party AI providers (Anthropic and OpenAI) for processing.
              </p>
              <p className="mb-3 font-medium text-[#1a1a1a]">
                Your documents are NOT used to train AI models.
              </p>
              <p className="mb-3">
                We maintain zero-data-retention API agreements with both Anthropic and OpenAI. Under these agreements, your data is processed in real time to generate a response and is not stored, logged, or used for model training by either provider. Once a response is returned, your input data is deleted from the provider&apos;s systems.
              </p>
              <p>
                AI-generated content (responses, drafted notices, extracted data) is stored on our platform as part of your account data and is subject to the same security and retention policies as your uploaded documents.
              </p>
            </div>

            {/* 4 */}
            <div>
              <h2
                className="text-xl font-semibold mb-4"
                style={{
                  letterSpacing: '-0.01em',
                  fontFamily: "'DM Serif Display', Georgia, serif",
                }}
              >
                4. Data Storage
              </h2>
              <p className="mb-3">
                Your data is stored using Supabase, a managed database and storage platform. All data is encrypted at rest using AES-256 encryption and encrypted in transit using TLS 1.2 or higher.
              </p>
              <p>
                We use Australian-region hosting where available. Some data may be processed in other regions as required by our infrastructure providers, but is always subject to the protections described in this policy.
              </p>
            </div>

            {/* 5 */}
            <div>
              <h2
                className="text-xl font-semibold mb-4"
                style={{
                  letterSpacing: '-0.01em',
                  fontFamily: "'DM Serif Display', Georgia, serif",
                }}
              >
                5. Data Retention
              </h2>
              <p className="mb-3">
                Your documents, AI conversation history, generated content, and account data are stored for as long as your account is active. You may delete individual documents, conversations, or contracts at any time, and they will be permanently removed from our systems within 7 days.
              </p>
              <p>
                If you delete your account, all associated data — including documents, conversations, generated content, review tables, and calendar entries — will be permanently deleted from our systems within 30 days. Anonymised, aggregated usage statistics (which cannot be linked back to you) may be retained for analytics purposes.
              </p>
            </div>

            {/* 6 */}
            <div>
              <h2
                className="text-xl font-semibold mb-4"
                style={{
                  letterSpacing: '-0.01em',
                  fontFamily: "'DM Serif Display', Georgia, serif",
                }}
              >
                6. Cookies
              </h2>
              <p>
                Astruct uses essential cookies only. These cookies are strictly necessary for authentication and session management. We do not use advertising cookies, tracking pixels, or third-party analytics cookies. No cookie consent banner is required because we do not use non-essential cookies.
              </p>
            </div>

            {/* 7 */}
            <div>
              <h2
                className="text-xl font-semibold mb-4"
                style={{
                  letterSpacing: '-0.01em',
                  fontFamily: "'DM Serif Display', Georgia, serif",
                }}
              >
                7. Third-Party Services
              </h2>
              <p className="mb-3">We share data with the following third-party services as necessary to operate the platform:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="font-medium text-[#1a1a1a]">Anthropic</span> — AI processing (Claude). Zero-data-retention API agreement in place. Data is not used for model training.</li>
                <li><span className="font-medium text-[#1a1a1a]">OpenAI</span> — AI processing (embeddings and supplementary models). Zero-data-retention API agreement in place. Data is not used for model training.</li>
                <li><span className="font-medium text-[#1a1a1a]">Supabase</span> — Database, authentication, and file storage. Data encrypted at rest and in transit.</li>
                <li><span className="font-medium text-[#1a1a1a]">Vercel</span> — Application hosting and edge delivery. No persistent storage of user data.</li>
                <li><span className="font-medium text-[#1a1a1a]">Stripe</span> — Payment processing. Stripe handles all payment card data and is PCI DSS Level 1 compliant.</li>
              </ul>
              <p className="mt-3">We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
            </div>

            {/* 8 */}
            <div>
              <h2
                className="text-xl font-semibold mb-4"
                style={{
                  letterSpacing: '-0.01em',
                  fontFamily: "'DM Serif Display', Georgia, serif",
                }}
              >
                8. Your Rights
              </h2>
              <p className="mb-3">Under the Australian Privacy Act and the APPs, you have the right to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="font-medium text-[#1a1a1a]">Access</span> — Request a copy of the personal information we hold about you.</li>
                <li><span className="font-medium text-[#1a1a1a]">Correction</span> — Request that we correct any inaccurate or incomplete personal information.</li>
                <li><span className="font-medium text-[#1a1a1a]">Deletion</span> — Request that we delete your account and all associated data. We will process deletion requests within 30 days.</li>
                <li><span className="font-medium text-[#1a1a1a]">Portability</span> — Export your documents and data at any time through the platform. All uploaded documents can be downloaded in their original format. AI conversation history and generated content can be exported as well.</li>
                <li><span className="font-medium text-[#1a1a1a]">Complaint</span> — Lodge a complaint with the Office of the Australian Information Commissioner (OAIC) if you believe we have breached the APPs.</li>
              </ul>
              <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:hello@astruct.io" className="underline" style={{ color: '#5C6B52' }}>hello@astruct.io</a>.</p>
            </div>

            {/* 9 */}
            <div>
              <h2
                className="text-xl font-semibold mb-4"
                style={{
                  letterSpacing: '-0.01em',
                  fontFamily: "'DM Serif Display', Georgia, serif",
                }}
              >
                9. Australian Privacy Act Compliance
              </h2>
              <p className="mb-3">
                We comply with the Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs). This includes:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Only collecting personal information that is reasonably necessary for our functions and activities (APP 3).</li>
                <li>Taking reasonable steps to notify you of the collection of your personal information (APP 5).</li>
                <li>Only using or disclosing personal information for the purpose for which it was collected, or a directly related purpose you would reasonably expect (APP 6).</li>
                <li>Taking reasonable steps to protect personal information from misuse, interference, loss, unauthorised access, modification, or disclosure (APP 11).</li>
                <li>Providing access to personal information we hold about you on request (APP 12).</li>
              </ul>
              <p className="mt-3">
                Where personal information is disclosed to overseas recipients (e.g. AI processing providers based in the United States), we take reasonable steps to ensure that the overseas recipient complies with the APPs in relation to that information (APP 8).
              </p>
            </div>

            {/* 10 */}
            <div>
              <h2
                className="text-xl font-semibold mb-4"
                style={{
                  letterSpacing: '-0.01em',
                  fontFamily: "'DM Serif Display', Georgia, serif",
                }}
              >
                10. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or through a notice on the platform. Your continued use of Astruct after any changes indicates your acceptance of the updated policy.
              </p>
            </div>

            {/* Contact */}
            <div className="pt-6 border-t border-[#e8e5e0]">
              <h2
                className="text-xl font-semibold mb-4"
                style={{
                  letterSpacing: '-0.01em',
                  fontFamily: "'DM Serif Display', Georgia, serif",
                }}
              >
                Contact
              </h2>
              <p>
                If you have any questions about this Privacy Policy or how we handle your personal information, contact us at{' '}
                <a href="mailto:hello@astruct.io" className="underline" style={{ color: '#5C6B52' }}>
                  hello@astruct.io
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
