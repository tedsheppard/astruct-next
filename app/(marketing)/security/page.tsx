import type { Metadata } from 'next'
import Link from 'next/link'
import { CONTACT_EMAIL } from '@/components/mk/links'
import { DataFlow } from '@/components/mk/data-flow'

export const metadata: Metadata = {
  title: 'Security',
  description:
    'Stored in Sydney. Model requests processed by OpenAI in the United States under its business API terms and not used for training. Mailbox access set by your admin. Astruct never sends: you send what it drafts.',
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
      'If you choose to run chat on your own ChatGPT account, those chats go to OpenAI under your account and OpenAI’s terms for your plan, not under Astruct’s business API terms.',
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
    h: 'Periods you can check',
    p: ['Every date or period Astruct shows is counted from the words of your contract, with the clause, its page and how it was counted, and stays marked “check the clause” until your team confirms the rule. Every piece of evidence is a verbatim quote that opens its source. Astruct does not give legal advice.'],
  },
  {
    h: 'You can switch it off',
    p: [
      'Disconnect a mailbox from Settings at any time. Your Microsoft 365 admin can also revoke Astruct’s consent in Microsoft Entra.',
      <>To have your organisation’s data deleted at the end of a trial or subscription, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</>,
    ],
  },
  {
    h: 'Who processes your data',
    p: [
      'Supabase (database and file storage, Sydney). Vercel (application hosting, partly in the United States). OpenAI (model processing, United States). Stripe (billing). Microsoft, and Google or Procore where you ask us to connect them, only for the accounts you connect.',
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
        <div className="mk-wrap mk-sec-top mk-secpage-top">
          <div>
            <h1 className="mk-h1" style={{ fontSize: 'clamp(40px, 5.4vw, 72px)' }}>Your project data<br />stays yours.</h1>
            <p className="mk-lede">
              Commercial correspondence is some of the most sensitive material on a project. Here is exactly where it goes,
              who can see it, and what Astruct will and will not do with it.
            </p>
          </div>
          <DataFlow />
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
