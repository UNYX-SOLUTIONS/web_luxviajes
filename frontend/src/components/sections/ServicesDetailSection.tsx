'use client';

import { Button } from '@/components/common';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';

interface ServiceDetail {
  id: string;
  title: string;
  label: string;
  image: string;
  description: string;
}

const SERVICES_DETAILS: ServiceDetail[] = [
  {
    id: 'flights',
    title: 'Boletos Aéreos',
    label: 'Boletos Aéreos',
    image: 'https://images.unsplash.com/photo-1436262174933-eb0264dc26e0?w=600&h=400&fit=crop',
    description:
      'Lorem ipsum dolor sit amet consectetur adipiscing, elit pellentesque ac curae tortor, convallis lacinia viverra.',
  },
  {
    id: 'visas',
    title: 'Visas y turnos',
    label: 'Visas y turnos',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop',
    description:
      'Lorem ipsum dolor sit amet consectetur adipiscing, elit pellentesque ac curae tortor, convallis lacinia viverra.',
  },
  {
    id: 'packages',
    title: 'Paquetes turísticos',
    label: 'Paquetes turísticos',
    image: 'https://images.unsplash.com/photo-1488748807830-63789f68bb65?w=600&h=400&fit=crop',
    description:
      'Lorem ipsum dolor sit amet consectetur adipiscing, elit pellentesque ac curae tortor, convallis lacinia viverra.',
  },
  {
    id: 'hotels',
    title: 'Reservas de Hoteles',
    label: 'Reservas de Hoteles',
    image: 'https://images.unsplash.com/photo-1455849318169-8c8e32a63808?w=600&h=400&fit=crop',
    description:
      'Lorem ipsum dolor sit amet consectetur adipiscing, elit pellentesque ac curae tortor, convallis lacinia viverra.',
  },
];

export function ServicesDetailSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
      }
    };

    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    checkScroll();

    return () => {
      container?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-16 md:py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Side - Sticky */}
          <div className="lg:sticky lg:top-32 lg:self-start h-fit">
            <div className="mb-8">
              <p className="text-sm font-semibold text-primary-600 uppercase tracking-wide mb-3">
                Nuestros Servicios
              </p>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                Todo lo que necesitas
                <br />
                <span className="text-primary-600">para tu viaje perfecto</span>
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-8">
                Elevamos cada trayecto a una obra maestra. Disfrute de un acompañamiento
                personalizado diseñado para los viajeros más exigentes del mundo
              </p>
            </div>

            <Link href="#all-services" className="inline-flex items-center group">
              <span className="text-sm font-semibold text-primary-600 group-hover:text-primary-700 transition">
                Ver todos
              </span>
              <svg
                className="w-4 h-4 ml-2 text-primary-600 group-hover:text-primary-700 group-hover:translate-x-1 transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Right Side - Scrollable Cards */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Scroll Container */}
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-6 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {SERVICES_DETAILS.map((service) => (
                  <div
                    key={service.id}
                    className="flex-shrink-0 w-full sm:w-96 group cursor-pointer"
                  >
                    {/* Card Container */}
                    <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                      {/* Background Image */}
                      <img
                        src={service.image}
                        alt={service.label}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />

                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                        {/* Title */}
                        <div>
                          <h3 className="text-xl font-bold">{service.title}</h3>
                        </div>

                        {/* Badge */}
                        <div className="flex justify-end">
                          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors">
                            <span>Solicitar asesoría</span>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-4 text-sm text-neutral-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Scroll Navigation Buttons */}
              <button
                onClick={() => scroll('left')}
                className="absolute -left-12 lg:-left-16 top-1/3 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
                aria-label="Scroll left"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {canScrollRight && (
                <button
                  onClick={() => scroll('right')}
                  className="absolute -right-12 lg:-right-16 top-1/3 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
                  aria-label="Scroll right"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
