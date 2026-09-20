/**
 * Book a demo. What the walkthrough covers on the left, the request form on
 * the right. Same fields and the same /api/leads route as before.
 */
import type { Metadata } from 'next'
import { Check } from 'lucide-react'
import { AxRoot, AxHeader, AxFooter } from '@/components/site/ax-chrome'
import AxLeadForm from '@/components/site/ax-lead-form'
import '../landing/landing.css'
import '../ax-pages.css'

export const metadata: Metadata = {
  title: 'Book a demo',
  description: 'See Astruct on your own contracts: a guided walkthrough of compliant claims, payment schedules and the deadline engine.',
}

const COVERS = [
  'The compliant claim and payment schedule flow, end to end',
  'The business-day deadline engine for your jurisdiction',
  'The A to K ledger, variations, retention and AI validity checks',
  'How shared workspaces work between head contractor and subbie',
]

export default function BookDemoPage() {
  return (
    <AxRoot>
      <AxHeader />

      <section className="ax-sec ax-sec-first is-in">
        <div className="ax-split-form">
          <div>
            <div className="ax-page-head" style={{ marginBottom: 0 }}>
              <span className="ax-pill"><i />Book a demo</span>
              <h1>See Astruct on your own contracts.</h1>
              <p className="ax-lede">A 30-minute walkthrough, tailored to whether you make claims or assess them. No obligation.</p>
            </div>
            <ul className="ax-points">
              {COVERS.map((c) => <li key={c}><Check size={17} />{c}</li>)}
            </ul>
          </div>
          <AxLeadForm type="demo" source="book-a-demo" />
        </div>
      </section>

      <AxFooter />
    </AxRoot>
  )
}
