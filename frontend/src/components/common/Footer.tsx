'use client';

import Link from 'next/link';
import Image from 'next/image';
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
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.117.626c-.79.297-1.465.772-2.043 1.35-.578.578-1.053 1.254-1.35 2.043-.293.788-.494 1.658-.553 2.936C.016 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.554 2.936.297.787.772 1.463 1.35 2.041.578.579 1.254 1.054 2.043 1.351.788.293 1.658.494 2.936.553C8.333 23.984 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.261 2.936-.554.787-.297 1.463-.772 2.041-1.35.579-.578 1.054-1.254 1.351-2.043.293-.788.494-1.658.553-2.936.057-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.261-2.148-.554-2.936-.297-.787-.772-1.463-1.35-2.041-.578-.579-1.254-1.054-2.043-1.351-.788-.293-1.658-.494-2.936-.553C15.667.016 15.26 0 12 0zm0 2.16c3.203 0 3.585.009 4.849.064 1.17.054 1.805.244 2.227.408.56.217.96.477 1.382.896.419.42.679.822.896 1.381.164.422.354 1.057.408 2.227.055 1.266.064 1.645.064 4.849s-.009 3.585-.064 4.849c-.054 1.17-.244 1.805-.408 2.227-.217.56-.477.96-.896 1.382-.42.419-.822.679-1.381.896-.422.164-1.057.354-2.227.408-1.266.055-1.645.064-4.849.064s-3.585-.009-4.849-.064c-1.17-.054-1.805-.244-2.227-.408-.56-.217-.96-.477-1.382-.896-.419-.42-.679-.822-.896-1.381-.164-.422-.354-1.057-.408-2.227C2.169 15.585 2.16 15.206 2.16 12s.009-3.585.064-4.849c.054-1.17.244-1.805.408-2.227.217-.56.477-.96.896-1.382.42-.419.822-.679 1.381-.896.422-.164 1.057-.354 2.227-.408 1.266-.055 1.645-.064 4.849-.064l-.003-.002z" />
        </svg>
      ),
      href: 'https://instagram.com/luxviajes.ec',
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.95 1.399c-1.513.923-2.542 2.265-2.542 3.741 0 2.153 1.823 4.038 4.582 4.038.97 0 1.922-.178 2.818-.526l.044.02c1.497 0 2.974-.541 3.916-1.521.888-.888 1.438-2.111 1.438-3.516 0-2.775-2.195-5.047-4.9-5.047zm0-2.982c3.308 0 6 2.692 6 6s-2.692 6-6 6-6-2.692-6-6 2.692-6 6-6z" />
        </svg>
      ),
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
