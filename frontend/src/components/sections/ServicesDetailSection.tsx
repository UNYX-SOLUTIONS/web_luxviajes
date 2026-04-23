"use client";

import Link from "next/link";
import Image from "next/image";
import { ContactDialog } from "../common/contact_dialog";
import { useEffect, useRef, useState } from "react";

interface ServiceDetail {
  id: string;
  title: string;
  label: string;
  image: string;
  description: string;
}

const SERVICES_DETAILS: ServiceDetail[] = [
  {
    id: "packages",
    title: "Paquetes turísticos",
    label: "Paquetes turísticos",
    image: "/images/services/packages.png",
    description:
      "Experiencias diseñadas a medida para vivir aventuras inolvidables en los destinos más hermosos del mundo.",
  },
  {
    id: "visas",
    title: "Visas y Pasaportes",
    label: "Visas y Pasaportes",
    image: "/images/services/visas.png",
    description:
      "Gestión rápida y profesional de tus trámites migratorios sin complicaciones.",
  },
  {
    id: "flights",
    title: "Boletos Aéreos",
    label: "Boletos Aéreos",
    image: "/images/services/flights.png",
    description:
      "Acceso a los mejores precios y aerolíneas premium para tu viaje perfecto.",
  },
  {
    id: "hotels",
    title: "Reservas de Hoteles",
    label: "Reservas de Hoteles",
    image: "/images/services/hotels.png",
    description:
      "Alojamientos de lujo seleccionados en los destinos más deseados del mundo.",
  },
];

export function ServicesDetailSection() {
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const sectionElement = sectionRef.current;
    if (!sectionElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Entra a la sección: hacer animación
        // Sale de la sección: resetear para permitir reinicio
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 },
    );

    observer.observe(sectionElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-20 bg-[#F8F5FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Side - Sticky */}
          <div className="lg:sticky lg:top-32 lg:self-start h-fit">
            <div className="mb-8">
              <p
                className={`text-base font-semibold uppercase tracking-wide mb-3 text-[#880000]! motion-safe:transition-all motion-safe:duration-1200 motion-safe:ease-out ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{transitionDelay: "380ms"}}
              >
                Nuestros Servicios
              </p>
              <h2
                className={`text-3xl md:text-4xl font-bold leading-tight mb-6 text-neutral-900 motion-safe:transition-all motion-safe:duration-1500 motion-safe:ease-out ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-38"
                }`}
                style={{ transitionDelay: "450ms" }}
              >
                Todo lo que necesitas
                <br />
                <span className="text-primary-600">para tu viaje perfecto</span>
              </h2>
              <p
                className={`text-neutral-900 leading-relaxed mb-8 motion-safe:transition-all motion-safe:duration-1600 motion-safe:ease-out ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-35"
                }`}
                style={{ transitionDelay: "380ms" }}
              >
                Elevamos cada trayecto a una obra maestra. Disfrute de un
                acompañamiento personalizado diseñado para los viajeros más
                exigentes del mundo
              </p>
            </div>

            <Link
              href="services"
              className={`inline-flex items-center group motion-safe:transition-all motion-safe:duration-1500 motion-safe:ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-15"
              }`}
              style={{ transitionDelay: "280ms" }}
            >
              <span className="text-sm font-semibold text-primary-600 group-hover:text-primary-700 transition">
                Ver todos
              </span>
              <svg
                className="w-4 h-4 ml-2 text-primary-600 group-hover:text-primary-700 group-hover:translate-x-1 transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {/* Right Side - Vertical Cards */}
          <div className="lg:col-span-2 space-y-8">
            {SERVICES_DETAILS.map((service, index) => (
              <div
                key={service.id}
              >
                {/* Card Container */}
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group hover:-translate-y-1">
                  {/* Background Image */}
                  <Image
                    src={service.image}
                    alt={service.label}
                    fill
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                      <button onClick={() => setShowContactDialog(true)} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors shadow-md hover:shadow-lg cursor-pointer">
                        <span>Solicitar asesoría</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
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

        {/* Contact Dialog */}
        <ContactDialog
          isOpen={showContactDialog}
          onClose={() => setShowContactDialog(false)}
          whatsappNumber="593964220600"
          phoneNumber="+593964220600"
          videoCallUrl="/contact"
        />
      </div>
    </section>
  );
}
