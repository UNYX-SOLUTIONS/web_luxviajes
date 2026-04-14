'use client';

import Link from 'next/link';
import { COMPANY_INFO } from '@/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const servicesLinks = [
    { label: 'Destinations', href: '/destinations' },
    { label: 'Services', href: '/services' },
    { label: 'Luxury Fleet', href: '/luxury-fleet' },
    { label: 'Corporate Travel', href: '/corporate-travel' },
  ];

  const supportLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Travel Insurance', href: '/insurance' },
    { label: 'Contact Support', href: '/support' },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      href: '#',
    },
    {
      name: 'Instagram',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.117.626c-.79.297-1.465.772-2.043 1.35-.578.578-1.053 1.254-1.35 2.043-.293.788-.494 1.658-.553 2.936C.016 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.554 2.936.297.787.772 1.463 1.35 2.041.578.579 1.254 1.054 2.043 1.351.788.293 1.658.494 2.936.553C8.333 23.984 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.261 2.936-.554.787-.297 1.463-.772 2.041-1.35.579-.578 1.054-1.254 1.351-2.043.293-.788.494-1.658.553-2.936.057-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.261-2.148-.554-2.936-.297-.787-.772-1.463-1.35-2.041-.578-.579-1.254-1.054-2.043-1.351-.788-.293-1.658-.494-2.936-.553C15.667.016 15.26 0 12 0zm0 2.16c3.203 0 3.585.009 4.849.064 1.17.054 1.805.244 2.227.408.56.217.96.477 1.382.896.419.42.679.822.896 1.381.164.422.354 1.057.408 2.227.055 1.266.064 1.645.064 4.849s-.009 3.585-.064 4.849c-.054 1.17-.244 1.805-.408 2.227-.217.56-.477.96-.896 1.382-.42.419-.822.679-1.381.896-.422.164-1.057.354-2.227.408-1.266.055-1.645.064-4.849.064s-3.585-.009-4.849-.064c-1.17-.054-1.805-.244-2.227-.408-.56-.217-.96-.477-1.382-.896-.419-.42-.679-.822-.896-1.381-.164-.422-.354-1.057-.408-2.227C2.169 15.585 2.16 15.206 2.16 12s.009-3.585.064-4.849c.054-1.17.244-1.805.408-2.227.217-.56.477-.96.896-1.382.42-.419.822-.679 1.381-.896.422-.164 1.057-.354 2.227-.408 1.266-.055 1.645-.064 4.849-.064l-.003-.002z" />
        </svg>
      ),
      href: '#',
    },
    {
      name: 'Twitter',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 002.856-3.515 4.957 4.957 0 01-1.414.419 2.465 2.465 0 001.042-1.36 4.888 4.888 0 01-1.565.385 2.461 2.461 0 00-4.422 2.247 6.975 6.975 0 01-5.064-2.595 2.466 2.466 0 00.754 3.285 2.456 2.456 0 01-1.112-.276v.03a2.461 2.461 0 001.975 2.411 2.466 2.466 0 01-1.109.042 2.467 2.467 0 002.301 1.71 4.94 4.94 0 01-3.66 1.05A6.957 6.957 0 0010 18.429a9.947 9.947 0 005.516 1.636c6.618 0 10.223-5.48 10.223-10.222 0-.155-.003-.31-.01-.465a7.293 7.293 0 001.791-1.859z" />
        </svg>
      ),
      href: '#',
    },
  ];

  return (
    <footer className="bg-primary-50 text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-16">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-linear-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-neutral-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold">{COMPANY_INFO.name}</h3>
                <p className="text-xs text-primary-200">AGENCIA DE VIAJES</p>
              </div>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-primary-900">
              Servicios
            </h4>
            <ul className="space-y-3">
              {servicesLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-900 hover:text-primary-600 transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-primary-900">
              Support
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-900 hover:text-primary-600 transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Experience Column */}
          <div className="md:col-span-1">
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-primary-900">
              Experience
            </h4>
            <p className="text-sm mb-6 leading-relaxed">
              Siga nuestros viajes en redes sociales para inspiración diaria.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-primary-100 hover:bg-primary-600 flex items-center justify-center transition-colors duration-200 text-primary-800 hover:text-white"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-700" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center py-8 text-sm text-primary-300">
          <p>© {currentYear} {COMPANY_INFO.name}. Diseñado por UNYX SOLUTIONS</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacidad
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Términos
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
