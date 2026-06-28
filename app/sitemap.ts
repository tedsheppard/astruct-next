import type { MetadataRoute } from 'next'
import { FEATURE_PAGES } from '@/lib/site/features-content'
import { JURISDICTIONS, resourceHref } from '@/lib/site/brand'

const BASE = 'https://astruct.io'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticPaths = [
    '',
    '/main-contractors',
    '/subcontractors',
    '/features',
    '/pricing',
    '/resources',
    '/about',
    '/support',
    '/book-a-demo',
    '/contact',
    '/legal/terms',
    '/legal/privacy',
  ]
  const featurePaths = FEATURE_PAGES.map((f) => `/features/${f.slug}`)
  const resourcePaths = JURISDICTIONS.map((j) => resourceHref(j.code))

  return [...staticPaths, ...featurePaths, ...resourcePaths].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: now,
    changeFrequency: p === '' ? 'weekly' : 'monthly',
    priority: p === '' ? 1 : p.startsWith('/features') || p.startsWith('/resources') ? 0.8 : 0.6,
  }))
}
