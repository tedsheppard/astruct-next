import Link from 'next/link'
import { FadeIn } from '../layout'

const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Get started with one project. No credit card required.',
    features: [
      '1 project',
      '50 documents',
      'AI assistant (50 queries/month)',
      '5 correspondence items',
      'Basic calendar',
    ],
    cta: 'Get started free',
    href: '/register',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$695',
    period: '/month',
    description: 'For contract administrators and project managers running multiple active projects.',
    features: [
      'Up to 20 projects',
      'Unlimited documents',
      'Unlimited AI queries',
      'Full correspondence management',
      'Time-bar calendar',
      'Knowledge base',
      'Templates',
      'Priority support',
    ],
    cta: 'Start free trial',
    href: '/register',
    highlighted: true,
  },
  {
    name: 'Professional Max',
    price: '$1,395',
    period: '/month',
    description: 'For larger teams managing high-volume project portfolios.',
    features: [
      'Up to 50 projects',
      'Everything in Professional',
      'Advanced analytics',
      'Team collaboration',
      'Dedicated onboarding',
      'Priority support',
    ],
    cta: 'Start free trial',
    href: '/register',
    highlighted: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For tier-1 contractors and large construction firms with bespoke requirements.',
    features: [
      'Unlimited projects',
      'Everything in Professional Max',
      'SSO / SAML authentication',
      'Custom integrations (Procore, Aconex, Asite)',
      'Dedicated account support',
      'SLA guarantee',
      'Custom onboarding & training',
    ],
    cta: 'Contact sales',
    href: '/contact',
    highlighted: false,
  },
]

const FAQ_ITEMS = [
  {
    question: 'What contract forms do you support?',
    answer:
      'Astruct supports AS4000, AS4902, AS2124, AS4901, NEC, and FIDIC contract forms out of the box, plus 15+ additional standard forms. Our AI is trained to understand the specific clauses, notice requirements, and time bars across all of these.',
  },
  {
    question: 'What document types can I upload?',
    answer:
      'You can upload PDFs, DOCX files, images (PNG, JPG, TIFF), and spreadsheets (XLSX, CSV). Our AI automatically classifies each document by type and extracts key information.',
  },
  {
    question: 'How does AI classification work?',
    answer:
      'When you upload a document, Astruct\'s AI reads the content and automatically assigns a document type (e.g. variation, extension of time claim, site instruction), identifies relevant contract clauses, and extracts key dates and deadlines.',
  },
  {
    question: 'Can I export documents?',
    answer:
      'Yes. You can export individual documents or bulk-export your entire project library at any time. Exports include the original files along with all metadata, classifications, and notes added in Astruct.',
  },
  {
    question: 'Do you integrate with other platforms?',
    answer:
      'Enterprise customers can integrate with Procore, Aconex, Asite, and other construction management platforms. We also offer a REST API for custom integrations. Contact our sales team to discuss your requirements.',
  },
]

export default function PricingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#fafaf9] py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <h1
              className="text-[#0f0e0d] text-4xl md:text-5xl lg:text-6xl"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Simple, transparent pricing
            </h1>
            <p className="text-[#706d66] text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              Free to start, with plans that scale as your projects grow. No hidden fees.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="bg-[#fafaf9] pb-24 md:pb-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {PLANS.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 100}>
                <div
                  className={`bg-white rounded-xl p-8 border h-full flex flex-col ${
                    plan.highlighted
                      ? 'border-[#0f0e0d] relative shadow-sm'
                      : 'border-[#e5e5e3]'
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0f0e0d] text-[#fafaf9] text-xs font-medium px-3 py-1 rounded-full">
                      Most popular
                    </span>
                  )}
                  <div>
                    <h3 className="text-[#0f0e0d] text-lg font-medium">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span
                        className="text-[#0f0e0d] text-4xl font-semibold"
                        style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
                      >
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-[#8f8b85] text-sm">{plan.period}</span>
                      )}
                    </div>
                    <p className="text-[#706d66] text-sm mt-4 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>
                  <ul className="mt-8 space-y-3 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-[#706d66]">
                        <svg
                          className="w-4 h-4 text-[#0f0e0d] mt-0.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.href}
                    className={`mt-8 block text-center py-3 rounded-lg font-medium transition-colors ${
                      plan.highlighted
                        ? 'bg-[#0f0e0d] text-[#fafaf9] hover:bg-[#2a2826]'
                        : 'bg-[#fafaf9] text-[#0f0e0d] border border-[#e5e5e3] hover:bg-[#eae6e0]'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0f0e0d] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <h2
              className="text-[#fafaf9] text-3xl md:text-4xl mb-6"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Ready to get started?
            </h2>
            <p className="text-[#adaba5] text-lg max-w-xl mx-auto mb-10">
              Start for free today. Upgrade when you need to.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-3.5 rounded-lg bg-[#fafaf9] text-[#0f0e0d] font-medium hover:bg-[#eae6e0] transition-colors"
            >
              Get started free
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
