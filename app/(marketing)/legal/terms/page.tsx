import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage, type LegalSection } from '@/components/mk/legal'
import { CONTACT_EMAIL } from '@/components/mk/links'

export const metadata: Metadata = {
  title: 'Terms of use',
  description: 'The terms that govern your use of astruct.io and the Astruct service.',
  alternates: { canonical: '/legal/terms' },
}

const SECTIONS: LegalSection[] = [
  {
    id: 'advice',
    h: '1. Not legal advice',
    body: (
      <>
        <p>
          Astruct is software. It is not a law firm and does not provide legal, financial or other professional advice.
          Using Astruct does not create a professional relationship between you and us.
        </p>
        <p>You acknowledge that:</p>
        <ul>
          <li>Astruct&rsquo;s outputs, including detected issues, deadlines and drafts, are produced with the help of artificial intelligence and may be inaccurate or incomplete;</li>
          <li>every deadline Astruct computes shows the clause it came from and must be confirmed by a person before it is relied on;</li>
          <li>you are responsible for reviewing, correcting and approving every output before you send, serve or rely on it; and</li>
          <li>you remain responsible for meeting your own contractual and statutory obligations, notices and time bars.</li>
        </ul>
        <p>Astruct never sends correspondence on your behalf. Drafts are prepared for your review.</p>
      </>
    ),
  },
  {
    id: 'accounts',
    h: '2. Accounts',
    body: (
      <p>
        You must be at least 18 and able to form a binding contract. If you use Astruct for a company, you confirm you
        have authority to bind it. Keep your account details accurate and your sign-in secure. You are responsible for
        activity under your account. We may suspend or close accounts that breach these terms.
      </p>
    ),
  },
  {
    id: 'plans',
    h: '3. Trial, plans and billing',
    body: (
      <>
        <p>
          New organisations we invite can use Astruct free for 30 days, with two projects and 100 credits. No card is
          needed and nothing is charged when the trial ends. The Free Trial Terms you accept with the invitation also
          apply to the trial. To keep going, start a paid company account. Astruct is then billed per project per month
          at the prices shown on our <Link href="/pricing">pricing page</Link>, in Australian dollars excluding GST. Each project
          is charged at the rate for its band. There is no charge per user.
        </p>
        <p>
          Subscriptions renew monthly until cancelled. Unless the law requires otherwise, fees are not refundable. We may change prices or plans for future periods and will give you reasonable notice
          of a material change.
        </p>
      </>
    ),
  },
  {
    id: 'content',
    h: '4. Your content',
    body: (
      <p>
        You keep all rights in the contracts, documents, mail and other material you upload or connect, and in the drafts
        Astruct prepares from them (<strong>Your Content</strong>). You grant us a non-exclusive licence to host, process and
        transmit Your Content only to provide and secure the service, including sending it to our service providers for
        that purpose. We never use Your Content to train models. You confirm you have the right to connect each account
        and provide each document you give us.
      </p>
    ),
  },
  {
    id: 'providers',
    h: '5. Service providers and connections',
    body: (
      <p>
        Astruct uses third-party providers to run the service, including OpenAI (model processing in the United States,
        under its business API terms), Supabase (storage in Sydney), Vercel (hosting, partly in the United States) and Stripe (billing). When you
        connect a Microsoft 365, Google or Procore account, that provider&rsquo;s own terms also apply to your use of it. We are not responsible for the
        availability of third-party services.
      </p>
    ),
  },
  {
    id: 'use',
    h: '6. Acceptable use',
    body: (
      <>
        <p>You must not:</p>
        <ul>
          <li>use Astruct unlawfully or to infringe anyone&rsquo;s rights;</li>
          <li>connect mailboxes or upload material you are not authorised to access or share;</li>
          <li>try to get around usage limits, security or access controls, or disrupt the service;</li>
          <li>reverse engineer the service, except where the law allows it; or</li>
          <li>resell Astruct or share accounts without our written agreement.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'ip',
    h: '7. Our intellectual property',
    body: (
      <p>
        Astruct&rsquo;s software, design and brand belong to us or our licensors. We grant you a limited, non-exclusive,
        non-transferable licence to use the service for your internal business purposes while your account is active. If
        you send us feedback, we may use it without obligation to you.
      </p>
    ),
  },
  {
    id: 'acl',
    h: '8. Australian Consumer Law',
    body: (
      <p>
        Nothing in these terms excludes, restricts or modifies any right or remedy you have under the Australian Consumer
        Law that cannot lawfully be excluded. Where we are allowed to limit our liability for a breach of such a guarantee,
        our liability is limited to supplying the services again or paying the cost of having them supplied again.
      </p>
    ),
  },
  {
    id: 'liability',
    h: '9. Limitation of liability',
    body: (
      <>
        <p>Subject to section 8 and to the extent the law allows:</p>
        <ul>
          <li>the service is provided as is, and we do not warrant that any output is accurate, complete or fit for a particular purpose;</li>
          <li>we are not liable for indirect or consequential loss, or loss of profit, revenue, data or opportunity;</li>
          <li>we are not liable for loss arising from reliance on an output that you did not review, including a missed notice or time bar; and</li>
          <li>our total liability is limited to the fees you paid us in the 12 months before the event giving rise to the claim, or AU$100 if greater.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'end',
    h: '10. Ending the service',
    body: (
      <p>
        You can stop using Astruct and cancel your subscription at any time. We may suspend or end access if you breach
        these terms or where the law requires it. After an account closes, we delete Your Content on request, subject to
        short backup cycles and any legal obligation to keep it.
      </p>
    ),
  },
  {
    id: 'general',
    h: '11. General',
    body: (
      <>
        <p>
          We may update these terms. The current version is always on this page with its date, and we will give notice of
          material changes. These terms are governed by the laws of Queensland, Australia, and the courts of Queensland
          have non-exclusive jurisdiction. Our <Link href="/legal/privacy">privacy policy</Link> forms part of these terms.
        </p>
        <p>
          Questions about these terms: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </>
    ),
  },
]

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      updated="13 October 2026"
      intro={
        <p>
          These terms are an agreement between you and Astruct (<strong>we</strong>, <strong>us</strong>, <strong>our</strong>)
          about your use of astruct.io, the Astruct application and related services. By using them you agree to these
          terms. If you use Astruct on behalf of an organisation, &ldquo;you&rdquo; includes that organisation.
        </p>
      }
      sections={SECTIONS}
    />
  )
}
