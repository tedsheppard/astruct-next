'use client'

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-sm text-[#999] mb-12">Last updated: April 2026</p>

          <div className="space-y-10 text-[15px] text-[#444] leading-[1.8]">
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Astruct platform operated by Astruct Pty Ltd (ABN pending) (&quot;Astruct&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By creating an account or using the platform, you agree to be bound by these Terms. If you do not agree, do not use the platform.
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
                1. Service Description
              </h2>
              <p className="mb-3">
                Astruct is an AI-powered platform for managing construction contracts. The platform allows users to upload contract documents, ask questions about their contracts using an AI assistant, generate contractual correspondence and notices, extract structured data through review tables, and track time-bar obligations via a calendar interface.
              </p>
              <p>
                The platform is designed for use with Australian standard-form construction contracts (including AS4000, AS4902, and AS2124) as well as bespoke construction contracts in PDF format. The platform may also be used with international contract forms such as FIDIC and NEC.
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
                2. Account Responsibilities
              </h2>
              <p className="mb-3">
                You must provide accurate and complete information when creating your account. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
              </p>
              <p className="mb-3">
                You must notify us immediately at <a href="mailto:hello@astruct.io" className="underline" style={{ color: '#5C6B52' }}>hello@astruct.io</a> if you become aware of any unauthorised access to or use of your account.
              </p>
              <p>
                You must be at least 18 years of age to create an account. If you are using the platform on behalf of an organisation, you represent that you have the authority to bind that organisation to these Terms.
              </p>
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
                3. Acceptable Use
              </h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Use the platform for any unlawful purpose or in violation of any applicable laws or regulations.</li>
                <li>Upload documents that you do not have the right to access or share, or that contain malware or malicious code.</li>
                <li>Attempt to gain unauthorised access to other users&apos; accounts, data, or any part of the platform&apos;s infrastructure.</li>
                <li>Use automated scripts, bots, or scrapers to access the platform, except through our published API (if available).</li>
                <li>Resell, sublicense, or redistribute access to the platform without our prior written consent.</li>
                <li>Reverse engineer, decompile, or disassemble any part of the platform.</li>
                <li>Use the platform in any way that could damage, disable, or impair the service or interfere with other users&apos; access.</li>
              </ul>
              <p className="mt-3">
                We reserve the right to suspend or terminate your account if we reasonably believe you have violated these acceptable use provisions.
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
                4. Intellectual Property
              </h2>
              <p className="mb-3">
                <span className="font-medium text-[#1a1a1a]">Your content.</span> You retain all ownership rights in the documents, data, and content you upload to the platform. By uploading content, you grant Astruct a limited, non-exclusive licence to process, store, and display that content solely for the purpose of providing the platform&apos;s services to you. This licence terminates when you delete the content or your account.
              </p>
              <p className="mb-3">
                <span className="font-medium text-[#1a1a1a]">AI-generated content.</span> Content generated by the AI assistant (including drafted notices, query responses, and extracted data) is provided for your use. You may use, modify, and distribute AI-generated content as you see fit, subject to the disclaimers in Section 5 below.
              </p>
              <p>
                <span className="font-medium text-[#1a1a1a]">Our platform.</span> The Astruct platform, including its software, design, branding, and documentation, is owned by Astruct Pty Ltd and is protected by Australian and international intellectual property laws. Nothing in these Terms grants you any right to use Astruct&apos;s trademarks, logos, or branding.
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
                5. AI Disclaimer
              </h2>
              <p className="mb-3 font-medium text-[#1a1a1a]">
                AI-generated content is a starting point, not a final product.
              </p>
              <p className="mb-3">
                The AI assistant, document generation, review tables, and calendar extraction features use artificial intelligence to analyse your documents and produce responses. While we strive for accuracy, AI-generated content may contain errors, omissions, or inaccuracies. It should always be reviewed and verified by a qualified professional before being relied upon.
              </p>
              <p className="mb-3 font-medium text-[#1a1a1a]">
                Astruct is not a substitute for legal advice.
              </p>
              <p className="mb-3">
                The platform does not provide legal, financial, or professional advice. The information and content generated by the platform is for informational purposes only. You should always consult with a qualified construction lawyer, contract administrator, or other relevant professional before making decisions based on AI-generated content.
              </p>
              <p>
                Astruct does not guarantee the accuracy, completeness, or fitness for purpose of any AI-generated content. You use the platform and its output at your own risk.
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
                6. Limitation of Liability
              </h2>
              <p className="mb-3">
                To the maximum extent permitted by law, Astruct, its directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, loss of data, loss of business opportunity, or damages arising from reliance on AI-generated content, whether based in contract, tort, negligence, strict liability, or otherwise.
              </p>
              <p className="mb-3">
                Our total aggregate liability to you for any claims arising out of or relating to these Terms or the platform shall not exceed the total amount you have paid to Astruct in the twelve (12) months immediately preceding the event giving rise to the claim.
              </p>
              <p>
                Nothing in these Terms excludes or limits liability that cannot be excluded or limited under applicable Australian law, including liability under the Australian Consumer Law for guarantees that cannot be excluded.
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
                7. Subscription and Billing
              </h2>
              <p className="mb-3">
                Astruct offers free and paid subscription plans. Paid plans are billed monthly or annually in advance in Australian Dollars (AUD) unless otherwise specified. All prices are exclusive of GST, which will be added where applicable.
              </p>
              <p className="mb-3">
                Subscription fees are non-refundable except where required by the Australian Consumer Law. You may cancel your subscription at any time, and your access to paid features will continue until the end of your current billing period.
              </p>
              <p className="mb-3">
                We reserve the right to change our pricing with 30 days&apos; notice. Price changes will take effect at the start of your next billing period after the notice period.
              </p>
              <p>
                If payment fails, we will notify you and provide a grace period of 7 days to update your payment method. If payment is not received within the grace period, your account may be downgraded to the free plan.
              </p>
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
                8. Termination
              </h2>
              <p className="mb-3">
                You may delete your account at any time through the platform settings. Upon account deletion, all your data will be permanently removed from our systems within 30 days, as described in our Privacy Policy.
              </p>
              <p className="mb-3">
                We may suspend or terminate your account at any time if you breach these Terms, if required by law, or if we discontinue the platform. Where reasonably practicable, we will provide you with notice and an opportunity to export your data before termination.
              </p>
              <p>
                Sections 4 (Intellectual Property), 5 (AI Disclaimer), 6 (Limitation of Liability), and 10 (Governing Law) survive termination of these Terms.
              </p>
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
                9. Changes to These Terms
              </h2>
              <p className="mb-3">
                We may update these Terms from time to time. If we make material changes, we will notify you by email or through a notice on the platform at least 14 days before the changes take effect.
              </p>
              <p>
                Your continued use of the platform after the changes take effect constitutes your acceptance of the updated Terms. If you do not agree with the changes, you should stop using the platform and delete your account.
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
                10. Governing Law
              </h2>
              <p className="mb-3">
                These Terms are governed by and construed in accordance with the laws of Queensland, Australia. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Queensland, Australia.
              </p>
              <p>
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
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
                If you have any questions about these Terms of Service, contact us at{' '}
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
