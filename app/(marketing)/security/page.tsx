import type { Metadata } from 'next'
import Link from 'next/link'
import { CONTACT_EMAIL } from '@/components/mk/links'

export const metadata: Metadata = {
  title: 'Security',
  description:
    'Where Astruct stores your project data, who processes it and who can see it. Stored in Sydney. Model requests go to OpenAI in the United States under its business API terms and are not used for training. Astruct never sends a letter or email.',
  alternates: { canonical: '/security' },
}

const ROWS: { h: string; p: React.ReactNode[] }[] = [
  {
    h: 'Stored in Australia',
    p: [
      'Your projects, mail, documents and drafts are stored in Australia, in Sydney.',
      'Data is encrypted in transit and at rest.',
    ],
  },
  {
    h: 'Models run by OpenAI, in the United States',
    p: [
      'Astruct uses OpenAI’s API to read contracts, mail and documents, answer questions and prepare drafts. Model requests are processed by OpenAI in the United States, under its business API terms.',
      'If you add your own OpenAI or Anthropic API key, those chat requests go to that provider under your agreement with them, not under Astruct’s business API terms.',
    ],
  },
  {
    h: 'No training on your data',
    p: ['Under those terms, your contracts, mail, documents and drafts are not used to train models, by us or by OpenAI.'],
  },
  {
    h: 'Mailbox access set by your admin',
    p: [
      'Each person can connect their own Outlook mailbox. Shared mailboxes are connected with your Microsoft 365 administrator’s consent, given once for your organisation.',
      'Your admin decides, one user at a time, whose mailbox each person may search and use with Astruct.',
    ],
  },
  {
    h: 'Astruct never sends',
    p: ['Astruct drafts notices and correspondence for review. You check each draft and send it yourself. Nothing goes out from your mailbox.'],
  },
  {
    h: 'Dates and periods',
    p: ['A date or period in Astruct is counted from the words of your contract and shows the clause, its page and how it was counted. It stays marked “check the clause” until someone on your team confirms the rule. Quotes used as evidence are word for word and open the source document. Astruct does not give legal advice.'],
  },
  {
    h: 'Disconnecting and deleting',
    p: [
      'Disconnect a mailbox from Settings at any time. Your Microsoft 365 admin can also revoke Astruct’s consent in Microsoft Entra.',
      <>To have your organisation’s data deleted at the end of a trial or subscription, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</>,
    ],
  },
  {
    h: 'Who processes your data',
    p: [
      'Supabase (database and file storage, Sydney). Vercel (application hosting, partly in the United States). OpenAI (model processing, United States). Stripe (billing). Microsoft, Google, Dropbox, Autodesk and Procore, only for the accounts you connect.',
    ],
  },
  {
    h: 'Reporting a concern',
    p: [<>To report a security issue, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We reply to every report.</>],
  },
]

export default function SecurityPage() {
  return (
    <>
      <section className="mk-page-head">
        <div className="mk-wrap mk-page-top">
          <div>
            <h1 className="mk-h1">Security</h1>
            <p className="mk-lede">
              Project correspondence is commercially sensitive. This page sets out where Astruct keeps it, who
              processes it, who on your team can see it, and what Astruct will and won’t do with it.
            </p>
          </div>
          <dl className="mk-facts">
            <div><dt>Stored</dt><dd>Sydney, Australia</dd></div>
            <div><dt>Model requests</dt><dd>OpenAI, United States, under business API terms</dd></div>
            <div><dt>Training</dt><dd>Your data isn’t used to train models</dd></div>
            <div><dt>Mailbox access</dt><dd>Set by your Microsoft 365 admin</dd></div>
            <div><dt>Sending</dt><dd>You send. Astruct only drafts.</dd></div>
          </dl>
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
