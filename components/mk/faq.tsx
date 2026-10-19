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
    'What is Astruct?',
    'AI for Australian construction. You set up a project in Astruct, upload its documents and connect the systems it runs on, such as Outlook, Gmail, SharePoint and Procore. Astruct reads each document and email, files it by type and keeps a chronology. You can then search the project, ask questions about RFIs, scope and clauses, and draft variation notices, EOT claims, payment claims and letters. Answers give the document, clause and page.',
  ),
  qa(
    'What does Astruct take from the contract?',
    'Upload the contract and Astruct reads it in about a minute. It sets out the contract sum, the date for practical completion, liquidated damages, the reference dates for payment claims, the time for payment schedules and the notice periods, each with its clause and page. Special conditions are read with the general conditions, and each figure links to the words it came from.',
  ),
  qa(
    'How is it different from ChatGPT or Copilot?',
    'A general chat tool answers from whatever you paste into it. Astruct works from the whole project: the contract and its special conditions, the drawings, the programme, the project mail and the chronology kept from them. It knows the Australian standard forms, the security of payment Act in each state and how project correspondence is set out, and it gives the document, clause and page for each answer.',
  ),
  qa(
    'Which contracts does it work with?',
    'The contract you give it. That includes the AS 4000, AS 4902, AS 2124 and AS 4300 families of head contracts and subcontracts, ABIC, GC21, and bespoke or heavily amended contracts. It also knows the security of payment Act in each state and territory, such as the NSW Act and Queensland’s BIF Act.',
  ),
  qa(
    'How does it pick up variations, delays and claims in the mail?',
    'Once Outlook is connected, Astruct reads project mail as it arrives and files each email to its project. When an email reads like a variation, a delay, an EOT claim or a payment claim, Astruct opens an issue with the email and the relevant clause linked, and the period the contract gives. That works both ways: notices and claims you give the principal or head contractor, and the ones subcontractors give you.',
  ),
  qa(
    'How are dates and periods worked out?',
    'From the words of your contract. Each date shows the clause and page it came from and how it was counted: the period, business or calendar days, and your state’s public holidays. It stays marked “check the clause” until someone on your team confirms the rule. Astruct tells you what the contract says. It does not give legal advice, and your team decides what to send and when.',
    <p>
      From the words of your contract. Each date shows the clause and page it came from and how it was counted: the
      period, business or calendar days, and your state’s public holidays. It stays marked “check the clause” until
      someone on your team confirms the rule. Astruct tells you what the contract says. It does not give legal advice,
      and your team decides what to send and when. <Link href="/support/notice-periods-and-check-the-clause">How periods are counted</Link>.
    </p>,
  ),
  qa(
    'Does it send anything on our behalf?',
    'No. Astruct drafts letters, notices and claims for you to review. It doesn’t send them, and nothing goes out from your mailbox. You check the draft and send it yourself, from Outlook or as a signed letter.',
  ),
  qa(
    'Which systems does it connect to?',
    'Outlook, OneDrive and SharePoint (personal and shared Microsoft 365 mailboxes and libraries), Gmail, Google Drive, Dropbox, and Procore, which your Procore admin installs once. Aconex, Autodesk Construction Cloud, InEight / TeamBinder and Xero are connected on request. Anything else can be uploaded as files, folders and zips.',
  ),
  qa(
    'How quickly does it see new mail?',
    'Within about five minutes. Outlook can also tell Astruct when mail arrives, so a message is often picked up sooner, but it isn’t instant.',
  ),
  qa(
    'What do we need from IT?',
    'Each person can connect their own Outlook mailbox. A shared mailbox needs a Microsoft 365 administrator to approve Astruct once for your organisation, using a link from Settings. Your admin also decides whose mailbox each person can search.',
    <p>
      Each person can connect their own Outlook mailbox. A shared mailbox needs a Microsoft 365 administrator to
      approve Astruct once for your organisation, using a link from Settings. Your admin also decides whose mailbox
      each person can search. <Link href="/support/microsoft-365-admin-consent">Admin consent, step by step</Link>.
    </p>,
  ),
  qa(
    'How is Astruct priced?',
    `Per project, per month, with unlimited users. The first project is AU$199, projects 2 to 5 are AU$179 each, 6 to 15 are AU$159 each, 16 to 30 are AU$139 each and from the 31st project on it’s AU$119 each. Each project is charged at the rate for its band, so 8 projects cost AU$199 + 4 × AU$179 + 3 × AU$159 = AU$1,392 a month. Prices are in Australian dollars and exclude GST. Credits for AI use are on top, or you can run AI use on your own OpenAI or Anthropic API key.`,
    <p>
      Per project, per month, with unlimited users. The first project is AU$199, projects 2 to 5 are AU$179 each, 6 to
      15 are AU$159 each, 16 to 30 are AU$139 each and from the 31st project on it’s AU$119 each. Each project is
      charged at the rate for its band, so 8 projects cost AU$199 + 4 × AU$179 + 3 × AU$159 = AU$1,392 a month. Prices
      are in Australian dollars and exclude GST. Credits for AI use are on top, or you can run AI use on your own
      OpenAI or Anthropic API key. <Link href="/pricing">Work out your price</Link>.
    </p>,
  ),
  qa(
    'How does the free trial work?',
    'Request a trial and we email you an invite link. The trial runs for 30 days with two projects and 100 credits, and we don’t ask for a card. Credits are used when Astruct reads documents, answers questions and drafts. To keep going after 30 days, subscribe at the per-project price. Nothing is charged unless you do.',
  ),
  qa(
    'Where is our data stored?',
    'In Australia, in Sydney. Model requests are processed by OpenAI in the United States under its business API terms and are not used to train models. If you add your own OpenAI or Anthropic API key, those requests go to that provider under your agreement with them. Astruct never sends a letter or email. You send what it drafts.',
    <p>
      In Australia, in Sydney. Model requests are processed by OpenAI in the United States under its business API
      terms and are not used to train models. If you add your own OpenAI or Anthropic API key, those requests go to
      that provider under your agreement with them. Astruct never sends a letter or email. You send what it drafts.
      More on the <Link href="/security">security page</Link>.
    </p>,
  ),
]
