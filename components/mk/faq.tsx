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
    'What does Astruct actually do?',
    'It stays connected to your project mailboxes and document folders, and turns commercial events into issues: variations, delays and EOTs, notices and claims. For each issue it links the evidence, finds the clause and the deadline in your contract, keeps the issue’s state, and prepares the notice for your review.',
  ),
  qa(
    'How is it different from ChatGPT or Copilot?',
    'Chat tools answer questions about whatever you give them. Astruct is connected to the project itself. It keeps an issue register, computes deadlines from your contract, and quotes the evidence with a link to its source. You can still ask it questions, and the answers cite your documents and mail.',
  ),
  qa(
    'How quickly does it see new mail?',
    'New mail is picked up within about five minutes. Outlook mailboxes can also notify Astruct when mail arrives, so a message is often picked up sooner. It is not instant, and we do not claim it is.',
  ),
  qa(
    'Can I rely on the deadlines it computes?',
    'Each deadline shows the clause text it came from and how it was counted: the notice period, business or calendar days, and public holidays in your state. It stays marked “check the clause” until someone on your team confirms the rule for the project. Your team stays responsible for your notices. Astruct helps you see them coming.',
  ),
  qa(
    'Does it send anything on our behalf?',
    'No. Astruct prepares notices and correspondence for review. It never sends them. You check the draft, download the .docx and send it through your normal process.',
  ),
  qa(
    'Which contracts does it work with?',
    'It works from the contract you give it: Australian standard forms such as AS 4000, AS 4902 and AS 2124 and their subcontract versions, and bespoke or heavily amended contracts. Special conditions and amendments are read with the rest.',
  ),
  qa(
    'What do we need from IT?',
    'Each person can connect their own mailbox. Shared mailboxes and SharePoint libraries need a Microsoft 365 administrator to grant consent to Astruct once, for your organisation. Your admin also decides whose mailbox each person may search. If you join the private pilot, we walk your admin through it.',
  ),
  qa(
    'What is a credit?',
    'Credits measure the model work Astruct does for you, such as reading new mail and documents, checking issues and preparing notices. Each user’s subscription includes 100 credits a month, pooled across your organisation. Extra credits are AU$1.00 each, billed monthly. You can see your usage at any time in Billing and credits.',
  ),
  qa(
    'Where is our data stored?',
    'In Australia, in Sydney. Model requests go to OpenAI under Zero Data Retention, and your data is never used to train models.',
    <p>
      In Australia, in Sydney. Model requests go to OpenAI under Zero Data Retention, and your data is never used to
      train models. More on the <Link href="/security">security page</Link>.
    </p>,
  ),
  qa(
    'What happens when the trial ends?',
    'The trial runs for 30 days with 100 credits and needs no card. At the end you choose whether to subscribe. Nothing is charged unless you do.',
  ),
]
