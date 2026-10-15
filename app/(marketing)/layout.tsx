import type { Metadata, Viewport } from 'next'
import Header from '@/components/mk/header'
import Footer from '@/components/mk/footer'
import { MetaPixel, Reveal } from '@/components/mk/client-bits'
import { SITE_ORIGIN, CONTACT_EMAIL, TRIAL_LINE } from '@/components/mk/links'
import './mk.css'
import './live.css'
import './brain.css'
import './look.css'

const TITLE = 'Astruct: contract administration for Australian construction'
const DESCRIPTION =
  'Astruct reads the contract, files every document and email to its project, keeps the chronology and answers with the clause and page. Notices, letters and claims are drafted from the contract and the evidence, in Word, on your letterhead. You check them and send them.'

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
        'Reads construction contracts: contract sum, practical completion, liquidated damages, payment claim dates and notice periods, with the clause and page',
        'Files every document and email to its project, by type',
        'Chronology of the project, each entry linked to its source, with CSV export',
        'Boolean and plain-English search across every page of every document and email',
        'Answers questions about the contract, quoting the clause and citing the page',
        'Drafts notices, letters and claims on your letterhead in a Word editor, as .docx or PDF',
        'A cloud computer for each user, with a browser and a terminal',
      ],
      offers: {
        '@type': 'Offer',
        price: '199',
        priceCurrency: 'AUD',
        description: `Per project, per month, excluding GST, for the first project; projects 2 to 5 AU$179 each, 6 to 15 AU$159, 16 to 30 AU$139, 31 and over AU$119. Unlimited users. Credits for AI use on top, or AI work on your own ChatGPT account. ${TRIAL_LINE}`,
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
