import type { MetadataRoute } from 'next'
import { getArticles } from '@/lib/help'

const BASE = 'https://astruct.io'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const pages: [string, number, 'weekly' | 'monthly' | 'yearly'][] = [
    ['', 1, 'weekly'],
    ['/pricing', 0.8, 'monthly'],
    ['/security', 0.8, 'monthly'],
    ['/apply', 0.7, 'monthly'],
    ['/support', 0.7, 'weekly'],
    ['/contact', 0.5, 'yearly'],
    ['/legal/privacy', 0.3, 'yearly'],
    ['/legal/terms', 0.3, 'yearly'],
  ]
  for (const a of getArticles()) pages.push([`/support/${a.slug}`, 0.5, 'monthly'])
  return pages.map(([p, priority, changeFrequency]) => ({ url: `${BASE}${p}`, lastModified: now, changeFrequency, priority }))
}
