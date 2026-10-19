import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage, type LegalSection } from '@/components/mk/legal'
import { CONTACT_EMAIL } from '@/components/mk/links'

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'How Astruct collects, uses, stores and protects personal information.',
  alternates: { canonical: '/legal/privacy' },
}

const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>

const SECTIONS: LegalSection[] = [
  {
    id: 'collect',
    h: '1. What we collect',
    body: (
      <>
        <p>We collect the following kinds of personal information:</p>
        <ul>
          <li><strong>Contact and application details</strong> you give us on this website, for example when you request a free trial or email us: your name, work email, company, role and your answers to the request questions.</li>
          <li><strong>Account information</strong>: your name, email address, organisation and sign-in details when you create an account or are invited to one.</li>
          <li><strong>Project content</strong>: the contracts, documents, mail, drafts and other material you upload, or that Astruct reads from the mailboxes and folders you connect (<strong>Your Content</strong>). Your Content may contain personal information about you and other people, such as the names and contact details of people you correspond with.</li>
          <li><strong>Connected-account data</strong>: where you or your administrator connect a Microsoft 365, Google, Dropbox, Autodesk or Procore account, the mail and files Astruct is permitted to read from it.</li>
          <li><strong>Usage and billing data</strong>: your plan, usage and billing details (including the card you add if you start a paid company account), handled by our payment processor. We do not store full card numbers.</li>
          <li><strong>Technical data</strong>: device and browser type, IP address, log data and cookie identifiers.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'use',
    h: '2. How we use it',
    body: (
      <>
        <p>We use personal information to:</p>
        <ul>
          <li>provide and operate Astruct, including reading your connected sources, detecting issues, linking evidence, counting periods from your contract and preparing drafts for your review;</li>
          <li>respond to trial requests and enquiries, and set up and support your account;</li>
          <li>measure usage, administer plans and process payments;</li>
          <li>keep Astruct secure and detect misuse; and</li>
          <li>meet our legal obligations.</li>
        </ul>
        <p>We do not sell personal information. Your Content is never used to train models, by us or by our AI provider.</p>
      </>
    ),
  },
  {
    id: 'storage',
    h: '3. Where it is stored',
    body: (
      <p>
        Your account, Your Content and trial requests are stored in Australia, in Sydney. Data is encrypted in transit and
        at rest. AI processing and parts of the hosting take place in the United States (sections 4 and 5).
      </p>
    ),
  },
  {
    id: 'ai',
    h: '4. AI processing',
    body: (
      <p>
        To read mail and documents, check issues and prepare drafts, Astruct sends the relevant parts of Your Content to
        OpenAI&rsquo;s API. OpenAI processes these requests in the United States under its business API terms, and does not
        use data sent through its business API to train its models. Astruct&rsquo;s chat runs on Astruct credits
        or your own OpenAI or Anthropic API key (Settings, Model account). If you add your own API key, those requests go
        to that provider under your agreement with them, and that provider&rsquo;s terms apply to how it handles them.
      </p>
    ),
  },
  {
    id: 'providers',
    h: '5. Service providers and overseas disclosure',
    body: (
      <>
        <p>
          We use these service providers: Supabase (database and file storage, Sydney), Vercel (hosting, partly in the United States), OpenAI (model
          processing, United States), Stripe (billing), Microsoft, Google, Dropbox, Autodesk and Procore (only for the accounts you connect),
          and Meta (website advertising measurement, see section 7). Each handles data under its own terms.
        </p>
        <p>
          Some providers may process data outside Australia. Where we disclose personal information overseas, we take
          reasonable steps to ensure it is handled consistently with the Australian Privacy Principles. We may also disclose
          personal information to professional advisers, to a purchaser of our business, or where required or authorised
          by law.
        </p>
      </>
    ),
  },
  {
    id: 'mailboxes',
    h: '6. Mailboxes and connected accounts',
    body: (
      <>
        <p>
          Astruct only reads the mailboxes and folders that you, or your organisation&rsquo;s administrator, connect. Your
          administrator decides whose mailbox each person in your organisation may search and use with Astruct. Astruct
          prepares drafts for review and never sends them on your behalf.
        </p>
        <p>
          Astruct&rsquo;s use of information received from Google APIs adheres to the{' '}
          <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>,
          including the Limited Use requirements. We do not use Google or Microsoft user data for advertising.
        </p>
        <p>You can disconnect an account at any time in Settings. Your Microsoft 365 or Google administrator can also revoke Astruct&rsquo;s access.</p>
      </>
    ),
  },
  {
    id: 'cookies',
    h: '7. Cookies and measurement',
    body: (
      <p>
        We use essential cookies to operate the website and keep you signed in to the app. On this website we use the
        Meta Pixel to measure visits and trial requests from our advertising. It records page views and, when you
        request a trial, the fact that you did. It does not receive your answers. If you arrive from an ad, we keep the
        ad parameters in the link (such as utm_campaign) in your browser for up to 30 days and store them with your trial
        request, so we know which ad brought you. You can
        block or clear cookies and site data in your browser.
      </p>
    ),
  },
  {
    id: 'retention',
    h: '8. Retention',
    body: (
      <p>
        We keep personal information for as long as we need it to provide Astruct and for legitimate business and legal
        purposes. Your Content is kept until you delete it or your organisation&rsquo;s account is closed, subject to short
        backup cycles. You can ask us to delete a trial request at any time.
      </p>
    ),
  },
  {
    id: 'rights',
    h: '9. Access, correction and complaints',
    body: (
      <>
        <p>
          You may ask for access to, or correction of, the personal information we hold about you, or ask us to delete it.
          Email {mail}. We may need to verify your identity.
        </p>
        <p>
          If you have a privacy concern, contact us and we will investigate and respond. If you are not satisfied with our
          response, you can complain to the Office of the Australian Information Commissioner at oaic.gov.au. If we become
          aware of an eligible data breach, we will respond under the Notifiable Data Breaches scheme.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    h: '10. Changes and contact',
    body: (
      <p>
        We may update this policy. The current version is always on this page with its date. For privacy questions or
        requests, email {mail}. See also our <Link href="/legal/terms">terms</Link> and <Link href="/security">security</Link> page.
      </p>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      updated="17 October 2026"
      intro={
        <p>
          This policy explains how Astruct (<strong>we</strong>, <strong>us</strong>, <strong>our</strong>) collects, uses,
          discloses and protects personal information when you use astruct.io, the Astruct application and related
          services. We handle personal information in line with the Privacy Act 1988 (Cth) and the Australian Privacy
          Principles.
        </p>
      }
      sections={SECTIONS}
    />
  )
}
