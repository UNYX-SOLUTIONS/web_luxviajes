'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChatBubbleLeftIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import { COMPANY_INFO } from '@/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const servicesLinks = [
    { label: 'Destinos', href: '/packages' },
    { label: 'Servicios', href: '/services' },
    { label: 'Paquetes Internacionales', href: '/packages' },
    { label: 'Visas y Documentación', href: '/visas' },
  ];

  const supportLinks = [
    { label: 'Centro de Ayuda', href: '/help' },
    { label: 'Contacto', href: '/contact' },
    { label: 'Seguro de Viaje', href: '/help' },
    { label: 'Términos y Condiciones', href: '/terms' },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      href: 'https://facebook.com/luxviajes.ec',
    },
    {
      name: 'Instagram',
      icon: <GlobeAltIcon className="w-5 h-5" />,
      href: 'https://instagram.com/luxviajes.ec',
    },
    {
      name: 'WhatsApp',
      icon: <ChatBubbleLeftIcon className="w-5 h-5" />,
      href: 'https://wa.me/593964220600',
    },
  ];

  return (
    <footer className="bg-white text-neutral-900 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-16">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link href="/" onClick={handleScrollToTop} className="inline-block mb-4">
              <Image
                src="/images/footer/footer.png"
                alt={COMPANY_INFO.name}
                width={160}
                height={80}
                className="h-auto w-auto"
              />
            </Link>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-primary-700">
              Servicios
            </h4>
            <ul className="space-y-3">
              {servicesLinks.map((link, index) => (
                <li key={`service-${index}`}>
                  <Link
                    href={link.href}
                    onClick={handleScrollToTop}
                    className="text-sm text-neutral-700 hover:text-primary-600 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-primary-700">
              Soporte
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={`support-${index}`}>
                  <Link
                    href={link.href}
                    onClick={handleScrollToTop}
                    className="text-sm text-neutral-700 hover:text-primary-600 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Experience Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-primary-700">
              Síguenos
            </h4>
            <p className="text-sm text-neutral-700 mb-6 leading-relaxed">
              Sigue nuestros viajes en redes sociales para inspiración diaria.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={`social-${index}`}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-primary-600 flex items-center justify-center transition-colors duration-200 text-primary-600 hover:text-white"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-200" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center py-6 text-xs text-neutral-500">
          <p>© {currentYear} {COMPANY_INFO.name}. Todos los derechos reservados | Diseñado por UNYX SOLUTIONS</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" onClick={handleScrollToTop} className="hover:text-primary-600 transition-colors">
              Privacidad
            </Link>
            <Link href="/terms" onClick={handleScrollToTop} className="hover:text-primary-600 transition-colors">
              Términos
            </Link>
            <Link href="/contact" onClick={handleScrollToTop} className="hover:text-primary-600 transition-colors">
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
