'use client'

import Link from 'next/link'
import { FadeIn } from '../../layout'

const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

const USE_CASES = [
  {
    title: 'Review contracts in a fraction of the time',
    description:
      'Upload a head contract, subcontract, or deed of variation and ask Astruct to extract key commercial terms, risk allocations, and unusual clauses. Get a structured summary with clause references — what used to take an afternoon takes minutes.',
  },
  {
    title: 'Extract obligations and deadlines systematically',
    description:
      'Astruct reads every clause and builds a structured table of obligations, notice periods, time bars, and deadlines. Export it as a spreadsheet for your client or use it as the foundation for your advice.',
  },
  {
    title: 'Compare amendments against the base contract',
    description:
      'When a client sends you amended special conditions or a marked-up subcontract, Astruct identifies every deviation from the standard form — clause by clause. Focus your review time on the changes that matter, not re-reading the entire document.',
  },
  {
    title: 'Generate first-draft correspondence',
    description:
      'Draft notices of claim, extension of time requests, responses to show cause notices, and other contractual correspondence. Astruct references the relevant clauses and uses language appropriate to the contract form. You review and refine — rather than starting from scratch.',
  },
  {
    title: 'Cross-reference across multiple documents',
    description:
      'Construction disputes often involve the interplay between the head contract, subcontract, correspondence, and site records. Upload them all and ask questions that span documents — "Did the contractor comply with the notice requirements under clause 34?" — and get answers with references.',
  },
  {
    title: 'Support dispute preparation',
    description:
      'When preparing for adjudication, mediation, or litigation, Astruct helps you locate relevant clauses, identify the contractual basis for claims, and build a timeline of notices and responses from the correspondence register.',
  },
]

export default function ConstructionLawyersPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0C0C0C] py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <p className="text-[#6B7F5E] text-sm font-medium tracking-wide uppercase mb-4">
              For Construction Lawyers
            </p>
            <h1
              className="text-white text-4xl md:text-5xl lg:text-6xl leading-tight max-w-3xl"
              style={{ fontFamily: headlineFont }}
            >
              AI-assisted contract analysis for construction law
            </h1>
            <p className="text-[#a8a29e] text-lg md:text-xl mt-6 max-w-2xl leading-relaxed">
              Astruct is not a replacement for legal expertise. It is a tool that helps construction lawyers work faster — extracting obligations, comparing amendments, and drafting first-pass correspondence so you can focus on the advice that matters.
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

      {/* Disclaimer */}
      <section className="bg-[#0C0C0C] border-t border-[#1a1a1a] py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <div className="bg-[#1a1a1a] rounded-xl p-8 border border-[#2a2a2a] max-w-3xl">
              <p className="text-[#a8a29e] text-sm leading-relaxed">
                <span className="text-white font-medium">Important: </span>
                Astruct is an AI-assisted research and drafting tool. It does not provide legal advice. All outputs should be reviewed by a qualified legal professional before being relied upon or sent to clients. AI can make errors — always verify clause references and legal conclusions against the source documents.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Use cases */}
      <section className="bg-[#0C0C0C] border-t border-[#1a1a1a] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <h2
              className="text-white text-3xl md:text-4xl mb-14"
              style={{ fontFamily: headlineFont }}
            >
              How construction law firms use Astruct
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {USE_CASES.map((item, i) => (
              <FadeIn key={item.title} delay={i * 80}>
                <div className="bg-[#1a1a1a] rounded-xl p-8 border border-[#2a2a2a] h-full">
                  <h3
                    className="text-white text-lg mb-3"
                    style={{ fontFamily: headlineFont }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[#a8a29e] text-sm leading-relaxed">{item.description}</p>
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
              Spend less time reading. More time advising.
            </h2>
            <p className="text-[#a8a29e] text-lg max-w-xl mx-auto mb-10">
              Astruct helps construction lawyers deliver faster, more thorough contract analysis — without compromising on quality.
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
