import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'digmma.fr',
      },
    ],
  },
  // Configuration pour éviter les problèmes avec Edge Runtime
  serverExternalPackages: ['@prisma/client', 'prisma'],
  // Configuration pour améliorer la gestion des Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
