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
    'What is Project Brain?',
    'Project Brain is everything Astruct has read on a project, in one place: up to 10,000 uploaded documents, Outlook and Gmail mailboxes, SharePoint, OneDrive and Google Drive folders, and web platforms such as Aconex and Procore that Astruct works in on the Astruct Computer. You can search it, ask it questions and get answers with the page reference, and draft letters, notices, variations and EOT claims from it as Word files. Its agent also reads project mail as it arrives and flags variation directions and potential delays, with the notice clause and deadline.',
  ),
  qa(
    'How is it different from ChatGPT or Copilot?',
    'General chat tools answer from whatever you paste in. Astruct works from your project: the contract with its special conditions, the drawings, the programme and every connected mailbox. Answers cite the document and page, search runs across every project document, and the agent watches mail without being asked.',
  ),
  qa(
    'Which contracts does it work with?',
    'The contract you give it. That includes AS 2124, AS 4000, AS 4300, AS 4902 and AS 4903 style head contracts and subcontracts, and bespoke or heavily amended forms. Special conditions and amendments are read with the rest, so a replaced clause is not used. It also works with security of payment law, such as SOPA and Queensland’s BIF Act.',
  ),
  qa(
    'How does the agent spot variations and delays?',
    'As mail arrives, Astruct reads it for directions, instructions, RFI responses, revised drawings and programme changes. It compares each direction against the scope of work in your contract and flags the ones that look like variations, and flags events that may delay you. It works upstream, for notices you must give the principal or head contractor, and downstream, for notices and claims from your subcontractors.',
  ),
  qa(
    'Can I rely on the deadlines it works out?',
    'Each deadline shows the clause text it came from and how it was counted: the notice period, business or calendar days and your state’s public holidays. It stays marked “check the clause” until someone on your team confirms the rule for the project. Astruct only sees the mailboxes and folders you connect, so your team stays responsible for your notices. Astruct helps you give them on time.',
    <p>
      Each deadline shows the clause text it came from and how it was counted: the notice period, business or calendar
      days and your state’s public holidays. It stays marked “check the clause” until someone on your team confirms the
      rule for the project. Astruct only sees the mailboxes and folders you connect, so your team stays responsible for
      your notices. Astruct helps you give them on time. <Link href="/support/deadlines-and-check-the-clause">How deadlines are worked out</Link>.
    </p>,
  ),
  qa(
    'Does it send anything on our behalf?',
    'No. Astruct drafts letters, notices and claims for review. It never sends them. You check the draft, download the .docx and send it through your normal process.',
  ),
  qa(
    'How quickly does it see new mail?',
    'New mail is picked up within about five minutes. Outlook mailboxes can also notify Astruct when mail arrives, so a message is often picked up sooner. It is not instant.',
  ),
  qa(
    'What do we need from IT?',
    'Each person can connect their own Outlook mailbox. Shared mailboxes and SharePoint need a Microsoft 365 administrator to approve Astruct once for your organisation, using a single link from Settings. Your admin also decides whose mailbox each person may search.',
    <p>
      Each person can connect their own Outlook mailbox. Shared mailboxes and SharePoint need a Microsoft 365
      administrator to approve Astruct once for your organisation, using a single link from Settings. Your admin also
      decides whose mailbox each person may search. <Link href="/support/microsoft-365-admin-consent">Admin consent, step by step</Link>.
    </p>,
  ),
  qa(
    'Can Astruct work in Aconex or Procore?',
    'Yes, through the Astruct Computer, a cloud computer with its own browser. You sign in to the platform there yourself, and Astruct works through what your account can see, the way a person would, and brings what it finds back to the project. It does not need an API connection from the platform.',
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
    'The trial runs for 30 days. You add a card when you sign up, and it is not charged during the trial. We’ll email you 5 days before your trial ends. After that each project is billed at its per-project price, unless you cancel in Settings > Billing before the trial ends.',
  ),
  qa(
    'Where is our data stored?',
    'In Australia, in Sydney. Model requests go to OpenAI’s API under Zero Data Retention, and your data is never used to train models.',
    <p>
      In Australia, in Sydney. Model requests go to OpenAI’s API under Zero Data Retention, and your data is never used to
      train models. More on the <Link href="/security">security page</Link>.
    </p>,
  ),
]
