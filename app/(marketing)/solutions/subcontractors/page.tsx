'use client'

import Link from 'next/link'
import { FadeIn } from '../../layout'

const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

const PAIN_POINTS = [
  {
    title: 'Time bars are unforgiving',
    description:
      'Under AS4000 clause 34.2, a contractor who fails to give notice of a claim within 28 days of becoming aware of the event loses the right to claim entirely. Under AS2124, the time frames can be even shorter. One missed notice can cost you hundreds of thousands of dollars.',
  },
  {
    title: 'Head contract flow-downs hide risk',
    description:
      'Your subcontract may incorporate the head contract by reference — including obligations, liquidated damages provisions, and indemnities you have never seen. Astruct reads both contracts together and surfaces every obligation that flows down to you, so you know exactly what you have signed up for.',
  },
  {
    title: 'Payment disputes drain your cash flow',
    description:
      'Late payments, disputed variations, and rejected claims are the reality of subcontracting in Australia. When every dollar matters, you need to know your contractual rights — what you can claim, when you must claim it, and exactly how to claim it under the Security of Payment Act.',
  },
]

const HOW_IT_HELPS = [
  {
    title: 'Know your deadlines before they pass',
    description:
      'Astruct extracts every notice period, time bar, and deadline from your subcontract and tracks them in a calendar. You get alerts before a deadline approaches — not after it has passed.',
  },
  {
    title: 'Draft compliant notices and claims',
    description:
      'Ask Astruct to draft an extension of time claim, a variation notice, or a payment claim. It reads your contract, identifies the correct clause, and generates a notice that meets your contractual requirements.',
  },
  {
    title: 'Understand your contract without a lawyer',
    description:
      'Ask plain-English questions about your subcontract. "What are my liquidated damages?" or "Can I claim delay costs?" Astruct reads your contract and gives you answers grounded in the actual clauses — with references you can verify.',
  },
  {
    title: 'Compare what you signed to what they are claiming',
    description:
      'When the head contractor issues a direction or rejects your claim, Astruct helps you compare their position against the contract terms. Understand whether their interpretation holds up — before you engage a lawyer.',
  },
]

export default function SubcontractorsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0C0C0C] py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <p className="text-[#6B7F5E] text-sm font-medium tracking-wide uppercase mb-4">
              For Subcontractors
            </p>
            <h1
              className="text-white text-4xl md:text-5xl lg:text-6xl leading-tight max-w-3xl"
              style={{ fontFamily: headlineFont }}
            >
              Protect your claims. Never miss a deadline.
            </h1>
            <p className="text-[#a8a29e] text-lg md:text-xl mt-6 max-w-2xl leading-relaxed">
              Australian construction contracts are designed to protect the principal. Time bars, flow-down clauses, and strict notice requirements mean subcontractors carry disproportionate risk. Astruct helps you understand and manage that risk.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-[#6B7F5E] text-white font-medium hover:bg-[#5a6e4e] transition-colors"
              >
                Start free trial
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 rounded-lg border border-[#333] text-[#a8a29e] hover:text-white hover:border-[#555] transition-colors"
              >
                Talk to us
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pain points */}
      <section className="bg-[#0C0C0C] border-t border-[#1a1a1a] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <h2
              className="text-white text-3xl md:text-4xl mb-4"
              style={{ fontFamily: headlineFont }}
            >
              The deck is stacked against subcontractors
            </h2>
            <p className="text-[#a8a29e] text-lg max-w-2xl mb-14 leading-relaxed">
              Standard form contracts like AS4000, AS2124, and ABIC MW impose strict requirements on contractors and subcontractors. Miss a single notice and you can lose your entitlement entirely.
            </p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {PAIN_POINTS.map((point, i) => (
              <FadeIn key={point.title} delay={i * 100}>
                <div className="bg-[#1a1a1a] rounded-xl p-8 border border-[#2a2a2a] h-full">
                  <h3
                    className="text-white text-lg mb-3"
                    style={{ fontFamily: headlineFont }}
                  >
                    {point.title}
                  </h3>
                  <p className="text-[#a8a29e] text-sm leading-relaxed">{point.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How Astruct helps */}
      <section className="bg-[#0C0C0C] border-t border-[#1a1a1a] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <h2
              className="text-white text-3xl md:text-4xl mb-14"
              style={{ fontFamily: headlineFont }}
            >
              How Astruct helps
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-10">
            {HOW_IT_HELPS.map((item, i) => (
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
              Do not let a missed deadline cost you a claim
            </h2>
            <p className="text-[#a8a29e] text-lg max-w-xl mx-auto mb-10">
              Astruct is built for the subcontractors who do the work. Understand your contracts, protect your rights, and get paid.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-3.5 rounded-lg bg-[#6B7F5E] text-white font-medium hover:bg-[#5a6e4e] transition-colors"
            >
              Start your free trial
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
