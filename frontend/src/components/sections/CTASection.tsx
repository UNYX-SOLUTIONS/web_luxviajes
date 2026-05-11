"use client";

import Link from "next/link";
import { useRedSocial } from "@/hooks";

interface CTASectionProps {
  llamadaTitulo?: string;
  llamadaSubtitulo?: string;
}

/**
 * Parsea texto con formato markdown-like:
 * - *texto* se convierte en <span className="text-primary-600">texto</span>
 * - Soporta saltos de línea
 */
function parseStyledText(text: string): string {
  if (!text) return '';
  
  // Reemplazar *texto* con span coloreado (en este caso white porque el fondo es oscuro)
  let parsed = text.replace(
    /\*([^*]+)\*/g,
    '<span class="text-white font-extrabold">$1</span>'
  );
  
  // Convertir <br> y <br/> a <br /> válido
  parsed = parsed.replace(/<br\s*\/?>/gi, '<br />');
  
  // Convertir \n en <br />
  parsed = parsed.replace(/\n/g, '<br />');
  
  return parsed;
}

export function CTASection({ llamadaTitulo, llamadaSubtitulo }: CTASectionProps = {}) {
  const { data: redes } = useRedSocial();
  
  const whatsappNumber = redes?.whatsapp?.replace(/[^0-9]/g, '') || "593984220600";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hola%2C%20quiero%20agendar%20una%20cita%20para%20planificar%20mi%20pr%C3%B3xima%20aventura`;

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-6 text-white leading-tight"
          dangerouslySetInnerHTML={{
            __html: parseStyledText(
              llamadaTitulo || "¿Listo para tu próxima aventura?"
            )
          }}
        />

        <p 
          className="text-sm sm:text-base md:text-lg text-neutral-100! mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: parseStyledText(
              llamadaSubtitulo || "Nuestros especialistas están listos para diseñar un itinerario que supere todas tus expectativas. Comienza hoy mismo tu viaje hacia lo extraordinario."
            )
          }}
        />

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          {/* WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-primary-600 font-semibold text-sm sm:text-base rounded-full hover:bg-neutral-100 transition-all shadow-lg hover:shadow-xl"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="sm:w-5 sm:h-5"
            >
              <g clipPath="url(#clip0_292_749)">
                <path
                  d="M0 27.43L1.97 20.09C0.85 18.08 0.27 15.83 0.27 13.55C0.27 6.08 6.34 0 13.81 0C21.28 0 27.36 6.08 27.36 13.55C27.36 21.02 21.28 27.1 13.81 27.1C11.57 27.1 9.35 26.53 7.37 25.46L0 27.43ZM7.74 22.71L8.2 22.99C9.91 24.01 11.84 24.54 13.81 24.54C19.87 24.54 24.8 19.61 24.8 13.55C24.8 7.49 19.87 2.56 13.81 2.56C7.75 2.56 2.83 7.49 2.83 13.54C2.83 15.54 3.39 17.51 4.44 19.24L4.72 19.71L3.62 23.81L7.74 22.71Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.85 15.43C18.29 15.1 17.57 14.72 16.91 14.99C16.41 15.2 16.08 15.98 15.76 16.39C15.59 16.6 15.39 16.63 15.14 16.53C13.25 15.78 11.8 14.51 10.75 12.77C10.57 12.5 10.6 12.29 10.82 12.04C11.14 11.67 11.53 11.25 11.62 10.75C11.71 10.25 11.47 9.66999 11.26 9.21999C11 8.64999 10.7 7.83999 10.13 7.51999C9.60002 7.21999 8.91002 7.38999 8.45002 7.76999C7.64002 8.42999 7.25002 9.44999 7.27002 10.47C7.27002 10.76 7.31002 11.05 7.38002 11.33C7.54002 12 7.85002 12.63 8.20002 13.23C8.46002 13.68 8.75002 14.12 9.06002 14.54C10.07 15.91 11.33 17.11 12.79 18C13.52 18.45 14.3 18.84 15.12 19.11C16.03 19.41 16.84 19.72 17.83 19.54C18.86 19.34 19.87 18.71 20.28 17.71C20.4 17.42 20.46 17.09 20.39 16.78C20.25 16.14 19.38 15.75 18.86 15.44L18.85 15.43Z"
                  fill="currentColor"
                />
              </g>
            </svg>
            <span>Hablar por WhatsApp</span>
          </a>

          {/* Explore Services Button */}
          <Link
            href="services"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 bg-transparent border-2 border-white text-white font-semibold text-sm sm:text-base rounded-full hover:bg-white/10 transition-all"
          >
            Explorar Servicios
          </Link>
        </div>
      </div>
    </section>
  );
}
