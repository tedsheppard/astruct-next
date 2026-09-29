import type { MetadataRoute } from 'next'

const BASE = 'https://astruct.io'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const pages: [string, number, 'weekly' | 'monthly' | 'yearly'][] = [
    ['', 1, 'weekly'],
    ['/pricing', 0.8, 'monthly'],
    ['/security', 0.8, 'monthly'],
    ['/apply', 0.7, 'monthly'],
    ['/contact', 0.5, 'yearly'],
    ['/legal/privacy', 0.3, 'yearly'],
    ['/legal/terms', 0.3, 'yearly'],
  ]
  return pages.map(([p, priority, changeFrequency]) => ({ url: `${BASE}${p}`, lastModified: now, changeFrequency, priority }))
}
