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
};

export default nextConfig;
