import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['pdf-parse', 'docx'],
  experimental: {
    proxyClientMaxBodySize: '50mb',
  },
};

export default nextConfig;
