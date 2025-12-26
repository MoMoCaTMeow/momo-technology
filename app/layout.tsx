import type { Metadata } from 'next';
import { Noto_Sans_JP, Inter } from 'next/font/google';
import './globals.css';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
});

// Inter as Geist Sans fallback (similar modern sans-serif)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://momo1105.com'),
  title: {
    default: 'AIU Cedar Society - 秋田とAIU生の可能性をつなぐ',
    template: '%s | AIU Cedar Society',
  },
  description: 'AIU Cedar Societyは秋田国際教養大学の学生主導の公認団体です。著名なゲストを招いた講演会などを通じて、学生と秋田社会をつなぎ、「出会い・学び・実践」のサイクルを創り出します。',
  keywords: ['AIU Cedar Society', '秋田国際教養大学', 'AIU', '学生団体', '講演会', '秋田', 'イベント', 'キャリア支援', '起業家', '地域活性化'],
  authors: [{ name: 'AIU Cedar Society' }],
  creator: 'AIU Cedar Society',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://momo1105.com',
    siteName: 'AIU Cedar Society',
    title: 'AIU Cedar Society - 秋田とAIU生の可能性をつなぐ',
    description: 'AIU Cedar Societyは秋田国際教養大学の学生主導の公認団体です。著名なゲストを招いた講演会などを通じて、学生と秋田社会をつなぎ、「出会い・学び・実践」のサイクルを創り出します。',
    images: [
      {
        url: '/ogp-default.jpg',
        width: 1200,
        height: 630,
        alt: 'AIU Cedar Society',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIU Cedar Society - 秋田とAIU生の可能性をつなぐ',
    description: 'AIU Cedar Societyは秋田国際教養大学の学生主導の公認団体です。著名なゲストを招いた講演会などを通じて、学生と秋田社会をつなぎ、「出会い・学び・実践」のサイクルを創り出します。',
    images: ['/ogp-default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-warm-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}

