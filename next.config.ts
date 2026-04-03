import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse', 'docx'],
  experimental: {
    proxyClientMaxBodySize: '50mb',
  },
};

export default nextConfig;
