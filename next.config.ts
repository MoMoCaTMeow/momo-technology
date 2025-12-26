import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Static exportでは画像最適化を無効化
  },
  trailingSlash: true,
};

export default nextConfig;

