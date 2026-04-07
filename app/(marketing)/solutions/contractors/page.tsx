'use client'

import Link from 'next/link'
import { FadeIn } from '../../layout'

const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

const CAPABILITIES = [
  {
    title: 'Manage every subcontract in one place',
    description:
      'Upload your head contract, subcontracts, and amendments. Astruct maps the obligations flowing down from your head contract into each subcontract, highlighting gaps, inconsistencies, and missing flow-down clauses before they become disputes.',
  },
  {
    title: 'Track obligations across your entire project',
    description:
      'Every notice period, defects liability window, and payment milestone is extracted automatically. Your project team gets a single dashboard showing what is due, what is overdue, and what is coming up — across every contract on the project.',
  },
  {
    title: 'Generate payment claims in minutes',
    description:
      'Astruct reads your contract to understand the payment claim requirements — the format, the supporting documents, the submission deadline, and the correct recipient. Draft compliant payment claims that reference the right clauses and meet your contractual obligations.',
  },
  {
    title: 'Protect your time-bar rights',
    description:
      'Under AS4000 and AS2124, failing to issue a notice within the prescribed period can extinguish your right to claim entirely. Astruct identifies every time-bar clause in your contracts and tracks them in a calendar with automated reminders, so you never lose a claim to a missed deadline.',
  },
]

export default function ContractorsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0C0C0C] py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <p className="text-[#6B7F5E] text-sm font-medium tracking-wide uppercase mb-4">
              For General Contractors
            </p>
            <h1
              className="text-white text-4xl md:text-5xl lg:text-6xl leading-tight max-w-3xl"
              style={{ fontFamily: headlineFont }}
            >
              AI contract intelligence for general contractors
            </h1>
            <p className="text-[#a8a29e] text-lg md:text-xl mt-6 max-w-2xl leading-relaxed">
              You manage dozens of subcontracts, hundreds of obligations, and thousands of pages of contract documents. Astruct gives your project team instant answers and ensures nothing falls through the cracks.
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
                Book a demo
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-[#0C0C0C] border-t border-[#1a1a1a] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <h2
              className="text-white text-3xl md:text-4xl max-w-2xl"
              style={{ fontFamily: headlineFont }}
            >
              Construction contracts are getting more complex. Your tools should keep up.
            </h2>
            <p className="text-[#a8a29e] text-lg mt-6 max-w-2xl leading-relaxed">
              A typical commercial project involves a head contract, 20 to 50 subcontracts, and hundreds of variations, notices, and instructions. Your contract admin team is buried in documents, manually tracking deadlines in spreadsheets, and answering the same questions from site teams every week.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Capabilities */}
      <section className="bg-[#0C0C0C] border-t border-[#1a1a1a] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {CAPABILITIES.map((cap, i) => (
              <FadeIn key={cap.title} delay={i * 100}>
                <div className="border-l-2 border-[#6B7F5E] pl-6">
                  <h3
                    className="text-white text-xl md:text-2xl mb-4"
                    style={{ fontFamily: headlineFont }}
                  >
                    {cap.title}
                  </h3>
                  <p className="text-[#a8a29e] leading-relaxed">{cap.description}</p>
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
              Stop losing claims to missed deadlines
            </h2>
            <p className="text-[#a8a29e] text-lg max-w-xl mx-auto mb-10">
              Join the general contractors using Astruct to manage their contract obligations with confidence.
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
