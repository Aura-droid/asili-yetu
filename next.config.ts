import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin(
  './i18n/request.ts'
);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'vtafgdjeongzukrofmmy.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
      }
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  } as any,
};

export default withNextIntl(nextConfig);
