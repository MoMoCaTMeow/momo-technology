import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Image Gallery - 美しい写真のコレクション',
    template: '%s | Image Gallery',
  },
  description: '高品質な写真を美しく展示するモダンなギャラリーサイト',
  keywords: ['ギャラリー', '写真', 'ポートフォリオ', 'アート'],
  authors: [{ name: 'Image Gallery' }],
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://momo1105.com',
    siteName: 'Image Gallery',
    title: 'Image Gallery - 美しい写真のコレクション',
    description: '高品質な写真を美しく展示するモダンなギャラリーサイト',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Gallery - 美しい写真のコレクション',
    description: '高品質な写真を美しく展示するモダンなギャラリーサイト',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={inter.variable}>
      <body className="min-h-screen bg-[#FEFCFB]">
        {children}
      </body>
    </html>
  );
}
