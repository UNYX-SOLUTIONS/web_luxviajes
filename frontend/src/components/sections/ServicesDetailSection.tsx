/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';

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
  return (
    <section className="py-16 md:py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Side - Sticky */}
          <div className="lg:sticky lg:top-32 lg:self-start h-fit">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-wide mb-3 text-tertiary-600">
                Nuestros Servicios
              </p>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6 text-neutral-900">
                Todo lo que necesitas
                <br />
                <span className="text-primary-600">para tu viaje perfecto</span>
              </h2>
              <p className="text-neutral-900 leading-relaxed mb-8">
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

          {/* Right Side - Vertical Cards */}
          <div className="lg:col-span-2 space-y-8">
            {SERVICES_DETAILS.map((service, index) => (
              <div key={service.id}>
                {/* Card Container */}
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group cursor-pointer">
                  {/* Background Image */}
                  <img
                    src={service.image}
                    alt={service.label}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-linear-to-b from-neutral-900/90 via-neutral-900/40 to-neutral-900/20" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                    {/* Title */}
                    <div>
                      <h3 className="text-xl font-bold">{service.title}</h3>
                    </div>

                    {/* Badge Button */}
                    <div className="flex justify-end">
                      <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors shadow-md hover:shadow-lg">
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
                <p className="mt-4 text-neutral-700 leading-relaxed">
                  {service.description}
                </p>

                {/* Divider - Hide on last item */}
                {index < SERVICES_DETAILS.length - 1 && (
                  <hr className="mt-8 border-neutral-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
