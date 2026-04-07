'use client'

import { useState } from 'react'
import Link from 'next/link'

const tiers = [
  {
    name: 'Starter',
    price: '$99',
    period: '/mo',
    description: 'For individual contractors managing a single project.',
    features: [
      '1 active contract',
      '20 document uploads',
      '200 AI queries per month',
      'Document generation (DOCX)',
      'Time-bar calendar',
      'Email support',
    ],
    cta: 'Start free',
    href: '/register',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$249',
    period: '/mo',
    description: 'For contract administrators and project managers running multiple projects.',
    features: [
      '5 active contracts',
      'Unlimited document uploads',
      'Unlimited AI queries',
      'Review tables',
      'Correspondence generation',
      'Priority query routing',
      'Priority support',
    ],
    cta: 'Start free',
    href: '/register',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$499',
    period: '/mo',
    description: 'For teams collaborating across projects with shared knowledge.',
    features: [
      '15 active contracts',
      '3 team members',
      'Everything in Professional',
      'Shared review tables',
      'Team activity log',
      'Dedicated onboarding session',
    ],
    cta: 'Start free',
    href: '/register',
    highlighted: false,
  },
]

const enterprise = {
  name: 'Enterprise',
  description: 'For organisations with complex requirements and large contract portfolios.',
  features: [
    'Unlimited contracts',
    'Unlimited team members',
    'SSO / SAML authentication',
    'Custom integrations',
    'Service level agreement (SLA)',
    'Dedicated account manager',
  ],
}

const faqs = [
  {
    q: 'Is there a free trial?',
    a: 'Yes. Every new account starts with a free project — no credit card required. You can upload documents, ask questions, generate notices, and use the calendar on your first contract at no cost. When you need a second contract or exceed the free limits, you can choose a paid plan.',
  },
  {
    q: 'Can I change plans or cancel at any time?',
    a: 'Absolutely. You can upgrade, downgrade, or cancel your subscription at any time from your account settings. When you upgrade, the price difference is prorated for the remainder of your billing cycle. When you downgrade or cancel, the change takes effect at the end of your current billing period.',
  },
  {
    q: 'How are AI queries counted?',
    a: 'Each message you send to the AI assistant counts as one query. Follow-up questions in the same conversation each count as a separate query. Document generation (e.g. drafting a variation notice) counts as one query. Review table processing counts as one query per document processed.',
  },
  {
    q: 'What counts as an active contract?',
    a: 'An active contract is any project you have created in Astruct that has not been archived. You can archive completed projects at any time to free up a contract slot. Archived contracts remain accessible in read-only mode and do not count toward your limit.',
  },
  {
    q: 'Do you offer annual billing?',
    a: 'Yes. Annual billing is available on all paid plans and saves you 20% compared to monthly billing. Contact us at hello@astruct.io to switch to annual billing, or select the annual option during checkout.',
  },
  {
    q: 'How is my data secured?',
    a: 'All documents are encrypted at rest and in transit. Your data is stored in Supabase with Australian region hosting where available. Documents sent for AI processing are handled under zero-data-retention API agreements with Anthropic and OpenAI — your documents are never used to train AI models. See our Privacy Policy for full details.',
  },
]

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div style={{ background: '#FAFAF8', color: '#1a1a1a' }}>
      {/* Header */}
      <section className="pt-36 pb-16 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <h1
            className="text-4xl sm:text-5xl font-medium leading-[1.1]"
            style={{
              letterSpacing: '-0.03em',
              fontFamily: "'DM Serif Display', Georgia, serif",
            }}
          >
            Simple, transparent pricing
          </h1>
          <p className="mt-5 text-lg text-[#555] leading-relaxed max-w-[560px] mx-auto">
            Start free with your first project. Upgrade when you need more contracts, team members, or advanced features.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="pb-12 px-6">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="rounded-xl bg-white p-7 flex flex-col"
              style={{
                border: tier.highlighted
                  ? '2px solid #5C6B52'
                  : '1px solid #e8e5e0',
              }}
            >
              {tier.highlighted && (
                <span
                  className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full self-start mb-4"
                  style={{
                    background: '#5C6B52',
                    color: '#fff',
                  }}
                >
                  Most popular
                </span>
              )}
              <h3
                className="text-xl font-semibold"
                style={{ letterSpacing: '-0.01em' }}
              >
                {tier.name}
              </h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span
                  className="text-4xl font-medium"
                  style={{
                    letterSpacing: '-0.02em',
                    fontFamily: "'DM Serif Display', Georgia, serif",
                  }}
                >
                  {tier.price}
                </span>
                <span className="text-sm text-[#888]">{tier.period}</span>
              </div>
              <p className="mt-3 text-sm text-[#666] leading-relaxed">
                {tier.description}
              </p>
              <ul className="mt-6 space-y-3 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#444]">
                    <svg
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      style={{ color: '#5C6B52' }}
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
                href={tier.href}
                className="mt-8 block text-center text-sm font-medium px-6 py-3 rounded-lg transition-colors"
                style={
                  tier.highlighted
                    ? { background: '#5C6B52', color: '#fff' }
                    : {
                        border: '1px solid #d5d0c8',
                        color: '#1a1a1a',
                      }
                }
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise */}
      <section className="pb-28 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div
            className="rounded-xl bg-white border border-[#e8e5e0] p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-8"
          >
            <div className="flex-1">
              <h3
                className="text-2xl font-semibold mb-2"
                style={{ letterSpacing: '-0.01em' }}
              >
                {enterprise.name}
              </h3>
              <p className="text-sm text-[#666] leading-relaxed mb-5">
                {enterprise.description}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {enterprise.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#444]">
                    <svg
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      style={{ color: '#5C6B52' }}
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
            </div>
            <div className="flex flex-col items-center gap-3">
              <span
                className="text-3xl font-medium"
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  letterSpacing: '-0.02em',
                }}
              >
                Custom
              </span>
              <a
                href="mailto:hello@astruct.io"
                className="text-sm font-medium px-8 py-3 rounded-lg transition-colors"
                style={{ background: '#5C6B52', color: '#fff' }}
              >
                Contact us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-28 px-6" style={{ background: '#F5F5F0' }}>
        <div className="max-w-[720px] mx-auto pt-28">
          <h2
            className="text-3xl sm:text-4xl font-medium text-center mb-14"
            style={{
              letterSpacing: '-0.02em',
              fontFamily: "'DM Serif Display', Georgia, serif",
            }}
          >
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#e8e5e0] overflow-hidden"
              >
                <button
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-medium text-[#1a1a1a]">
                    {faq.q}
                  </span>
                  <svg
                    className="w-4 h-4 flex-shrink-0 text-[#999] transition-transform"
                    style={{
                      transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
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
                  <div className="px-6 pb-5">
                    <p className="text-sm text-[#555] leading-[1.75]">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6">
        <div className="max-w-[560px] mx-auto text-center">
          <h2
            className="text-3xl sm:text-4xl font-medium mb-4"
            style={{
              letterSpacing: '-0.02em',
              fontFamily: "'DM Serif Display', Georgia, serif",
            }}
          >
            Ready to get started?
          </h2>
          <p className="text-[#666] mb-8">
            Free for your first project. No credit card required.
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 rounded-lg text-white text-sm font-medium transition-colors"
            style={{ background: '#5C6B52' }}
          >
            Create your account
          </Link>
        </div>
      </section>
    </div>
  )
}
