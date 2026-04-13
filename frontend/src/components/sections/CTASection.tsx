'use client';

import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
          ¿Listo para tu próxima aventura?
        </h2>
        
        <p className="text-lg text-neutral-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          Nuestros especialistas están listos para diseñar un itinerario que supere todas tus expectativas. 
          Comienza hoy mismo tu viaje hacia lo extraordinario.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* WhatsApp Button */}
          <a
            href="https://wa.me/593984220600?text=Hola%2C%20quiero%20agendar%20una%20cita%20para%20planificar%20mi%20pr%C3%B3xima%20aventura"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-primary-600 font-semibold rounded-full hover:bg-neutral-100 transition-all shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949c-1.238.503-2.38 1.274-3.285 2.38C3.648 9.66 3.11 11.196 3.11 12.818c0 1.631.537 3.166 1.522 4.459l-1.616 5.914 6.06-1.591c1.29.722 2.733 1.107 4.308 1.107 5.366 0 9.522-4.169 9.522-9.122 0-2.411-.844-4.666-2.379-6.364-1.535-1.698-3.645-2.63-5.854-2.63m9.922 18.88c-5.8 5.838-15.232 5.838-21.032 0-5.8-5.838-5.8-15.297 0-21.135 5.8-5.838 15.232-5.838 21.032 0 5.8 5.838 5.8 15.297 0 21.135z" />
            </svg>
            <span>Hablar por WhatsApp</span>
          </a>

          {/* Explore Services Button */}
          <Link
            href="#services"
            className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all"
          >
            Explorar Servicios
          </Link>
        </div>
      </div>
    </section>
  );
}
