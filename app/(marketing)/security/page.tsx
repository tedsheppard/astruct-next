'use client'

import Link from 'next/link'
import { FadeIn } from '../layout'

const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

const SECURITY_FEATURES = [
  {
    title: 'Encryption in transit and at rest',
    description:
      'All data is encrypted using TLS 1.3 in transit and AES-256 at rest. Document content, metadata, and AI conversation history are all encrypted. Database backups are encrypted with separate keys.',
  },
  {
    title: 'Zero data retention with AI providers',
    description:
      'When we send your contract data to AI models for analysis, we use zero-retention API endpoints. Your data is processed and immediately discarded — it is never stored by the AI provider and never used to train or improve their models.',
  },
  {
    title: 'Australian-hosted infrastructure',
    description:
      'Your data is stored on servers located in Australia. We use Australian data centres to ensure your contract documents remain within Australian jurisdiction, meeting the expectations of Australian construction companies and legal firms.',
  },
  {
    title: 'Row-level security',
    description:
      'Every database query is scoped to your organisation. Row-level security policies ensure that your data is completely isolated from other customers at the database level — not just the application level. There is no way for one customer to access another customer\'s data.',
  },
  {
    title: 'No training on your data',
    description:
      'Your contract documents, conversations, and extracted data are never used to train AI models — ours or anyone else\'s. Your competitive and commercial information stays yours. Full stop.',
  },
  {
    title: 'SOC 2 practices',
    description:
      'We follow SOC 2 Type II security practices including access controls, audit logging, change management, and incident response procedures. We conduct regular security assessments and maintain detailed audit trails of all system access.',
  },
]

const ADDITIONAL = [
  {
    title: 'Access controls',
    description: 'Role-based access control with team-level permissions. Audit logs track every document access and AI query.',
  },
  {
    title: 'Secure authentication',
    description: 'Industry-standard authentication with support for multi-factor authentication. Session management with automatic expiry.',
  },
  {
    title: 'Data portability',
    description: 'Export your data at any time. We do not lock you in. Your documents, extracted data, and conversation history can be exported in standard formats.',
  },
  {
    title: 'Incident response',
    description: 'Documented incident response procedures with defined escalation paths. We will notify affected customers within 72 hours of any confirmed data breach.',
  },
]

export default function SecurityPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0C0C0C] py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <h1
              className="text-white text-4xl md:text-5xl lg:text-6xl leading-tight max-w-3xl"
              style={{ fontFamily: headlineFont }}
            >
              Your data is your data
            </h1>
            <p className="text-[#a8a29e] text-lg md:text-xl mt-6 max-w-2xl leading-relaxed">
              Construction contracts contain commercially sensitive information — pricing, margins, risk allocations, and negotiation positions. We built Astruct with security as a foundational requirement, not an afterthought.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Security features grid */}
      <section className="bg-[#0C0C0C] border-t border-[#1a1a1a] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <h2
              className="text-white text-3xl md:text-4xl mb-14"
              style={{ fontFamily: headlineFont }}
            >
              How we protect your data
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SECURITY_FEATURES.map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 80}>
                <div className="bg-[#1a1a1a] rounded-xl p-8 border border-[#2a2a2a] h-full">
                  <h3
                    className="text-white text-lg mb-3"
                    style={{ fontFamily: headlineFont }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-[#a8a29e] text-sm leading-relaxed">{feature.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Additional */}
      <section className="bg-[#0C0C0C] border-t border-[#1a1a1a] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <h2
              className="text-white text-3xl md:text-4xl mb-14"
              style={{ fontFamily: headlineFont }}
            >
              Additional security measures
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-10">
            {ADDITIONAL.map((item, i) => (
              <FadeIn key={item.title} delay={i * 100}>
                <div className="border-l-2 border-[#6B7F5E] pl-6">
                  <h3
                    className="text-white text-xl mb-3"
                    style={{ fontFamily: headlineFont }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[#a8a29e] leading-relaxed">{item.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0C0C0C] border-t border-[#1a1a1a] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <h2
              className="text-white text-3xl md:text-4xl mb-6"
              style={{ fontFamily: headlineFont }}
            >
              Questions about security?
            </h2>
            <p className="text-[#a8a29e] text-lg max-w-xl mx-auto mb-10">
              We are happy to discuss our security practices in detail. Reach out to our team or review our privacy policy.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-[#6B7F5E] text-white font-medium hover:bg-[#5a6e4e] transition-colors"
              >
                Contact us
              </Link>
              <Link
                href="/privacy"
                className="inline-flex items-center px-6 py-3 rounded-lg border border-[#333] text-[#a8a29e] hover:text-white hover:border-[#555] transition-colors"
              >
                Privacy policy
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
