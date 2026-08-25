"use client";

import Link from "next/link";
import Image from "next/image";
import { COMPANY_INFO } from "@/constants";
import { useRedSocial } from "@/hooks";

export function Footer() {
  const { data: redes } = useRedSocial();
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const servicesLinks = [
    { label: "Destinos", href: "/packages" },
    { label: "Servicios", href: "/services" },
    { label: "Paquetes Internacionales", href: "/packages" },
    { label: "Visas y Requisitos", href: "/visas" },
  ];

  const supportLinks = [
    { label: "Centro de Ayuda", href: "/help" },
    { label: "Contacto", href: "/contact" },
    { label: "Seguro de Viaje", href: "/help" },
    { label: "Términos y Condiciones", href: "/#" },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
        </svg>
      ),
      href: redes?.instagram || "https://www.instagram.com/luxviajes.ec",
    },
    {
      name: "Facebook",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      href: redes?.facebook || "https://www.facebook.com/luxviajes.ec",
    },
    {
      name: "TikTok",
      icon: (
        <svg width="20" height="20" viewBox="0 0 23 23" fill="none">
          <path
            d="M11.3145 0C17.5631 9.07103e-05 22.6289 5.0658 22.6289 11.3145C22.6288 17.563 17.563 22.6288 11.3145 22.6289C5.0658 22.6289 8.86512e-05 17.5631 0 11.3145C0 5.06575 5.06575 0 11.3145 0ZM11.4023 2.51465L11.376 13.9209C11.376 15.3207 10.1381 16.4229 8.73828 16.4229C7.33863 16.4227 6.20508 15.2893 6.20508 13.8896C6.20523 12.4901 7.33872 11.3566 8.73828 11.3564C8.84274 11.3564 8.94764 11.3772 9.04688 11.3877V8.94336C8.94241 8.93814 8.84274 8.92773 8.73828 8.92773C5.9964 8.92787 3.77164 11.1478 3.77148 13.8896C3.77148 16.6317 5.99131 18.8574 8.7334 18.8574C11.4755 18.8574 13.7002 16.6317 13.7002 13.8896V7.17285C14.5045 8.40549 15.8787 9.14746 17.3516 9.14746C17.4195 9.14745 17.4861 9.14455 17.5527 9.14062L17.7588 9.12695V6.40527C15.6541 6.25382 13.9618 4.61408 13.7422 2.51465H11.4023Z"
            fill="currentColor"
          />
        </svg>
      ),
      href: redes?.tiktok || "https://www.tiktok.com/@luxviajes.ec",
    },
    {
      name: "YouTube",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      href: redes?.youtube || "https://www.youtube.com/@LuxViajesPodcast",
    },
  ];

  return (
    <footer className="bg-white text-neutral-900 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12 py-10 sm:py-12 md:py-16">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              onClick={handleScrollToTop}
              className="inline-block mb-4"
            >
              <Image
                src="/images/footer/footer.png"
                alt={COMPANY_INFO.name}
                width={220}
                height={120}
                className="object-contain max-w-full"
              />
            </Link>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 sm:mb-6 text-primary-700">
              Servicios
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {servicesLinks.map((link, index) => (
                <li key={`service-${index}`}>
                  <Link
                    href={link.href}
                    onClick={handleScrollToTop}
                    className="text-xs sm:text-sm text-neutral-700 hover:text-primary-600 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 sm:mb-6 text-primary-700">
              Soporte
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {supportLinks.map((link, index) => (
                <li key={`support-${index}`}>
                  <Link
                    href={link.href}
                    onClick={handleScrollToTop}
                    className="text-xs sm:text-sm text-neutral-700 hover:text-primary-600 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Experience Column - Hidden on small screens, visible at md and above */}
          <div className="hidden md:block">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-primary-700">
              Síguenos
            </h4>
            <p className="text-xs md:text-sm text-neutral-700 mb-4 md:mb-6 leading-relaxed">
              Sigue nuestros viajes en redes sociales para inspiración diaria.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={`social-${index}`}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-neutral-100 hover:bg-primary-600 flex items-center justify-center transition-colors duration-200 text-primary-600 hover:text-white"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Social Links on mobile - shown as 2x2 grid */}
          <div className="col-span-2 md:hidden">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-primary-700">
              Síguenos
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {socialLinks.map((social, index) => (
                <a
                  key={`social-${index}`}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-primary-600 flex items-center justify-center transition-colors duration-200 text-primary-600 hover:text-white"
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
        <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:justify-between md:items-center py-6 text-xs text-neutral-500">
          <p className="text-center md:text-left">
            © {currentYear} {COMPANY_INFO.name}. Todos los derechos reservados |
            Diseñado por{" "}
            {/* Mandarlo a otra ventana */}
            <a
              href="https://unyxsolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors font-semibold text-blue-800"
            >
              UNYX SOLUTIONS
            </a>
          </p>
          <div className="flex gap-4 sm:gap-6 justify-center md:justify-end">
            <Link
              href="/help"
              onClick={handleScrollToTop}
              className="hover:text-primary-600 transition-colors"
            >
              Privacidad
            </Link>
            <Link
              href="/help"
              onClick={handleScrollToTop}
              className="hover:text-primary-600 transition-colors"
            >
              Términos
            </Link>
            <Link
              href="/contact"
              onClick={handleScrollToTop}
              className="hover:text-primary-600 transition-colors"
            >
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
