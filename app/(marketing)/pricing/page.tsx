'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FadeIn } from '../layout'

const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

const PLANS = [
  {
    name: 'Starter',
    price: '$99',
    description: 'For individual contractors and small subcontractors managing a single project.',
    features: [
      'Up to 3 projects',
      '50 document uploads per month',
      'AI contract assistant',
      'Time-bar calendar',
      'Email support',
    ],
    cta: 'Start free trial',
    href: '/register',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$249',
    description: 'For contract administrators and project managers running multiple active projects.',
    features: [
      'Up to 15 projects',
      'Unlimited document uploads',
      'AI contract assistant',
      'Time-bar calendar',
      'Correspondence register',
      'Review tables & data extraction',
      'Priority email support',
    ],
    cta: 'Start free trial',
    href: '/register',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$499',
    description: 'For construction companies with multiple team members across projects.',
    features: [
      'Unlimited projects',
      'Unlimited document uploads',
      'Up to 10 team members',
      'All Professional features',
      'Team collaboration & sharing',
      'Role-based access control',
      'Priority support with onboarding',
    ],
    cta: 'Start free trial',
    href: '/register',
    highlighted: false,
  },
]

const FAQ_ITEMS = [
  {
    question: 'Is there a free trial?',
    answer:
      'Yes. Every plan includes a 14-day free trial with full access to all features. No credit card required to start. You can upgrade, downgrade, or cancel at any time during the trial.',
  },
  {
    question: 'What counts as a "project"?',
    answer:
      'A project is a workspace where you upload and organise contract documents for a specific construction project. Each project has its own document library, AI assistant context, and time-bar calendar. You can archive completed projects without losing access to the data.',
  },
  {
    question: 'Can I change plans later?',
    answer:
      'Absolutely. You can upgrade or downgrade your plan at any time. When you upgrade, you get immediate access to additional features. When you downgrade, the change takes effect at the end of your current billing cycle.',
  },
  {
    question: 'What happens to my data if I cancel?',
    answer:
      'Your data remains available for 30 days after cancellation. During that period you can export all documents and data. After 30 days, your data is permanently deleted from our systems in accordance with our privacy policy.',
  },
  {
    question: 'Do you offer annual billing?',
    answer:
      'Yes. Annual billing is available on all plans and includes a 20% discount compared to monthly billing. Contact us or select annual billing during checkout.',
  },
  {
    question: 'Is my contract data secure?',
    answer:
      'Yes. All documents are encrypted in transit and at rest. We use Australian-hosted infrastructure, implement row-level security so your data is isolated from other customers, and maintain zero data retention with our AI providers. Your documents are never used to train AI models. See our security page for full details.',
  },
]

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0C0C0C] py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <h1
              className="text-white text-4xl md:text-5xl lg:text-6xl"
              style={{ fontFamily: headlineFont }}
            >
              Simple, transparent pricing
            </h1>
            <p className="text-[#a8a29e] text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              Start with a 14-day free trial. No credit card required. Choose the plan that fits your team.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="bg-[#0C0C0C] pb-20 md:pb-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {PLANS.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 100}>
                <div
                  className={`bg-[#1a1a1a] rounded-xl p-8 border h-full flex flex-col ${
                    plan.highlighted
                      ? 'border-[#6B7F5E] relative'
                      : 'border-[#2a2a2a]'
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6B7F5E] text-white text-xs font-medium px-3 py-1 rounded-full">
                      Most popular
                    </span>
                  )}
                  <div>
                    <h3 className="text-white text-lg font-medium">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span
                        className="text-white text-4xl font-semibold"
                        style={{ fontFamily: headlineFont }}
                      >
                        {plan.price}
                      </span>
                      <span className="text-[#a8a29e] text-sm">/mo</span>
                    </div>
                    <p className="text-[#a8a29e] text-sm mt-4 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>
                  <ul className="mt-8 space-y-3 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-[#ccc]">
                        <svg
                          className="w-4 h-4 text-[#6B7F5E] mt-0.5 flex-shrink-0"
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
                        ? 'bg-[#6B7F5E] text-white hover:bg-[#5a6e4e]'
                        : 'bg-[#252525] text-white hover:bg-[#333]'
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

      {/* Enterprise */}
      <section className="bg-[#0C0C0C] border-t border-[#1a1a1a] py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <div className="bg-[#1a1a1a] rounded-xl p-8 md:p-12 border border-[#2a2a2a] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <h3
                  className="text-white text-2xl md:text-3xl mb-3"
                  style={{ fontFamily: headlineFont }}
                >
                  Enterprise
                </h3>
                <p className="text-[#a8a29e] max-w-lg leading-relaxed">
                  For tier-1 contractors and large construction firms. Custom integrations, dedicated support, SSO, and volume licensing. Tailored to your organisation.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 rounded-lg border border-[#333] text-white hover:border-[#555] transition-colors whitespace-nowrap"
              >
                Contact sales
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#0C0C0C] border-t border-[#1a1a1a] py-20 md:py-28">
        <div className="max-w-[800px] mx-auto px-6">
          <FadeIn>
            <h2
              className="text-white text-3xl md:text-4xl mb-12 text-center"
              style={{ fontFamily: headlineFont }}
            >
              Frequently asked questions
            </h2>
          </FadeIn>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <FadeIn key={i} delay={i * 50}>
                <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                  >
                    <span className="text-white text-sm font-medium pr-4">{item.question}</span>
                    <svg
                      className={`w-4 h-4 text-[#a8a29e] flex-shrink-0 transition-transform ${
                        openFaq === i ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-4">
                      <p className="text-[#a8a29e] text-sm leading-relaxed">{item.answer}</p>
                    </div>
                  )}
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
              Ready to get started?
            </h2>
            <p className="text-[#a8a29e] text-lg max-w-xl mx-auto mb-10">
              Start your 14-day free trial today. No credit card required.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-3.5 rounded-lg bg-[#6B7F5E] text-white font-medium hover:bg-[#5a6e4e] transition-colors"
            >
              Start free trial
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
