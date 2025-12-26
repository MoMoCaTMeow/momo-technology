import Link from 'next/link';
import { Instagram } from 'lucide-react';

const footerLinks = {
  about: [
    { href: '/about', label: '私たちについて' },
    { href: '/about/history', label: '設立の経緯' },
    { href: '/about/members', label: 'メンバー紹介' },
  ],
  events: [
    { href: '/events/upcoming', label: '今後の予定' },
    { href: '/events/past', label: '過去の講演会' },
  ],
  information: [
    { href: '/media', label: 'メディア' },
    { href: '/faq', label: 'FAQ' },
    { href: '/sponsors', label: '協賛企業' },
  ],
  contact: [
    { href: '/contact', label: 'お問い合わせ' },
    { href: '/speaker-request', label: '講演者リクエスト' },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-warm-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="font-display text-lg md:text-xl font-bold text-gray-900">
                AIU Cedar Society
              </span>
            </Link>
            <p className="text-gray-700 text-sm mb-6 max-w-xs leading-relaxed">
              秋田とAIU生の可能性をつなぐ学生主導の公認団体
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/aiucedarsociety"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-700 hover:text-primary-600 hover:border-primary-500 hover:bg-primary-50 transition-all"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4 text-gray-900">
              About
            </h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Events */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4 text-gray-900">
              Events
            </h4>
            <ul className="space-y-3">
              {footerLinks.events.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information & Contact */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4 text-gray-900">
              Information
            </h4>
            <ul className="space-y-3">
              {footerLinks.information.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-display font-semibold text-sm mb-4 text-gray-900 mt-6">
              Contact
            </h4>
            <ul className="space-y-3">
              {footerLinks.contact.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-600">
            &copy; {currentYear} AIU Cedar Society. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

