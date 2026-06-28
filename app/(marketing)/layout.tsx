import type { Metadata } from 'next'
import SiteHeader from '@/components/site/site-header'
import SiteFooter from '@/components/site/site-footer'
import './site.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://astruct.io'),
  title: {
    default: 'Astruct — Security of Payment software for Australian construction',
    template: '%s · Astruct',
  },
  description:
    'Compliant payment claims and payment schedules for Australian head contractors and subcontractors. Built to the Security of Payment Act in every state and territory.',
  openGraph: {
    type: 'website',
    siteName: 'Astruct',
    locale: 'en_AU',
  },
}

const ORG_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Astruct',
  url: 'https://astruct.io',
  description: 'Security of Payment software for Australian head contractors and subcontractors.',
  areaServed: 'AU',
  sameAs: [],
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="astruct-site min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }} />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
