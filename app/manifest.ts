import type { MetadataRoute } from 'next'

// Served at /manifest.webmanifest. Icons are the October 2026 mark
// (launch/brand-2026-10/favicon).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Astruct',
    short_name: 'Astruct',
    description: 'Frontier AI built for Australian construction contracts.',
    start_url: '/',
    display: 'browser',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/brand/android-chrome-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/android-chrome-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/brand/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
