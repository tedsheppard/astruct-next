'use client'

import Link from 'next/link'
import { FadeIn } from '../../layout'

const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

function Screenshot({ label }: { label: string }) {
  return (
    <div
      className="w-full rounded-xl border border-[#2a2a2a] bg-[#141414] flex items-center justify-center text-[#555] text-sm"
      style={{ aspectRatio: '16/9' }}
    >
      Screenshot: {label}
    </div>
  )
}

function ScreenshotLight({ label }: { label: string }) {
  return (
    <div
      className="w-full rounded-xl border border-[#e5e2dc] bg-[#f0eee9] flex items-center justify-center text-[#999] text-sm"
      style={{ aspectRatio: '16/9' }}
    >
      Screenshot: {label}
    </div>
  )
}

const STATS = [
  { value: '47', label: 'Average time-bar obligations in an AS4000 head contract' },
  { value: '28', label: 'Days — the most common notice period under AS4000' },
  { value: '5', label: 'Business days to respond to a payment claim under SOPA (QLD)' },
  { value: '$0', label: 'Value of a valid claim with an expired time-bar' },
]

export default function CalendarPage() {
  return (
    <div>
      {/* Hero — Dark */}
      <section className="bg-[#0C0C0C] py-28 sm:py-36">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-5">Time-Bar Calendar</p>
            <h1
              className="text-white text-4xl sm:text-5xl lg:text-6xl leading-tight"
              style={{ fontFamily: headlineFont }}
            >
              47 time-bar obligations. Zero missed deadlines.
            </h1>
            <p className="mt-6 text-[#a8a29e] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              A typical AS4000 head contract contains dozens of time-sensitive obligations. Miss one notice period and you lose the right to claim — regardless of the merit. Astruct extracts every time-bar and tracks them all in one calendar.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Stats — Light */}
      <section className="bg-[#FAF9F6] py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="text-center">
                  <p className="text-[#6B7F5E] text-4xl sm:text-5xl font-semibold" style={{ fontFamily: headlineFont }}>
                    {stat.value}
                  </p>
                  <p className="text-[#57534E] text-sm mt-2 leading-relaxed">{stat.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Auto-extraction — Dark */}
      <section className="bg-[#0C0C0C] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <Screenshot label="AI extracting time-bar obligations from AS4000 clauses" />
            </FadeIn>
            <FadeIn delay={150}>
              <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-3">Auto-Extraction</p>
              <h2
                className="text-white text-3xl sm:text-4xl leading-tight mb-6"
                style={{ fontFamily: headlineFont }}
              >
                Every deadline your contract creates
              </h2>
              <div className="space-y-4 text-[#a8a29e] text-sm leading-relaxed">
                <p>
                  Astruct reads your uploaded contract and automatically identifies every clause that creates a time-sensitive obligation. Not just the obvious ones like the 28-day EOT notice under AS4000 clause 34.2 — also the 14-day period to respond to a superintendent&apos;s direction under clause 23, and the 10 business day period for payment certificates under clause 37.2.
                </p>
                <p>
                  The AI handles special conditions that override general conditions. If your special conditions change the EOT notice period from 28 days to 14 days, the calendar reflects the amended period, not the standard form.
                </p>
                <p>
                  Statutory deadlines under the Security of Payment Act are included automatically. In Queensland, a principal has 10 business days after receiving a payment claim to provide a payment schedule (s 18 BCISPA). In New South Wales, it is 10 business days under s 14(4). Astruct applies the correct state legislation.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Colour-Coded Status — Light */}
      <section className="bg-[#FAF9F6] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center lg:[direction:rtl]">
            <FadeIn className="lg:[direction:ltr]">
              <ScreenshotLight label="Calendar grid with green, amber, red, and grey obligation cards" />
            </FadeIn>
            <FadeIn delay={150} className="lg:[direction:ltr]">
              <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-3">Status Tracking</p>
              <h2
                className="text-[#1C1917] text-3xl sm:text-4xl leading-tight mb-6"
                style={{ fontFamily: headlineFont }}
              >
                See your risk at a glance
              </h2>
              <div className="space-y-4 text-[#57534E] text-sm leading-relaxed">
                <p>
                  Each obligation is colour-coded by urgency. Green means you have time. Amber means the deadline is within 7 days. Red means it is overdue or due today. Grey means completed — the notice has been sent or the action taken.
                </p>
                <p>
                  The calendar view shows obligations by week or month. The list view sorts by urgency so the most critical deadlines appear first. Filter by obligation type (notice, payment, insurance) or by contract party.
                </p>
                <p>
                  A project manager opening Astruct on Monday morning sees exactly which contractual deadlines fall in the coming week. No need to cross-reference the contract, the program, and a spreadsheet tracker — it is all in one view, derived directly from the contract documents.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* One-Click Drafting — Dark */}
      <section className="bg-[#0C0C0C] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <Screenshot label="Calendar obligation with 'Draft Notice' button and generated document" />
            </FadeIn>
            <FadeIn delay={150}>
              <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-3">One-Click Drafting</p>
              <h2
                className="text-white text-3xl sm:text-4xl leading-tight mb-6"
                style={{ fontFamily: headlineFont }}
              >
                From deadline to drafted notice in seconds
              </h2>
              <div className="space-y-4 text-[#a8a29e] text-sm leading-relaxed">
                <p>
                  Each calendar obligation includes a "Draft Notice" action. Click it and Astruct generates a notice that complies with the specific clause requirements — correct addressing, required content, and proper references.
                </p>
                <p>
                  A delay notice under AS4000 clause 34.2 needs to identify the qualifying cause of delay, state the expected duration, and be addressed to the Superintendent. Astruct structures the draft to include all required elements, leaving you to fill in the project-specific details.
                </p>
                <p>
                  After drafting, mark the obligation as completed and it turns grey in the calendar. The system maintains a record of which obligations were actioned and when — useful for demonstrating contractual compliance during dispute resolution.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Recurring Obligations — Light */}
      <section className="bg-[#FAF9F6] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center lg:[direction:rtl]">
            <FadeIn className="lg:[direction:ltr]">
              <ScreenshotLight label="Recurring obligations list showing monthly and quarterly items" />
            </FadeIn>
            <FadeIn delay={150} className="lg:[direction:ltr]">
              <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-3">Recurring Obligations</p>
              <h2
                className="text-[#1C1917] text-3xl sm:text-4xl leading-tight mb-6"
                style={{ fontFamily: headlineFont }}
              >
                Monthly claims, quarterly certificates, annual renewals
              </h2>
              <div className="space-y-4 text-[#57534E] text-sm leading-relaxed">
                <p>
                  Not all contractual obligations are one-off events. Monthly progress claims, quarterly insurance certificates of currency, and annual policy renewals recur throughout the project. Astruct creates recurring calendar entries based on the contract terms.
                </p>
                <p>
                  Under AS4000 clause 37.1, the Contractor must submit progress claims at intervals stated in the annexure. If the annexure says monthly by the 25th, Astruct creates a monthly obligation on the 25th for the duration of the project. Each instance can be individually completed or drafted.
                </p>
                <p>
                  Insurance obligations under clause 18 often require proof of currency at regular intervals. Astruct tracks when each certificate is due and flags it alongside the other contractual deadlines — not buried in a separate insurance register.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0C0C0C] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <h2
              className="text-white text-3xl sm:text-4xl leading-tight"
              style={{ fontFamily: headlineFont }}
            >
              Find every deadline hiding in your contract
            </h2>
            <p className="mt-4 text-[#a8a29e] text-lg max-w-xl mx-auto">
              Upload your contract and see how many time-bar obligations you have been tracking manually — or not tracking at all.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="px-7 py-3 rounded-lg bg-[#6B7F5E] text-white text-sm font-medium hover:bg-[#5a6e4e] transition-colors"
              >
                Start free
              </Link>
              <Link
                href="/platform"
                className="px-7 py-3 rounded-lg border border-[#333] text-white text-sm font-medium hover:border-[#555] transition-colors"
              >
                Back to platform overview
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
