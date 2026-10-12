import Link from 'next/link'
import { IPlus } from './icons'

export type QA = { q: string; a: React.ReactNode; text: string }

// Native <details>: works without JavaScript, keyboard and screen-reader friendly.
export function Faq({ items }: { items: QA[] }) {
  return (
    <div className="mk-faq">
      {items.map((it) => (
        <details key={it.q}>
          <summary>{it.q}<IPlus /></summary>
          <div className="mk-faq-a">{it.a}</div>
        </details>
      ))}
    </div>
  )
}

export function faqJsonLd(items: QA[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.text } })),
  }
}

// Plain text and rich answer kept side by side so the structured data never drifts from the page.
function qa(q: string, text: string, a?: React.ReactNode): QA {
  return { q, text, a: a ?? <p>{text}</p> }
}

export const HOME_FAQ: QA[] = [
  qa(
    'What is the project brain?',
    'Everything Astruct has read on a project, in one place: the contract and its special conditions, the drawings, programme and correspondence you upload, and the project mail in Outlook. Ask it anything and the answer cites the clause and page. Search it in Boolean or plain English. Draft letters, notices, variations and EOT claims from it as Word files on your letterhead.',
  ),
  qa(
    'What does Astruct take from the contract?',
    'Drop in the contract and Astruct reads it in about a minute. It sets out the contract sum, the date for practical completion, liquidated damages, the reference dates for payment claims, the time for payment schedules, and every notice period and time bar, each with its clause and page. Special conditions are read with the general conditions, so a replaced clause is not the one used.',
  ),
  qa(
    'How is it different from ChatGPT or Copilot?',
    'General chat tools answer from whatever you paste in. Astruct works from your project: the contract with its special conditions, the drawings, the programme and the project mail. Every answer cites the clause and page, and search runs across every document in the project.',
  ),
  qa(
    'Which contracts does it work with?',
    'The contract you give it. That includes AS 2124, AS 4000, AS 4300, AS 4902 and AS 4903 style head contracts and subcontracts, and bespoke or heavily amended forms. It also works with security of payment law, such as SOPA in NSW and Queensland’s BIF Act.',
  ),
  qa(
    'How does it spot variations, delays and claims in the mail?',
    'Connect Outlook and Astruct reads project mail as it arrives. It compares each direction with the scope of work in your contract and flags the ones that look like variations, flags events that may delay you, and picks up claims and payment schedules. It works upstream, for notices you must give the principal or head contractor, and downstream, for notices and claims from your subcontractors.',
  ),
  qa(
    'Can I rely on the deadlines it works out?',
    'Each deadline shows the clause text it came from and how it was counted: the notice period, business or calendar days and your state’s public holidays. It stays marked “check the clause” until someone on your team confirms the rule for the project. Astruct only reads the mailboxes you connect, so your team stays responsible for your notices. Astruct helps you give them on time.',
    <p>
      Each deadline shows the clause text it came from and how it was counted: the notice period, business or calendar
      days and your state’s public holidays. It stays marked “check the clause” until someone on your team confirms the
      rule for the project. Astruct only reads the mailboxes you connect, so your team stays responsible for your
      notices. Astruct helps you give them on time. <Link href="/support/deadlines-and-check-the-clause">How deadlines are worked out</Link>.
    </p>,
  ),
  qa(
    'Does it send anything on our behalf?',
    'No. Astruct drafts letters, notices and claims for review. Nothing leaves until a person on your team presses Send, or downloads the .docx and sends it through your normal process.',
  ),
  qa(
    'Which systems does it connect to?',
    'Outlook, today: personal and shared Microsoft 365 mailboxes. Procore, Gmail and SharePoint are available on request. Tell us when you request your trial and we will set them up with you. Documents from anywhere else can be uploaded as files, folders or zips.',
  ),
  qa(
    'How quickly does it see new mail?',
    'New mail is picked up within about five minutes. Outlook can also notify Astruct when mail arrives, so a message is often picked up sooner. It is not instant.',
  ),
  qa(
    'What do we need from IT?',
    'Each person can connect their own Outlook mailbox. Shared mailboxes need a Microsoft 365 administrator to approve Astruct once for your organisation, using a single link from Settings. Your admin also decides whose mailbox each person may search.',
    <p>
      Each person can connect their own Outlook mailbox. Shared mailboxes need a Microsoft 365 administrator to approve
      Astruct once for your organisation, using a single link from Settings. Your admin also decides whose mailbox each
      person may search. <Link href="/support/microsoft-365-admin-consent">Admin consent, step by step</Link>.
    </p>,
  ),
  qa(
    'How is Astruct priced?',
    `Per project, per month, with unlimited users. Your first project is AU$199, projects 2–5 are AU$179 each, 6–15 are AU$159 each, 16–30 are AU$139 each and every project from the 31st is AU$119. Each project is charged at the rate for its band, so 8 projects cost AU$199 + 4 × AU$179 + 3 × AU$159 = AU$1,392 a month. Prices are in Australian dollars and exclude GST.`,
    <p>
      Per project, per month, with unlimited users. Your first project is AU$199, projects 2–5 are AU$179 each, 6–15 are
      AU$159 each, 16–30 are AU$139 each and every project from the 31st is AU$119. Each project is charged at the rate
      for its band, so 8 projects cost AU$199 + 4 × AU$179 + 3 × AU$159 = AU$1,392 a month. Prices are in Australian
      dollars and exclude GST. <Link href="/pricing">Work out your price</Link>.
    </p>,
  ),
  qa(
    'How does the free trial work?',
    'Request a trial and we email you an invite link. The trial is free for 30 days, with two projects and 100 credits, and no card. Credits cover the work Astruct does for you: reading documents, answering questions and drafting. To keep going after 30 days, subscribe at the per-project price. Nothing is charged unless you do.',
  ),
  qa(
    'Where is our data stored?',
    'In Australia, in Sydney. Model requests are processed by OpenAI in the United States under its business API terms, and are not used to train models. No letter or email leaves until a person on your team presses Send.',
    <p>
      In Australia, in Sydney. Model requests are processed by OpenAI in the United States under its business API
      terms, and are not used to train models. No letter or email leaves until a person on your team presses Send. More
      on the <Link href="/security">security page</Link>.
    </p>,
  ),
]
