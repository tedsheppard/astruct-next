import type { NextConfig } from "next";

// Pages from the old site that no longer fit what Astruct is. Each goes to the
// page that now covers it, permanently (308).
const RETIRED: [string, string][] = [
  ['/landing', '/'],
  ['/landing-legacy', '/'],
  ['/landing-payment-claims', '/'],
  ['/book-a-demo', '/request-trial'],
  ['/pilot', '/request-trial'],
  ['/pilot-onboarding', '/request-trial'],
  // The waitlist and the private pilot became the free-trial request. The app's
  // sign-in page still links to /signup-waitlist, so this one must stay.
  ['/signup-waitlist', '/request-trial'],
  ['/apply', '/request-trial'],
  ['/main-contractors', '/'],
  ['/subcontractors', '/'],
  ['/features', '/'],
  ['/features/:path*', '/'],
  ['/resources', '/'],
  ['/resources/:path*', '/'],
  ['/help', '/support'],
  ['/help/:path*', '/support/:path*'],
  ['/support/house-style-and-word-files', '/support/letterhead-and-word-files'],
  ['/support/seats-and-credits', '/support/projects-and-users'],
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
