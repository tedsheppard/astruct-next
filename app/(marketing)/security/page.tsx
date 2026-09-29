import type { Metadata } from 'next'
import Link from 'next/link'
import { CONTACT_EMAIL } from '@/components/mk/links'

export const metadata: Metadata = {
  title: 'Security',
  description:
    'Stored in Sydney. OpenAI under Zero Data Retention. Never used for training. Mailbox access set by your admin. Drafts never sent automatically.',
  alternates: { canonical: '/security' },
}

const ROWS: { h: string; p: React.ReactNode[] }[] = [
  {
    h: 'Stored in Australia',
    p: [
      'Your projects, mail, documents and drafts are stored in Australia, in Sydney. The application that serves them runs in Sydney too.',
      'Data is encrypted in transit and at rest.',
    ],
  },
  {
    h: 'OpenAI, with Zero Data Retention',
    p: [
      'Astruct uses OpenAI’s API to read mail and documents, check issues and prepare drafts. Our OpenAI account has Zero Data Retention: requests are processed and answered, then not kept by OpenAI.',
      'Model processing may take place outside Australia. Nothing is stored there.',
    ],
  },
  {
    h: 'No training on your data',
    p: ['Your mail, documents and drafts are never used to train models, by us or by OpenAI.'],
  },
  {
    h: 'Mailbox access set by your admin',
    p: [
      'Each person can connect their own mailbox. Shared mailboxes and SharePoint libraries are connected with your Microsoft 365 administrator’s consent, given once for your organisation.',
      'Your admin decides, one user at a time, whose mailbox each person may search and use with Astruct.',
    ],
  },
  {
    h: 'Drafts are never sent automatically',
    p: ['Astruct prepares notices and correspondence for review. A person on your team checks each one and sends it through your normal process.'],
  },
  {
    h: 'Deadlines you can check',
    p: ['Every deadline shows the clause text it came from and how it was counted, and stays marked “check the clause” until your team confirms the rule. Every piece of evidence is a verbatim quote that opens its source.'],
  },
  {
    h: 'You can switch it off',
    p: [
      'Disconnect a mailbox or folder from Settings at any time. Your Microsoft 365 admin can also revoke Astruct’s consent in Microsoft Entra.',
      <>To have your organisation’s data deleted at the end of a trial or subscription, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</>,
    ],
  },
  {
    h: 'Who processes your data',
    p: [
      'Supabase (database and file storage, Sydney). Vercel (application hosting, Sydney). OpenAI (model processing, under Zero Data Retention). Stripe (billing). Microsoft and Google, only for the accounts you connect.',
    ],
  },
  {
    h: 'Reporting a concern',
    p: [<>If you think you have found a security issue, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We reply to every report.</>],
  },
]

export default function SecurityPage() {
  return (
    <>
      <section className="mk-page-head">
        <div className="mk-wrap">
          <span className="mk-kicker">Security</span>
          <h1 className="mk-h1" style={{ fontSize: 'clamp(48px, 7.4vw, 96px)' }}>Your project data<br />stays yours.</h1>
          <p className="mk-lede">
            Commercial correspondence is some of the most sensitive material on a project. Here is exactly where it goes,
            who can see it, and what Astruct will and will not do with it.
          </p>
        </div>
      </section>
      <section style={{ paddingBottom: 'clamp(96px, 12vw, 160px)' }}>
        <div className="mk-wrap">
          <div className="mk-rows">
            {ROWS.map((r) => (
              <div key={r.h}>
                <h3>{r.h}</h3>
                <div className="mk-prose" style={{ maxWidth: 'none' }}>
                  {r.p.map((x, i) => <p key={i}>{x}</p>)}
                </div>
              </div>
            ))}
          </div>
          <p className="mk-fine" style={{ marginTop: 32 }}>
            Read the <Link href="/legal/privacy" style={{ textDecoration: 'underline' }}>privacy policy</Link> for how we handle personal information.
          </p>
        </div>
      </section>
    </>
  )
}
