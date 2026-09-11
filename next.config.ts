import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['pdf-parse', 'docx', 'unpdf'],
  experimental: {
    proxyClientMaxBodySize: '50mb',
  },
  // Google's OAuth redirect URIs are registered against astruct.io, but the
  // app that finishes the flow lives at app.astruct.io. Hand the callback (and
  // any connector route) across with its query string intact.
  async redirects() {
    return [
      { source: '/api/connectors/:path*', destination: 'https://app.astruct.io/api/connectors/:path*', permanent: false },
      { source: '/connectors', destination: 'https://app.astruct.io/connectors', permanent: false },
    ];
  },
};

export default nextConfig;
