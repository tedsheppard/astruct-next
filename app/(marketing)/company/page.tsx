'use client'

import Link from 'next/link'
import { FadeIn } from '../layout'

const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

export default function CompanyPage() {
  return (
    <div>
      {/* Hero — light */}
      <section className="bg-[#fafaf9] py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <h1
              className="text-[#0f0e0d] text-4xl md:text-5xl lg:text-6xl leading-tight max-w-3xl"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Built by construction professionals
            </h1>
            <p className="text-[#706d66] text-lg md:text-xl mt-6 max-w-2xl leading-relaxed">
              Astruct was built by people who have worked on real construction projects and seen firsthand what happens when time-bars are missed, claims are lost, and contract admin falls behind.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Story + Mission */}
      <section className="bg-[#fafaf9] border-t border-[#e5e5e3] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <FadeIn>
              <div>
                <h2
                  className="text-[#0f0e0d] text-3xl md:text-4xl mb-6"
                  style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
                >
                  Our story
                </h2>
                <div className="space-y-4 text-[#706d66] leading-relaxed">
                  <p>
                    We have lived the problem. Managing complex construction contracts, chasing deadlines in spreadsheets, and watching claims get lost because a notice was issued a day late. The tools available to the construction industry have not kept up with the complexity of the contracts.
                  </p>
                  <p>
                    Astruct was founded in Brisbane, Australia to change that. We are building AI-powered contract intelligence specifically for construction -- tools that understand the language, structure, and time-critical nature of construction contracts.
                  </p>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={150}>
              <div>
                <h2
                  className="text-[#0f0e0d] text-3xl md:text-4xl mb-6"
                  style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
                >
                  Our mission
                </h2>
                <div className="space-y-4 text-[#706d66] leading-relaxed">
                  <p>
                    Make contract administration faster, more accurate, and accessible to every project team -- from sole-trader subcontractors to tier-1 contractors.
                  </p>
                  <p>
                    We are not building a generic AI tool and bolting construction onto it. We are building from the ground up for the specific requirements of construction contracts.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="bg-[#0f0e0d] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-10">
            <FadeIn>
              <div className="border-l-2 border-[#3a3835] pl-6">
                <p className="text-[#a8a29e] text-sm uppercase tracking-wide mb-2">Location</p>
                <p className="text-[#fafaf9] text-lg">Brisbane, Australia</p>
              </div>
            </FadeIn>
            <FadeIn delay={100}>
              <div className="border-l-2 border-[#3a3835] pl-6">
                <p className="text-[#a8a29e] text-sm uppercase tracking-wide mb-2">Founded</p>
                <p className="text-[#fafaf9] text-lg">2026</p>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="border-l-2 border-[#3a3835] pl-6">
                <p className="text-[#a8a29e] text-sm uppercase tracking-wide mb-2">Focus</p>
                <p className="text-[#fafaf9] text-lg">AI contract intelligence for construction</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#fafaf9] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <h2
              className="text-[#0f0e0d] text-3xl md:text-4xl mb-6"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Want to learn more?
            </h2>
            <p className="text-[#706d66] text-lg max-w-xl mx-auto mb-10">
              Whether you are a contractor, subcontractor, or construction lawyer -- get in touch and see how Astruct can help your team.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-[#0f0e0d] text-[#fafaf9] font-medium hover:bg-[#2a2927] transition-colors"
              >
                Get in touch
              </Link>
              <Link
                href="/platform"
                className="inline-flex items-center px-6 py-3 rounded-lg border border-[#d6d3ce] text-[#706d66] hover:text-[#0f0e0d] hover:border-[#0f0e0d] transition-colors"
              >
                See the platform
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
