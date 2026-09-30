import type { Metadata } from 'next'
import ApplyForm from '@/components/mk/apply-form'
import { ICheck } from '@/components/mk/icons'

export const metadata: Metadata = {
  title: 'Apply for the private pilot',
  description:
    'A guided start with Astruct on one live project: we connect your mail and documents with you, set up the contract rules, and work through the first issues together.',
  alternates: { canonical: '/apply' },
}

export default function ApplyPage() {
  return (
    <div className="mk-wrap">
      <div className="mk-apply">
        <div className="mk-apply-aside">
          <h1 className="mk-h2">Start on one live project, with us.</h1>
          <p className="mk-lede">
            The pilot is a guided start for a small number of Australian contractors. Four short steps. It takes about
            three minutes.
          </p>
          <ul className="mk-apply-points">
            <li><ICheck /><span><b>Set up with you</b>We connect the project mailboxes and folders with your team and your IT admin.</span></li>
            <li><ICheck /><span><b>Your contract, your rules</b>We load the contract and your commercial lead confirms each notice rule before it is relied on.</span></li>
            <li><ICheck /><span><b>You stay in control</b>Astruct prepares notices for review. Nothing is sent without a person.</span></li>
          </ul>
        </div>
        <ApplyForm />
      </div>
    </div>
  )
}
