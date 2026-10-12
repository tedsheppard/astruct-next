import type { Metadata, Viewport } from 'next'
import Header from '@/components/mk/header'
import Footer from '@/components/mk/footer'
import { MetaPixel, Reveal } from '@/components/mk/client-bits'
import { SITE_ORIGIN, CONTACT_EMAIL, TRIAL_LINE } from '@/components/mk/links'
import './mk.css'
import './live.css'
import './brain.css'
import './look.css'

const TITLE = 'Astruct: the project brain for Australian construction contracts'
const DESCRIPTION =
  'Drop in your contract and Astruct reads it in about a minute: contract sum, practical completion, LDs, payment claim dates and every notice period, with its clause. Every answer cites the clause and page. Notices drafted on your letterhead before the time bar. Outlook mail read for variations, delays and claims.'

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
        'Answers questions about the contract, citing the clause and page',
        'Boolean and plain-English search across project documents and mail',
        'Drafts variation notices, delay notices, EOT claims and letters on your letterhead as Word files',
        'Reads Outlook mail for variations, delays and claims',
      ],
      offers: {
        '@type': 'Offer',
        price: '199',
        priceCurrency: 'AUD',
        description: `Per project, per month, excluding GST, for the first project; projects 2–5 AU$179 each, 6–15 AU$159, 16–30 AU$139, 31 and over AU$119. Unlimited users. ${TRIAL_LINE}`,
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
