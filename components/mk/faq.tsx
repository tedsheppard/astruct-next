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
    'Everything Astruct has read on a project, in one place: the contract and its special conditions, the documents you upload and the project mail in Outlook, each filed by type, with a chronology built from them. Ask it anything and the answer quotes the clause and cites the page. Search every page in Boolean or plain English. Draft letters, notices and claims from it in Word, on your letterhead.',
  ),
  qa(
    'What does Astruct take from the contract?',
    'Drop in the contract and Astruct reads it in about a minute. It sets out the contract sum, the date for practical completion, liquidated damages, the reference dates for payment claims, the time for payment schedules, and every notice period, each with its clause and page. Special conditions are read with the general conditions, and each figure links to the words it came from.',
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
    'How does it find variations, delays and claims in the mail?',
    'Connect Outlook and Astruct reads project mail as it arrives and files each email to its project. When an email looks like a variation, a delay, an EOT claim or a payment claim, it opens an issue with the evidence and the clause linked, and the period the contract states. It works both ways: notices and claims you give the principal or head contractor, and those you receive from subcontractors.',
  ),
  qa(
    'How are dates and periods worked out?',
    'From the words of your contract. Each date shows the clause and page it came from and how it was counted: the period, business or calendar days and your state’s public holidays. It stays marked “check the clause” until someone on your team confirms the rule. Astruct says what the contract says. It does not give legal advice, and your team decides what to send and when.',
    <p>
      From the words of your contract. Each date shows the clause and page it came from and how it was counted: the
      period, business or calendar days and your state’s public holidays. It stays marked “check the clause” until
      someone on your team confirms the rule. Astruct says what the contract says. It does not give legal advice, and
      your team decides what to send and when. <Link href="/support/notice-periods-and-check-the-clause">How periods are counted</Link>.
    </p>,
  ),
  qa(
    'Does it send anything on our behalf?',
    'No. Astruct drafts letters, notices and claims for review. It never sends, and nothing goes out from your mailbox. You check the draft and send it yourself, from Outlook or as a signed letter.',
  ),
  qa(
    'Which systems does it connect to?',
    'Outlook: personal and shared Microsoft 365 mailboxes. Procore, Gmail, SharePoint and other apps connect from the Apps page. Tell us when you request your trial and we will set them up with you. Any web app can also be opened in your cloud computer, and documents from anywhere else can be uploaded as files and folders.',
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
    `Per project, per month, with unlimited users. Your first project is AU$199, projects 2–5 are AU$179 each, 6–15 are AU$159 each, 16–30 are AU$139 each and every project from the 31st is AU$119. Each project is charged at the rate for its band, so 8 projects cost AU$199 + 4 × AU$179 + 3 × AU$159 = AU$1,392 a month. Prices are in Australian dollars and exclude GST. Credits for AI use are on top, or AI work can run on your own OpenAI API key.`,
    <p>
      Per project, per month, with unlimited users. Your first project is AU$199, projects 2–5 are AU$179 each, 6–15 are
      AU$159 each, 16–30 are AU$139 each and every project from the 31st is AU$119. Each project is charged at the rate
      for its band, so 8 projects cost AU$199 + 4 × AU$179 + 3 × AU$159 = AU$1,392 a month. Prices are in Australian
      dollars and exclude GST. Credits for AI use are on top, or AI work can run on your own OpenAI
      API key. <Link href="/pricing">Work out your price</Link>.
    </p>,
  ),
  qa(
    'How does the free trial work?',
    'Request a trial and we email you an invite link. The trial is free for 30 days, with two projects and 100 credits, and no card. Credits cover the work Astruct does for you: reading documents, answering questions and drafting. To keep going after 30 days, subscribe at the per-project price. Nothing is charged unless you do.',
  ),
  qa(
    'Where is our data stored?',
    'In Australia, in Sydney. Model requests are processed by OpenAI in the United States under its business API terms, and are not used to train models. If you add your own OpenAI API key, those requests go to OpenAI under your agreement with them. Astruct never sends a letter or email: you send what it drafts.',
    <p>
      In Australia, in Sydney. Model requests are processed by OpenAI in the United States under its business API
      terms, and are not used to train models. If you add your own OpenAI API key, those requests go to
      that provider under your agreement with them. Astruct never sends a letter or email: you send what it drafts. More on
      the <Link href="/security">security page</Link>.
    </p>,
  ),
]
