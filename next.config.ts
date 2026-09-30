import type { NextConfig } from "next";

// Pages from the old site that no longer fit what Astruct is. Each goes to the
// page that now covers it, permanently (308).
const RETIRED: [string, string][] = [
  ['/landing', '/'],
  ['/landing-legacy', '/'],
  ['/landing-payment-claims', '/'],
  ['/book-a-demo', '/apply'],
  ['/pilot', '/apply'],
  ['/pilot-onboarding', '/apply'],
  ['/main-contractors', '/'],
  ['/subcontractors', '/'],
  ['/features', '/'],
  ['/features/:path*', '/'],
  ['/resources', '/'],
  ['/resources/:path*', '/'],
  ['/help', '/support'],
  ['/help/:path*', '/support/:path*'],
  ['/about', '/'],
  ['/start', '/'],
  ['/platform', '/'],
  ['/platform/:path*', '/'],
  ['/product', '/'],
  ['/solutions', '/'],
  ['/solutions/:path*', '/'],
  ['/company', '/'],
  ['/privacy', '/legal/privacy'],
  ['/terms', '/legal/terms'],
];

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['pdf-parse', 'docx', 'unpdf'],
  experimental: {
    proxyClientMaxBodySize: '50mb',
  },
  async redirects() {
    return [
      // Google's and Microsoft's OAuth redirect URIs are registered against
      // astruct.io, but the app that finishes the flow lives at app.astruct.io.
      // Hand the callback (and any connector route) across with its query string
      // intact. Do not remove.
      { source: '/api/connectors/:path*', destination: 'https://app.astruct.io/api/connectors/:path*', permanent: false },
      { source: '/connectors', destination: 'https://app.astruct.io/connectors', permanent: false },
      ...RETIRED.map(([source, destination]) => ({ source, destination, permanent: true })),
    ];
  },
};

export default nextConfig;
