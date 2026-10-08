import type { Metadata, Viewport } from 'next'
import Header from '@/components/mk/header'
import Footer from '@/components/mk/footer'
import { MetaPixel, Reveal } from '@/components/mk/client-bits'
import { SITE_ORIGIN, CONTACT_EMAIL } from '@/components/mk/links'
import './mk.css'
import './live.css'

const TITLE = 'Astruct: Project Brain for Australian construction contracts'
const DESCRIPTION =
  'Search the whole project, up to 10,000 documents, Outlook, Gmail, SharePoint, Google Drive, Aconex and Procore, and draft letters, notices, variations and EOT claims from it. Unlimited users, priced per project. 30-day free trial.'

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
      offers: {
        '@type': 'Offer',
        price: '199',
        priceCurrency: 'AUD',
        description: 'Per project, per month, excluding GST, for the first project; projects 2–5 AU$179 each, 6–15 AU$159, 16–30 AU$139, 31 and over AU$119. Unlimited users. 30-day free trial; card required, not charged during the trial.',
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
