'use client'

import Link from 'next/link'
import { FadeIn } from '../layout'

const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

export default function PrivacyPage() {
  return (
    <div className="bg-[#FAF9F6]">
      {/* Header */}
      <section className="py-16 md:py-24 border-b border-[#e8e5e0]">
        <div className="max-w-[800px] mx-auto px-6">
          <FadeIn>
            <h1
              className="text-[#1C1917] text-3xl md:text-4xl lg:text-5xl"
              style={{ fontFamily: headlineFont }}
            >
              Privacy Policy
            </h1>
            <p className="text-[#57534E] mt-4">
              Last updated: 1 April 2026
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-[800px] mx-auto px-6">
          <FadeIn>
            <div className="prose prose-stone max-w-none space-y-10">

              {/* Intro */}
              <div>
                <p className="text-[#57534E] leading-relaxed">
                  Astruct Pty Ltd (ABN pending) (&quot;Astruct&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting the privacy of your personal information. This Privacy Policy explains how we collect, use, disclose, and store personal information in accordance with the Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
                </p>
                <p className="text-[#57534E] leading-relaxed mt-4">
                  By using the Astruct platform and services, you consent to the collection and use of your information as described in this policy.
                </p>
              </div>

              {/* 1 */}
              <div>
                <h2 className="text-[#1C1917] text-xl font-semibold mb-3" style={{ fontFamily: headlineFont }}>
                  1. Information We Collect
                </h2>
                <p className="text-[#57534E] leading-relaxed mb-3">
                  We collect the following categories of personal information:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[#57534E]">
                  <li><strong>Account information:</strong> Your name, email address, company name, phone number, and billing details when you create an account or subscribe to a plan.</li>
                  <li><strong>Documents and content:</strong> Construction contracts, correspondence, and other documents you upload to the platform for analysis. These are treated as confidential business information.</li>
                  <li><strong>Usage data:</strong> Information about how you interact with the platform, including pages visited, features used, queries made to the AI assistant, and session duration.</li>
                  <li><strong>Technical data:</strong> IP address, browser type, operating system, device information, and referral URLs collected automatically when you access the platform.</li>
                  <li><strong>Communication data:</strong> Records of correspondence between you and our support team, including emails and contact form submissions.</li>
                </ul>
              </div>

              {/* 2 */}
              <div>
                <h2 className="text-[#1C1917] text-xl font-semibold mb-3" style={{ fontFamily: headlineFont }}>
                  2. How We Use Your Information
                </h2>
                <p className="text-[#57534E] leading-relaxed mb-3">
                  We use your personal information for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[#57534E]">
                  <li>Providing, operating, and improving the Astruct platform and services.</li>
                  <li>Processing your documents through AI models to deliver contract analysis, obligation extraction, and other features.</li>
                  <li>Managing your account, processing payments, and communicating with you about your subscription.</li>
                  <li>Sending you service-related communications, including security alerts and feature updates.</li>
                  <li>Responding to your enquiries, support requests, and feedback.</li>
                  <li>Analysing aggregated, de-identified usage patterns to improve our product (your individual data is never shared).</li>
                  <li>Complying with legal obligations and enforcing our terms of service.</li>
                </ul>
              </div>

              {/* 3 */}
              <div>
                <h2 className="text-[#1C1917] text-xl font-semibold mb-3" style={{ fontFamily: headlineFont }}>
                  3. AI Processing and Zero Data Retention
                </h2>
                <p className="text-[#57534E] leading-relaxed mb-3">
                  When you use Astruct&apos;s AI features, your document content is sent to third-party AI model providers (such as Anthropic) for processing. We take the following measures to protect your data:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[#57534E]">
                  <li><strong>Zero retention:</strong> We use API endpoints that enforce zero data retention. Your data is processed by the AI model and immediately discarded by the provider. It is not stored, cached, or logged by the AI provider.</li>
                  <li><strong>No model training:</strong> Your documents and queries are never used to train, fine-tune, or improve AI models — neither ours nor our providers&apos;.</li>
                  <li><strong>Encrypted transmission:</strong> All data sent to AI providers is encrypted in transit using TLS 1.3.</li>
                  <li><strong>Minimised context:</strong> We send only the relevant portions of your documents needed to answer your query, not your entire document library.</li>
                </ul>
              </div>

              {/* 4 */}
              <div>
                <h2 className="text-[#1C1917] text-xl font-semibold mb-3" style={{ fontFamily: headlineFont }}>
                  4. Data Storage and Security
                </h2>
                <p className="text-[#57534E] leading-relaxed mb-3">
                  Your data is stored securely using the following measures:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[#57534E]">
                  <li>All data is stored on servers located in Australia.</li>
                  <li>Documents and database records are encrypted at rest using AES-256 encryption.</li>
                  <li>Row-level security ensures your data is isolated from other customers at the database level.</li>
                  <li>Access to production systems is restricted to authorised personnel with multi-factor authentication.</li>
                  <li>We conduct regular security assessments and maintain audit logs of all system access.</li>
                </ul>
              </div>

              {/* 5 */}
              <div>
                <h2 className="text-[#1C1917] text-xl font-semibold mb-3" style={{ fontFamily: headlineFont }}>
                  5. Data Retention
                </h2>
                <p className="text-[#57534E] leading-relaxed">
                  We retain your personal information and uploaded documents for as long as your account is active and you maintain a subscription. If you cancel your account, your data will remain accessible for 30 days to allow you to export it. After 30 days, all personal information and uploaded documents are permanently deleted from our systems, including backups, within 90 days. Aggregated, de-identified analytics data may be retained indefinitely.
                </p>
              </div>

              {/* 6 */}
              <div>
                <h2 className="text-[#1C1917] text-xl font-semibold mb-3" style={{ fontFamily: headlineFont }}>
                  6. Cookies and Tracking
                </h2>
                <p className="text-[#57534E] leading-relaxed mb-3">
                  We use the following types of cookies and similar technologies:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[#57534E]">
                  <li><strong>Essential cookies:</strong> Required for the platform to function, including authentication tokens and session identifiers. These cannot be disabled.</li>
                  <li><strong>Analytics cookies:</strong> Used to understand how users interact with the platform in aggregate. We use privacy-focused analytics tools and do not share this data with third-party advertisers.</li>
                </ul>
                <p className="text-[#57534E] leading-relaxed mt-3">
                  We do not use advertising cookies or tracking pixels. We do not sell your data to advertisers or data brokers.
                </p>
              </div>

              {/* 7 */}
              <div>
                <h2 className="text-[#1C1917] text-xl font-semibold mb-3" style={{ fontFamily: headlineFont }}>
                  7. Third-Party Service Providers
                </h2>
                <p className="text-[#57534E] leading-relaxed mb-3">
                  We engage the following categories of third-party service providers who may process your personal information on our behalf:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[#57534E]">
                  <li><strong>AI model providers</strong> (e.g., Anthropic) for document analysis and AI assistant features, subject to zero data retention agreements.</li>
                  <li><strong>Cloud infrastructure providers</strong> for hosting and data storage, using Australian data centres.</li>
                  <li><strong>Payment processors</strong> (e.g., Stripe) for processing subscription payments. We do not store your credit card details directly.</li>
                  <li><strong>Email service providers</strong> for sending transactional emails such as password resets and billing receipts.</li>
                </ul>
                <p className="text-[#57534E] leading-relaxed mt-3">
                  All third-party providers are bound by contractual obligations to protect your data and use it only for the purposes we specify.
                </p>
              </div>

              {/* 8 */}
              <div>
                <h2 className="text-[#1C1917] text-xl font-semibold mb-3" style={{ fontFamily: headlineFont }}>
                  8. Your Rights
                </h2>
                <p className="text-[#57534E] leading-relaxed mb-3">
                  Under the Australian Privacy Act 1988, you have the following rights:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[#57534E]">
                  <li><strong>Access:</strong> You may request access to the personal information we hold about you.</li>
                  <li><strong>Correction:</strong> You may request that we correct any inaccurate or incomplete personal information.</li>
                  <li><strong>Deletion:</strong> You may request that we delete your personal information, subject to our legal obligations.</li>
                  <li><strong>Data export:</strong> You may export your documents and data from the platform at any time through the account settings.</li>
                  <li><strong>Complaint:</strong> If you believe we have breached the APPs, you may lodge a complaint with us or with the Office of the Australian Information Commissioner (OAIC).</li>
                </ul>
                <p className="text-[#57534E] leading-relaxed mt-3">
                  To exercise any of these rights, contact us at <a href="mailto:hello@astruct.io" className="text-[#6B7F5E] hover:underline">hello@astruct.io</a>.
                </p>
              </div>

              {/* 9 */}
              <div>
                <h2 className="text-[#1C1917] text-xl font-semibold mb-3" style={{ fontFamily: headlineFont }}>
                  9. Australian Privacy Act Compliance
                </h2>
                <p className="text-[#57534E] leading-relaxed">
                  Astruct complies with the Australian Privacy Act 1988 (Cth) and the 13 Australian Privacy Principles (APPs). We are committed to handling personal information in an open and transparent manner. If we transfer personal information outside of Australia (for example, to AI model providers with servers in other jurisdictions), we take reasonable steps to ensure the overseas recipient complies with the APPs or is subject to a substantially similar privacy regime. Where we use zero-retention API endpoints, no personal information is stored outside Australia.
                </p>
              </div>

              {/* 10 */}
              <div>
                <h2 className="text-[#1C1917] text-xl font-semibold mb-3" style={{ fontFamily: headlineFont }}>
                  10. Changes to This Policy
                </h2>
                <p className="text-[#57534E] leading-relaxed">
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. We will notify you of any material changes by email or through a notice on the platform. The updated policy will take effect when posted unless otherwise stated.
                </p>
              </div>

              {/* Contact */}
              <div>
                <h2 className="text-[#1C1917] text-xl font-semibold mb-3" style={{ fontFamily: headlineFont }}>
                  11. Contact Us
                </h2>
                <p className="text-[#57534E] leading-relaxed">
                  If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
                </p>
                <div className="mt-4 text-[#57534E]">
                  <p>Astruct Pty Ltd</p>
                  <p>Brisbane, Queensland, Australia</p>
                  <p>Email: <a href="mailto:hello@astruct.io" className="text-[#6B7F5E] hover:underline">hello@astruct.io</a></p>
                </div>
              </div>

            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
