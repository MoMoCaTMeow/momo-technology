import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    // モバイル向けの画像最適化（極限まで小さく）
    deviceSizes: [640, 750, 828, 1080],
    imageSizes: [16, 32, 48, 64, 96, 128],
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
        // チャンクサイズの最適化
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Framer Motionを別チャンクに
            framerMotion: {
              name: 'framer-motion',
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              priority: 20,
            },
            // その他のライブラリ
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
            },
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
