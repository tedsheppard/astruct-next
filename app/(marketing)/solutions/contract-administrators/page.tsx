'use client'

import Link from 'next/link'
import { FadeIn } from '../../layout'

const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

const FEATURES = [
  {
    title: 'Search your entire contract set instantly',
    description:
      'Upload your head contract, subcontracts, special conditions, schedules, and amendments. Ask questions in plain English — "What is the defects liability period for the electrical subcontract?" — and get answers with clause references in seconds.',
  },
  {
    title: 'Answer your team without digging through folders',
    description:
      'Site managers, project managers, and superintendents constantly ask contract questions. Instead of opening PDFs and searching manually, point them to Astruct. They get instant, accurate answers grounded in the actual contract documents.',
  },
  {
    title: 'Track every notice period and deadline',
    description:
      'Astruct extracts notice periods, response deadlines, defects liability dates, and time bars from every contract on your project. A single calendar view shows what is due across all contracts — no more relying on memory or spreadsheets.',
  },
  {
    title: 'Maintain a correspondence register with AI',
    description:
      'Upload incoming and outgoing correspondence. Astruct indexes it, links it to the relevant contract clauses, and makes it searchable. When a dispute arises six months later, you can find the relevant letter in seconds — not hours.',
  },
  {
    title: 'Compare amendments and variations',
    description:
      'When the principal issues amended special conditions or a deed of variation, Astruct highlights exactly what changed — clause by clause. Understand the impact of each amendment before you sign.',
  },
  {
    title: 'Draft contract correspondence',
    description:
      'Generate first drafts of notices, directions, responses to claims, and other contract correspondence. Astruct references the correct clauses, uses appropriate contractual language, and saves your team hours of drafting time.',
  },
]

export default function ContractAdministratorsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0C0C0C] py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <p className="text-[#6B7F5E] text-sm font-medium tracking-wide uppercase mb-4">
              For Contract Administrators
            </p>
            <h1
              className="text-white text-4xl md:text-5xl lg:text-6xl leading-tight max-w-3xl"
              style={{ fontFamily: headlineFont }}
            >
              Your entire contract set, searchable in seconds
            </h1>
            <p className="text-[#a8a29e] text-lg md:text-xl mt-6 max-w-2xl leading-relaxed">
              You are the person everyone comes to with contract questions. Astruct gives you an AI assistant that knows every clause in every document on your project — so you can answer in seconds, not hours.
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
              Managing 30+ documents across a project is unsustainable without better tools
            </h2>
            <p className="text-[#a8a29e] text-lg mt-6 max-w-2xl leading-relaxed">
              A single commercial construction project can involve a head contract, dozens of subcontracts, multiple amendments, schedules, annexures, and hundreds of pieces of correspondence. Contract administrators are expected to know the answer to any question, from any document, at any time. The current approach — folder structures, Ctrl+F, and institutional memory — does not scale.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#0C0C0C] border-t border-[#1a1a1a] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
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

      {/* CTA */}
      <section className="bg-[#0C0C0C] border-t border-[#1a1a1a] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <h2
              className="text-white text-3xl md:text-4xl mb-6"
              style={{ fontFamily: headlineFont }}
            >
              Spend less time searching. More time administering.
            </h2>
            <p className="text-[#a8a29e] text-lg max-w-xl mx-auto mb-10">
              Astruct is the AI-powered contract administration tool built for the people who actually run construction projects.
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
