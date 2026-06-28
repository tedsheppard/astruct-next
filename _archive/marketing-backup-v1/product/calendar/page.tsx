'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [v, setV] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { threshold: 0.1 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref])
  return v
}

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const v = useInView(ref)
  return <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(24px)', transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>{children}</div>
}

function ScreenshotPlaceholder({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-[#e0ddd8] overflow-hidden" style={{ boxShadow: '0 20px 50px -12px rgba(0,0,0,0.1)' }}>
      <div className="h-8 bg-[#f0ece6] flex items-center px-3 gap-1.5 border-b border-[#e0ddd8]">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ddd]" /><div className="w-2.5 h-2.5 rounded-full bg-[#ddd]" /><div className="w-2.5 h-2.5 rounded-full bg-[#ddd]" />
      </div>
      <div className="aspect-video bg-[#f8f7f4] flex items-center justify-center text-sm text-[#999]">Screenshot: {label}</div>
    </div>
  )
}

const sections = [
  {
    title: 'Auto-extraction from contracts',
    description: 'Upload your AS4000 contract and Astruct identifies every clause that imposes a time-bar obligation. Notice periods under clause 34, response windows under clause 36, defects liability timeframes under clause 37 — all extracted automatically and placed on your calendar.',
    screenshot: 'Calendar populated with extracted time-bar deadlines from an AS4000 contract',
    points: [
      { label: 'Clause-by-clause scanning', text: 'The system reads every clause and identifies obligations with explicit or implicit timeframes. "Within 14 days" and "not later than 28 days after" are both captured.' },
      { label: 'Trigger event mapping', text: 'Each obligation is linked to its trigger event. A clause 34.2 notice is triggered by "the Contractor becoming aware of anything that will probably cause delay" — the calendar knows what starts the clock.' },
      { label: 'Consequence tracking', text: 'When a time-bar has a consequence for non-compliance (e.g., loss of entitlement to an EOT), the calendar flags it as critical.' },
      { label: 'Amendment awareness', text: 'If your contract amends the standard AS4000 time-bars — changing 14 days to 7 days, for instance — the calendar uses the amended values, not the standard form defaults.' },
    ],
  },
  {
    title: 'Correspondence-triggered deadlines',
    description: 'Time-bar obligations are not only found in the contract. When the Superintendent issues a direction, or the Principal delivers a show cause notice, new deadlines begin to run. Astruct detects these events in your correspondence and adds them to the calendar automatically.',
    screenshot: 'Calendar showing a new deadline triggered by an uploaded Superintendent direction letter',
    points: [
      { label: 'Direction detection', text: 'When you upload a Superintendent\'s direction, the system identifies the contract clause invoked and calculates the response deadline.' },
      { label: 'Show cause response windows', text: 'A show cause notice under clause 39 triggers a response period. The calendar calculates the due date based on the notice date and the contractual timeframe.' },
      { label: 'Payment schedule deadlines', text: 'When a payment claim is uploaded, the corresponding payment schedule deadline under SOPA is automatically calculated — 10 business days for head contracts, 5 for subcontracts.' },
      { label: 'Linked correspondence', text: 'Each calendar event links back to the specific letter or document that triggered it. Click the deadline to see the source correspondence.' },
    ],
  },
  {
    title: 'Color-coded status at a glance',
    description: 'Construction projects can have 40 or 50 active time-bar obligations running at any time. Color coding lets you see your risk exposure instantly without reading through a spreadsheet.',
    screenshot: 'Monthly calendar view with blue, amber, red, and green coded obligation markers',
    points: [
      { label: 'Blue — upcoming', text: 'Obligations that are more than 7 days away. You have time, but they are on the radar.' },
      { label: 'Amber — due soon', text: 'Obligations due within the next 7 days. These need attention this week.' },
      { label: 'Red — overdue', text: 'Obligations that have passed their due date without being marked as complete. Immediate action required.' },
      { label: 'Green — completed', text: 'Obligations that have been fulfilled. The completion date and the document that satisfies the obligation are recorded.' },
    ],
  },
  {
    title: 'One-click notice drafting',
    description: 'A deadline on a calendar is only useful if you can act on it. Click any obligation to draft the corresponding contractual notice, pre-populated with the correct clause references, dates, and required content.',
    screenshot: 'Clicking a calendar obligation and generating a pre-filled Extension of Time notice',
    points: [
      { label: 'Pre-filled templates', text: 'The draft notice includes the correct clause reference, the trigger event, the relevant dates, and the required content specified by the contract.' },
      { label: 'SOPA compliance', text: 'Payment claims and payment schedules are formatted to meet the requirements of the relevant state\'s Security of Payment legislation.' },
      { label: 'Edit before sending', text: 'Every generated notice opens in an editor where you can review, modify, and add project-specific details before finalising.' },
      { label: 'Completion tracking', text: 'Once you issue a notice, mark the obligation as complete. The calendar updates, and the issued document is linked to the obligation for audit purposes.' },
    ],
  },
  {
    title: 'Recurring obligations',
    description: 'Not every obligation is a one-off. Monthly progress claims, quarterly WHS reports, annual insurance renewals — these recur on a schedule and are just as easy to miss as one-off deadlines.',
    screenshot: 'Calendar showing recurring monthly progress claim deadlines and annual insurance renewal',
    points: [
      { label: 'Progress claim cycles', text: 'Set up your reference date and claim period, and the calendar generates every progress claim deadline for the duration of the contract.' },
      { label: 'Insurance renewals', text: 'Track annual insurance renewal dates for every policy required by the contract: public liability, professional indemnity, workers\' compensation, contract works.' },
      { label: 'WHS reporting', text: 'Monthly or quarterly safety reporting obligations are tracked with the same rigor as contractual time-bars.' },
      { label: 'Custom recurrence', text: 'Define your own recurring obligations with any frequency: weekly, fortnightly, monthly, quarterly, or annual.' },
    ],
  },
]

const faqs = [
  {
    q: 'How many obligations does a typical AS4000 contract have?',
    a: 'A standard unamended AS4000-1997 contract contains approximately 35-50 distinct time-bar obligations, depending on how you count variations within a single clause. Once you add amendments, special conditions, and the Annexure Part A, that number typically grows to 50-70. Astruct extracts all of them.',
  },
  {
    q: 'What happens when a deadline is about to expire?',
    a: 'You can configure notifications at custom intervals — for example, 7 days before, 3 days before, and on the day. Notifications appear in the Astruct dashboard. Email and webhook notifications are available on paid plans.',
  },
  {
    q: 'Can I manually add deadlines?',
    a: 'Yes. The auto-extraction catches contractual obligations, but you can add any deadline manually — court dates, meeting schedules, internal milestones, tender submission deadlines. Manual entries have the same status tracking and notification features as auto-extracted obligations.',
  },
  {
    q: 'Does it work with subcontracts?',
    a: 'Yes. Upload your subcontracts (AS4903, AS4904, or bespoke) and the calendar extracts their time-bar obligations alongside the head contract obligations. You can filter the calendar view by contract to avoid visual overload on large projects.',
  },
  {
    q: 'Can I export the calendar to Outlook or Google Calendar?',
    a: 'Yes. Export obligations as .ics files for import into any calendar application. You can export individual obligations or the entire set. The exported events include the obligation description, source clause, and a link back to the Astruct project.',
  },
]

export default function CalendarPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div style={{ background: '#FAFAF8', color: '#1a1a1a' }}>
      {/* Hero */}
      <section className="pt-36 pb-20 px-6">
        <div className="max-w-[820px] mx-auto text-center">
          <FadeIn>
            <p className="text-xs font-semibold text-[#5C6B52] uppercase tracking-wider mb-5">Time-Bar Calendar</p>
            <h1 className="text-4xl sm:text-5xl md:text-[56px] font-medium leading-[1.1]" style={{ letterSpacing: '-0.03em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
              47 time-bar obligations. Zero missed deadlines.
            </h1>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="mt-7 text-lg sm:text-xl text-[#555] leading-relaxed max-w-[640px] mx-auto">
              Every AS4000 contract contains dozens of time-bar obligations buried across 42 clauses. Miss one, and you lose your entitlement. Astruct extracts them all and tracks every deadline automatically.
            </p>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="px-8 py-3.5 rounded-lg text-white text-sm font-medium bg-[#5C6B52] hover:bg-[#4d5a45] transition-colors">
                Try it free
              </Link>
              <Link href="/features" className="px-8 py-3.5 rounded-lg text-sm font-medium border border-[#d5d0c8] text-[#444] hover:border-[#999] transition-colors">
                All features
              </Link>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={300}>
          <div className="max-w-[900px] mx-auto mt-16">
            <ScreenshotPlaceholder label="Time-bar calendar showing monthly view with color-coded obligation deadlines extracted from an AS4000 contract" />
          </div>
        </FadeIn>
      </section>

      {/* Feature sections */}
      {sections.map((section, i) => (
        <section key={section.title} className={`py-24 px-6 ${i % 2 === 0 ? 'bg-[#f5f3ef]' : ''}`}>
          <div className="max-w-[1000px] mx-auto">
            <div className={`grid md:grid-cols-2 gap-14 items-center ${i % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
              <div className={i % 2 === 1 ? 'md:col-start-2' : ''}>
                <FadeIn>
                  <h2 className="text-3xl sm:text-4xl font-medium leading-[1.15]" style={{ letterSpacing: '-0.02em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
                    {section.title}
                  </h2>
                  <p className="mt-4 text-[#555] leading-relaxed">{section.description}</p>
                </FadeIn>
                <FadeIn delay={100}>
                  <ul className="mt-8 space-y-4">
                    {section.points.map((point) => (
                      <li key={point.label} className="flex gap-3">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#5C6B52] shrink-0" />
                        <span className="text-sm text-[#666] leading-relaxed">
                          <strong className="text-[#1a1a1a] font-medium">{point.label}.</strong> {point.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </FadeIn>
              </div>
              <FadeIn delay={150} className={i % 2 === 1 ? 'md:col-start-1' : ''}>
                <ScreenshotPlaceholder label={section.screenshot} />
              </FadeIn>
            </div>
          </div>
        </section>
      ))}

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="max-w-[720px] mx-auto">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-medium leading-[1.15] text-center" style={{ letterSpacing: '-0.02em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Frequently asked questions
            </h2>
          </FadeIn>

          <div className="mt-12 space-y-3">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 50}>
                <div className="bg-white rounded-xl border border-[#e8e5e0] overflow-hidden">
                  <button
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="text-sm font-medium text-[#1a1a1a]">{faq.q}</span>
                    <svg className={`w-4 h-4 text-[#999] shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5">
                      <p className="text-sm text-[#666] leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-[#f5f3ef]">
        <FadeIn>
          <div className="max-w-[640px] mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-medium leading-[1.15]" style={{ letterSpacing: '-0.02em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Stop tracking deadlines in a spreadsheet
            </h2>
            <p className="mt-5 text-[#555] leading-relaxed">
              Upload your contract. Every time-bar obligation is extracted and placed on a visual calendar within minutes. Click any deadline to draft the corresponding notice.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="px-8 py-3.5 rounded-lg text-white text-sm font-medium bg-[#5C6B52] hover:bg-[#4d5a45] transition-colors">
                Start free
              </Link>
              <Link href="/features" className="px-8 py-3.5 rounded-lg text-sm font-medium border border-[#d5d0c8] text-[#444] hover:border-[#999] transition-colors">
                See all features
              </Link>
            </div>
            <p className="mt-5 text-xs text-[#999]">Free for your first project &middot; No credit card required</p>
          </div>
        </FadeIn>
      </section>
    </div>
  )
}