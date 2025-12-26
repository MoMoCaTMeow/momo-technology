import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // ビルドパフォーマンスの最適化
  swcMinify: true,
  // 静的エクスポート時の最適化
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  // ビルド時の最適化
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // クライアントサイドのビルドを最適化
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        usedExports: true,
      };
    }
    return config;
  },
  // ビルド時の警告を抑制（パフォーマンス向上）
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
