'use client'

import Link from 'next/link'
import { FadeIn } from '../layout'

const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

export default function CompanyPage() {
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
              Built for construction. By construction people.
            </h1>
            <p className="text-[#a8a29e] text-lg md:text-xl mt-6 max-w-2xl leading-relaxed">
              Astruct was founded by people who have lived the problem — managing complex construction contracts, chasing deadlines, and losing claims to missed notice periods. We built the tool we wished existed.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* About */}
      <section className="bg-[#0C0C0C] border-t border-[#1a1a1a] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <FadeIn>
              <div>
                <h2
                  className="text-white text-3xl md:text-4xl mb-6"
                  style={{ fontFamily: headlineFont }}
                >
                  Our story
                </h2>
                <div className="space-y-4 text-[#a8a29e] leading-relaxed">
                  <p>
                    Construction contracts in Australia are complex, heavily negotiated, and time-sensitive. Standard forms like AS4000, AS2124, and ABIC are hundreds of pages long, filled with cross-references, and riddled with strict time bars that can extinguish claims overnight.
                  </p>
                  <p>
                    Despite this complexity, the industry still manages contracts with PDFs, spreadsheets, and institutional memory. Contract administrators spend hours searching for clauses. Project managers miss notice deadlines. Subcontractors lose claims they were entitled to — simply because they did not issue a notice within 28 days.
                  </p>
                  <p>
                    Astruct was founded in 2026 to change that. We are building AI-powered contract intelligence specifically for the Australian construction industry — tools that understand construction contracts, track obligations automatically, and help teams work faster without sacrificing accuracy.
                  </p>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={150}>
              <div>
                <h2
                  className="text-white text-3xl md:text-4xl mb-6"
                  style={{ fontFamily: headlineFont }}
                >
                  Our mission
                </h2>
                <div className="space-y-4 text-[#a8a29e] leading-relaxed">
                  <p>
                    We believe every construction company — from sole-trader subcontractors to tier-1 contractors — should have access to tools that help them understand and manage their contractual obligations.
                  </p>
                  <p>
                    Our mission is to make construction contract management faster, more accurate, and accessible to everyone in the industry. Not just the companies that can afford full-time contract administrators and external legal teams.
                  </p>
                  <p>
                    We are not building a generic AI tool and bolting construction onto it. We are building from the ground up for the specific language, structure, and requirements of Australian construction contracts.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="bg-[#0C0C0C] border-t border-[#1a1a1a] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-10">
            <FadeIn>
              <div className="border-l-2 border-[#6B7F5E] pl-6">
                <p className="text-[#a8a29e] text-sm uppercase tracking-wide mb-2">Location</p>
                <p className="text-white text-lg">Brisbane, Australia</p>
              </div>
            </FadeIn>
            <FadeIn delay={100}>
              <div className="border-l-2 border-[#6B7F5E] pl-6">
                <p className="text-[#a8a29e] text-sm uppercase tracking-wide mb-2">Founded</p>
                <p className="text-white text-lg">2026</p>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="border-l-2 border-[#6B7F5E] pl-6">
                <p className="text-[#a8a29e] text-sm uppercase tracking-wide mb-2">Focus</p>
                <p className="text-white text-lg">AI contract intelligence for construction</p>
              </div>
            </FadeIn>
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
              Want to learn more?
            </h2>
            <p className="text-[#a8a29e] text-lg max-w-xl mx-auto mb-10">
              We would love to hear from you. Whether you are a contractor, subcontractor, or construction lawyer — get in touch and see how Astruct can help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-[#6B7F5E] text-white font-medium hover:bg-[#5a6e4e] transition-colors"
              >
                Get in touch
              </Link>
              <Link
                href="/platform"
                className="inline-flex items-center px-6 py-3 rounded-lg border border-[#333] text-[#a8a29e] hover:text-white hover:border-[#555] transition-colors"
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
