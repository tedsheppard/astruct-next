'use client'

import { FadeIn } from '../layout'

const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

export default function TermsPage() {
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
              Terms of Service
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
                  These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Astruct platform and services provided by Astruct Pty Ltd (ABN pending) (&quot;Astruct&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By creating an account or using the platform, you agree to be bound by these Terms. If you do not agree, do not use the platform.
                </p>
              </div>

              {/* 1 */}
              <div>
                <h2 className="text-[#1C1917] text-xl font-semibold mb-3" style={{ fontFamily: headlineFont }}>
                  1. Service Description
                </h2>
                <p className="text-[#57534E] leading-relaxed">
                  Astruct is an AI-powered contract intelligence platform designed for the Australian construction industry. The platform allows users to upload construction contract documents, analyse contract terms using artificial intelligence, extract obligations and deadlines, track time-bar provisions, manage correspondence, and generate draft contract correspondence. The platform is a tool to assist with contract administration and does not provide legal, financial, or professional advice.
                </p>
              </div>

              {/* 2 */}
              <div>
                <h2 className="text-[#1C1917] text-xl font-semibold mb-3" style={{ fontFamily: headlineFont }}>
                  2. Account Registration
                </h2>
                <p className="text-[#57534E] leading-relaxed mb-3">
                  To use the platform, you must create an account and provide accurate, complete information. You are responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[#57534E]">
                  <li>Maintaining the confidentiality of your account credentials.</li>
                  <li>All activity that occurs under your account.</li>
                  <li>Notifying us immediately of any unauthorised use of your account.</li>
                  <li>Ensuring that all users within your organisation who access the platform through your account comply with these Terms.</li>
                </ul>
                <p className="text-[#57534E] leading-relaxed mt-3">
                  You must be at least 18 years of age to create an account. If you are registering on behalf of an organisation, you represent that you have the authority to bind that organisation to these Terms.
                </p>
              </div>

              {/* 3 */}
              <div>
                <h2 className="text-[#1C1917] text-xl font-semibold mb-3" style={{ fontFamily: headlineFont }}>
                  3. Acceptable Use
                </h2>
                <p className="text-[#57534E] leading-relaxed mb-3">
                  You agree to use the platform only for lawful purposes related to construction contract management. You must not:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[#57534E]">
                  <li>Upload documents that you do not have the right to share or process.</li>
                  <li>Use the platform to engage in any fraudulent, misleading, or illegal activity.</li>
                  <li>Attempt to access other users&apos; data or interfere with the platform&apos;s operation.</li>
                  <li>Reverse engineer, decompile, or attempt to extract the source code of the platform.</li>
                  <li>Use automated tools to scrape, crawl, or extract data from the platform.</li>
                  <li>Resell, sublicense, or redistribute access to the platform without our written consent.</li>
                </ul>
              </div>

              {/* 4 */}
              <div>
                <h2 className="text-[#1C1917] text-xl font-semibold mb-3" style={{ fontFamily: headlineFont }}>
                  4. Intellectual Property
                </h2>
                <p className="text-[#57534E] leading-relaxed mb-3">
                  <strong>Your content:</strong> You retain all ownership rights in the documents and content you upload to the platform. By uploading content, you grant Astruct a limited, non-exclusive licence to process, store, and analyse your content solely for the purpose of providing the platform services to you. This licence terminates when you delete your content or close your account.
                </p>
                <p className="text-[#57534E] leading-relaxed mb-3">
                  <strong>Our platform:</strong> The Astruct platform, including its software, design, features, documentation, and branding, is owned by Astruct Pty Ltd and protected by copyright and other intellectual property laws. Nothing in these Terms grants you any right to use our trademarks, logos, or branding without our written consent.
                </p>
                <p className="text-[#57534E] leading-relaxed">
                  <strong>AI outputs:</strong> Content generated by the AI assistant (such as drafted notices, extracted obligation tables, and analysis summaries) is provided to you for your use. You are responsible for reviewing, verifying, and modifying any AI-generated content before relying on it.
                </p>
              </div>

              {/* 5 */}
              <div>
                <h2 className="text-[#1C1917] text-xl font-semibold mb-3" style={{ fontFamily: headlineFont }}>
                  5. AI Disclaimer
                </h2>
                <p className="text-[#57534E] leading-relaxed mb-3">
                  The Astruct platform uses artificial intelligence to analyse documents, extract information, and generate content. You acknowledge and agree that:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[#57534E]">
                  <li>AI-generated outputs may contain errors, omissions, or inaccuracies. You must independently verify all AI outputs against the source documents before relying on them.</li>
                  <li>The platform does not provide legal, financial, or professional advice. AI outputs are not a substitute for advice from a qualified professional.</li>
                  <li>Astruct does not guarantee the accuracy, completeness, or fitness for purpose of any AI-generated output.</li>
                  <li>You are solely responsible for any decisions or actions taken based on AI-generated outputs.</li>
                  <li>AI analysis of contract clauses is an interpretation aid, not a definitive legal interpretation. Contractual interpretation is ultimately a matter of law and should be determined by qualified legal professionals where the stakes are material.</li>
                </ul>
              </div>

              {/* 6 */}
              <div>
                <h2 className="text-[#1C1917] text-xl font-semibold mb-3" style={{ fontFamily: headlineFont }}>
                  6. Limitation of Liability
                </h2>
                <p className="text-[#57534E] leading-relaxed mb-3">
                  To the maximum extent permitted by law, Astruct&apos;s total liability to you for any claims arising out of or relating to these Terms or the platform is limited to the amount you paid to Astruct in the 12 months preceding the claim.
                </p>
                <p className="text-[#57534E] leading-relaxed mb-3">
                  To the maximum extent permitted by law, Astruct is not liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, loss of data, loss of business opportunity, or damages arising from missed contractual deadlines or notices — even if we have been advised of the possibility of such damages.
                </p>
                <p className="text-[#57534E] leading-relaxed">
                  Nothing in these Terms excludes or limits liability that cannot be excluded or limited under Australian Consumer Law, including liability for personal injury or death caused by negligence, or for fraud.
                </p>
              </div>

              {/* 7 */}
              <div>
                <h2 className="text-[#1C1917] text-xl font-semibold mb-3" style={{ fontFamily: headlineFont }}>
                  7. Billing and Payment
                </h2>
                <p className="text-[#57534E] leading-relaxed mb-3">
                  Paid subscriptions are billed in advance on a monthly or annual basis, depending on the plan you select. All prices are in Australian dollars and are inclusive of GST.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[#57534E]">
                  <li>Your subscription will automatically renew at the end of each billing period unless you cancel before the renewal date.</li>
                  <li>You may cancel your subscription at any time through your account settings. Cancellation takes effect at the end of the current billing period.</li>
                  <li>We do not offer refunds for partial billing periods, except where required by Australian Consumer Law.</li>
                  <li>We reserve the right to change our pricing with 30 days&apos; notice. Price changes will apply from your next billing period after the notice period.</li>
                </ul>
              </div>

              {/* 8 */}
              <div>
                <h2 className="text-[#1C1917] text-xl font-semibold mb-3" style={{ fontFamily: headlineFont }}>
                  8. Termination
                </h2>
                <p className="text-[#57534E] leading-relaxed mb-3">
                  You may close your account at any time by contacting us or through your account settings. We may suspend or terminate your account if:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[#57534E]">
                  <li>You breach these Terms and fail to remedy the breach within 14 days of notice.</li>
                  <li>You engage in activity that is illegal or harmful to other users or the platform.</li>
                  <li>Your account has been inactive for more than 12 months.</li>
                  <li>We are required to do so by law.</li>
                </ul>
                <p className="text-[#57534E] leading-relaxed mt-3">
                  Upon termination, your right to access the platform ceases immediately. Your data will be retained for 30 days to allow export, after which it will be permanently deleted.
                </p>
              </div>

              {/* 9 */}
              <div>
                <h2 className="text-[#1C1917] text-xl font-semibold mb-3" style={{ fontFamily: headlineFont }}>
                  9. Changes to These Terms
                </h2>
                <p className="text-[#57534E] leading-relaxed">
                  We may update these Terms from time to time. We will notify you of material changes at least 30 days before they take effect, by email or through a notice on the platform. Your continued use of the platform after the updated Terms take effect constitutes your acceptance of the changes. If you do not agree to the updated Terms, you should stop using the platform and close your account.
                </p>
              </div>

              {/* 10 */}
              <div>
                <h2 className="text-[#1C1917] text-xl font-semibold mb-3" style={{ fontFamily: headlineFont }}>
                  10. Governing Law
                </h2>
                <p className="text-[#57534E] leading-relaxed">
                  These Terms are governed by the laws of Queensland, Australia. Any disputes arising out of or relating to these Terms or the platform will be subject to the exclusive jurisdiction of the courts of Queensland. Before commencing court proceedings, the parties agree to attempt to resolve any dispute through good-faith negotiation for a period of at least 30 days.
                </p>
              </div>

              {/* Contact */}
              <div>
                <h2 className="text-[#1C1917] text-xl font-semibold mb-3" style={{ fontFamily: headlineFont }}>
                  11. Contact
                </h2>
                <p className="text-[#57534E] leading-relaxed">
                  If you have any questions about these Terms, please contact us:
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
