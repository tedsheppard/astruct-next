import type { Metadata, Viewport } from 'next'
import Header from '@/components/mk/header'
import Footer from '@/components/mk/footer'
import { MetaPixel, Reveal } from '@/components/mk/client-bits'
import { SITE_ORIGIN, CONTACT_EMAIL, TRIAL_LINE } from '@/components/mk/links'
import './mk.css'
import './live.css'
import './brain.css'
import './look.css'

const TITLE = 'Astruct: AI for construction'
const DESCRIPTION =
  'AI for construction. Put every document and email for a project in one place, then search it, ask it and draft from it, with AI that knows Australian contracts, security of payment law and how project correspondence is written.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: { default: TITLE, template: '%s · Astruct' },
  description: DESCRIPTION,
  applicationName: 'Astruct',
  openGraph: {
    type: 'website',
    siteName: 'Astruct',
    locale: 'en_AU',
    url: SITE_ORIGIN,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0b' },
  ],
}

// The organisation only: no people, titles or phone numbers.
const ORG_JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_ORIGIN}/#org`,
      name: 'Astruct',
      url: SITE_ORIGIN,
      logo: `${SITE_ORIGIN}/brand/astruct-mark-512.png`,
      email: CONTACT_EMAIL,
      areaServed: 'AU',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Astruct',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: SITE_ORIGIN,
      description: DESCRIPTION,
      featureList: [
        'Every document and email for a project in one place: uploads of thousands of files with their folders, and connected Outlook, OneDrive, SharePoint, Gmail, Google Drive and Procore',
        'Each document and email read on arrival and filed to its project by type',
        'Search across the whole project in plain English or Boolean, each result with a line on why it matches, dated by the document’s own date',
        'Answers about RFIs, scope and clauses, citing the document, clause and page',
        'Drafts variation notices, notices of delay, EOT claims, payment claims, payment schedules, letters and emails in Word on your letterhead, as .docx or PDF',
        'A day-by-day chronology of the project built from its documents and mail, each entry linked to its source, with CSV export',
        'Knows Australian standard form and bespoke contracts and the security of payment Act in each state and territory',
      ],
      offers: {
        '@type': 'Offer',
        price: '199',
        priceCurrency: 'AUD',
        description: `Per project, per month, excluding GST, for the first project; projects 2 to 5 AU$179 each, 6 to 15 AU$159, 16 to 30 AU$139, 31 and over AU$119. Unlimited users. Credits for AI use on top, or your own OpenAI or Anthropic API key. ${TRIAL_LINE}`,
      },
      publisher: { '@id': `${SITE_ORIGIN}/#org` },
    },
  ],
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mk">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }} />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <MetaPixel />
      <Reveal />
    </div>
  )
}
