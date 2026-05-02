'use client'

import Link from 'next/link'
import { FadeIn } from '../layout'
import { getCtaTarget } from '@/lib/anon-flag'

const CTA = getCtaTarget()
const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

export default function AboutPage() {
  return (
    <div className="bg-[#FAF9F6]">
      {/* Header */}
      <section className="bg-[#fafaf9] py-24 md:py-32">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <FadeIn>
            <h1
              className="text-[#0f0e0d] text-4xl md:text-5xl lg:text-6xl"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Built in Brisbane, for the construction industry.
            </h1>
            <p className="text-[#706d66] text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              Astruct is contract intelligence for the people who actually administer construction contracts —
              contract admins, project managers, subcontractors, principals.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-20">
        <div className="max-w-[760px] mx-auto px-6 space-y-12">
          <FadeIn>
            <h2
              className="text-[#1C1917] text-2xl md:text-3xl mb-4"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.01em' }}
            >
              Why we built it
            </h2>
            <p className="text-[#57534E] leading-relaxed text-lg">
              Construction contracts in Australia are dense. AS4000, AS4902, AS2124, AS4901,
              ABIC, FIDIC, NEC4, JCT, GC21 — each with hundreds of clauses, dozens of time bars,
              and a dozen ways to lose your claim if a notice misses a deadline. The people running
              these contracts are project administrators and commercial managers — not lawyers — and
              every contract feels different even when it&apos;s built on the same standard form.
            </p>
            <p className="text-[#57534E] leading-relaxed text-lg mt-4">
              The existing tools are document repositories that don&apos;t understand the contracts they
              store. Astruct reads the contract, extracts the clause map, tracks every time bar, and
              drafts compliant notices grounded in the actual contract text — with citations you can
              verify in one click.
            </p>
          </FadeIn>

          <FadeIn>
            <h2
              className="text-[#1C1917] text-2xl md:text-3xl mb-4"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.01em' }}
            >
              Who it&apos;s for
            </h2>
            <p className="text-[#57534E] leading-relaxed text-lg">
              Tier-2 and tier-3 contractors who manage multiple active head contracts and subcontracts.
              Subcontractors who need to fire compliant payment-claim and EOT notices on time, every
              time. Contract administrators and project managers who want to spend less time
              copy-pasting clause numbers and more time on the actual work.
            </p>
          </FadeIn>

          <FadeIn>
            <h2
              className="text-[#1C1917] text-2xl md:text-3xl mb-4"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.01em' }}
            >
              What we believe
            </h2>
            <ul className="space-y-3 text-[#57534E] text-lg">
              <li><strong className="text-[#1C1917]">Citations or it didn&apos;t happen.</strong> Every AI answer in Astruct quotes the contract verbatim with the clause reference. If we can&apos;t cite it, we say so.</li>
              <li><strong className="text-[#1C1917]">Friction kills.</strong> No email verification, no phone verification, no 14-step onboarding. Sign up takes seconds — or use it as a guest first and sign up only when you decide it&apos;s worth it.</li>
              <li><strong className="text-[#1C1917]">Pay per project.</strong> Per-contract pricing scales with your work. Active month? Pay for what you used. Quiet month? Pay less.</li>
              <li><strong className="text-[#1C1917]">Australian-built.</strong> GST inclusive, AS-form-aware, Australian construction terminology used naturally — not translated from American SaaS.</li>
            </ul>
          </FadeIn>

          <FadeIn>
            <h2
              className="text-[#1C1917] text-2xl md:text-3xl mb-4"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.01em' }}
            >
              Get in touch
            </h2>
            <p className="text-[#57534E] leading-relaxed text-lg">
              Astruct is an early-stage Australian SaaS company.
              For partnerships, enterprise, or just to say hi —{' '}
              <a href="mailto:hello@astruct.io" className="text-[#1C1917] underline">hello@astruct.io</a>.
            </p>
          </FadeIn>
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
              Try it on your contract.
            </h2>
            <p className="text-[#adaba5] text-lg max-w-xl mx-auto mb-10">
              No signup required. Upload, ask, see what comes back.
            </p>
            <Link
              href={CTA}
              className="inline-flex items-center px-8 py-3.5 rounded-lg bg-[#fafaf9] text-[#0f0e0d] font-medium hover:bg-[#eae6e0] transition-colors"
            >
              Try free
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
