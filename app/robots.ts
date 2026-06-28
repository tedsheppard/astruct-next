import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/settings', '/setup', '/composer', '/knowledge-base', '/letterheads', '/notices'],
      },
    ],
    sitemap: 'https://astruct.io/sitemap.xml',
    host: 'https://astruct.io',
  }
}
