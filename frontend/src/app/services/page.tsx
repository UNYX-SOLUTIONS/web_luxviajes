"use client";

/* eslint-disable @next/next/no-img-element */
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ContactDialog } from "@/components/common/contact_dialog";
import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import { useRedSocial, useServicioData } from "@/hooks";
import { Testimonio } from "@/types";
 
 
function parseStyledText(text: string): string {
  let parsed = text.replace(/\*([^*]+)\*/g, '<span class="text-primary-600">$1</span>');
  parsed = parsed.replace(/<br\s*\/?>/gi, '<br />');
  parsed = parsed.replace(/\n/g, '<br />');
  return parsed;
}

export default function ServicesPage() {
  const { data: redes } = useRedSocial();
  const { data: servicioData } = useServicioData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-advance de testimonios cada 4 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const items = servicioData?.testimonios || [];
          return items.length > 0 ? (prev + 1) % items.length : 0;
        });
        setIsTransitioning(false);
      }, 300);
    }, 5000);

    return () => clearInterval(timer);
  }, [servicioData?.testimonios]);

  const getVisibleTestimonials = () => {
    const items = servicioData?.testimonios || [];
    const indices = [
      (currentIndex - 1 + items.length) % items.length,
      currentIndex,
      (currentIndex + 1) % items.length,
    ];
    return indices.map((i) => ({ ...items[i], index: i }));
  };

  const nextTestimonial = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      const items = servicioData?.testimonios || [];
      setCurrentIndex((prev) => (prev + 1) % items.length);
      setIsTransitioning(false);
    }, 300);
  };

  const prevTestimonial = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      const items = servicioData?.testimonios || [];
      setCurrentIndex(
        (prev) => (prev - 1 + items.length) % items.length,
      );
      setIsTransitioning(false);
    }, 300);
  };
  return (
    <>
      {" "}
      <section className="relative overflow-hidden bg-neutral-900 h-screen">
        <div className="absolute inset-0">
          <img
            src="/images/services/hero.png"
            alt="Servicios"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-30 sm:py-40 md:py-50 sm:px-6 lg:px-8 mt-20 sm:mt-0">
          <div className="max-w-2xl text-white">
            <span className="inline-flex rounded-full bg-tertiary-800 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-tertiary-100">
              Viaje Exclusivo
            </span>
            <h1 
              className="mt-5 text-md sm:text-5xl font-extrabold leading-tight md:text-6xl lg:text-7xl pb-2"
              dangerouslySetInnerHTML={{
                __html: parseStyledText(servicioData?.heroTitulo || "Tu Viaje")
              }}
            />

            <div className="py-2 md:py-4">
              <p 
                className="mt-5 sm:mt-5 text-sm sm:text-base md:text-lg lg:text-2xl font-regular text-white!"
                dangerouslySetInnerHTML={{
                  __html: parseStyledText(servicioData?.heroSubtitulo || "Elevamos tus experiencias de viaje a una obra maestra. Un servicio de guante blanco diseñado para quienes buscan lo extraordinario.")
                }}
              />
            </div>

            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => setShowContactDialog(true)}
                className="inline-flex rounded-full bg-primary-600 px-5 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-semibold text-white shadow-lg transition hover:bg-primary-700"
              >
                Diseñar Mi Viaje
                <ArrowRightIcon className="ml-2 h-3.5 w-3.5 md:h-4 md:w-4" />
              </button>
              <svg
                width="14"
                height="18"
                viewBox="0 0 16 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="hidden sm:block"
              >
                <path
                  d="M6.95 13.55L12.6 7.9L11.175 6.475L6.95 10.7L4.85 8.6L3.425 10.025L6.95 13.55ZM8 20C5.68333 19.4167 3.77083 18.0875 2.2625 16.0125C0.754167 13.9375 0 11.6333 0 9.1V3L8 0L16 3V9.1C16 11.6333 15.2458 13.9375 13.7375 16.0125C12.2292 18.0875 10.3167 19.4167 8 20ZM8 17.9C9.73333 17.35 11.1667 16.25 12.3 14.6C13.4333 12.95 14 11.1167 14 9.1V4.375L8 2.125L2 4.375V9.1C2 11.1167 2.56667 12.95 3.7 14.6C4.83333 16.25 6.26667 17.35 8 17.9Z"
                  fill="#FFDDBB"
                />
              </svg>
              <span className="hidden sm:inline text-xs md:text-sm text-primary-100">
                Acompañamiento 24/7
              </span>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-60 bg-white"
          style={{ clipPath: "polygon(0 95%, 100% 0, 100% 100%, 0 100%)" }}
        />
      </section>
      <section className="bg-white py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 md:mb-10 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#661AA3] md:text-4xl">
                {servicioData?.serviciosTitulo || "Nuestra Propuesta de Valor"}
              </h2>
              <p className="mt-1 md:mt-2 max-w-xl text-xs sm:text-sm text-[#4C4452]">
                {servicioData?.serviciosDescripcion || "Cada detalle es orquestado por expertos para asegurar que tu unica preocupacion sea disfrutar el horizonte."}
              </p>
            </div>
            <div className="hidden h-0.5 w-16 bg-tertiary-500 md:block" />
          </div>

          <div className="grid grid-cols-1 gap-3 md:gap-4 md:grid-cols-3">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(servicioData?.tarjeta_servicios || []).map((card: any, index: number) => {
              const cards = servicioData?.tarjeta_servicios || [];
              const isSecond = index === 1;
              const isLast = index === cards.length - 1;
              
              return (
                <article
                  key={card.titulo || card.title}
                  className={[
                    "group relative overflow-hidden rounded-lg md:rounded-xl",
                    isSecond ? "md:col-span-2" : "",
                    isLast ? "md:col-span-3" : "",
                  ].join(" ")}
                >
                  <img
                    src={card.imagen || card.image}
                    alt={card.titulo || card.title}
                    className={[
                      "w-full object-cover transition duration-300 group-hover:scale-105",
                      isLast ? "h-32 sm:h-40 md:h-44 lg:h-52" : "h-40 sm:h-48 md:h-52 lg:h-60",
                    ].join(" ")}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-neutral-950/75 via-neutral-900/25 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4">
                    <h3 className="text-base md:text-xl font-semibold text-white">
                      {card.titulo || card.title}
                    </h3>
                    {(card.descripcion || card.subtitle) && (
                      <p className="mt-0.5 md:mt-1 text-xs md:text-sm text-white/90">
                        {card.descripcion || card.subtitle}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-primary-50 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs md:text-md font-semibold text-[#880000]!">Testimonios</p>
          <h2 className="mt-1 text-2xl md:text-4xl font-bold text-neutral-900">
            Historias de Viajeros
          </h2>

          <div className="mt-6 md:mt-10 flex items-center justify-center gap-3 md:gap-6">
            <button
              onClick={prevTestimonial}
              className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-[#500088] text-white hover:bg-[#661AA3] transition p-1.5 md:p-2 shrink-0"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </button>

            <div className={`transition-all duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              <div className="grid grid-cols-1 gap-10 md:grid-cols-3 w-full max-w-6xl">
                
                {getVisibleTestimonials().map((item: Testimonio, position: number) => {
                const rating = item.calificacion || 5;
                const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
                
                return (
                  <article
                    key={`testimonio-${item.id}-${position}`}
                    className={`relative rounded-2xl shadow-lg transition-all duration-1000 ease-out ${
                      position === 1 ? "md:scale-105 h-80 opacity-100" : "md:scale-90 h-56 opacity-75"
                    }`}
                  >
                    <img
                      src={item.imagen }
                      alt={item.titulo }
                      className={`w-full object-cover rounded-2xl transition-all duration-1000 ease-out ${
                        position === 1 ? "h-80" : "h-56"
                      }`}
                    />
                    <div
                      className={`absolute rounded-xl p-4 text-white right-4 w-48 transition-all ${position === 1 ? "duration-1000 delay-300" : "duration-1000"} ease-out
                        ${position === 1 ? "bottom-0 translate-x-1/4 translate-y-1/6 bg-[#500088]/95 opacity-100" : "bottom-0 translate-x-1/4 translate-y-1/6 bg-[#500088]/85 opacity-90"}
                      `}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-white!">
                        {item.titulo }
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-white!">
                        &quot;{item.descripcion }&quot;
                      </p>
                      <p className="mt-2 text-[#F2B929]!">{stars}</p>
                    </div>
                  </article>
                );
              })}
              </div>
            </div>

            <button
              onClick={nextTestimonial}
              className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-[#500088] text-white hover:bg-[#661AA3] transition p-1.5 md:p-2 shrink-0"
            >
              <ArrowRightIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </button>
          </div>
        </div>
      </section>
      <section className="bg-primary-50 pb-10 md:pb-20 py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-linear-to-r from-primary-900 to-primary-700 px-4 md:px-8 py-8 md:py-14 text-center text-white shadow-2xl">
            <div className="pointer-events-none absolute inset-0 opacity-15">
              <img
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=500&fit=crop"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="relative">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold">
                ¿Listo para tu próxima historia?
              </h3>
              <p className="mx-auto mt-2 md:mt-3 max-w-2xl text-xs sm:text-sm md:text-base text-primary-100!">
                Nuestros asesores están listos para transformar sus deseos en un
                itinerario inolvidable.
              </p>
              <div className="mt-5 md:mt-8 flex flex-col items-center justify-center gap-3 md:gap-4 sm:flex-row">
                <Link
                  href={redes?.whatsapp ? `https://wa.me/${redes.whatsapp.replace(/[^0-9]/g, '')}` : "https://wa.me/593964220600"}
                  target="_blank"
                  className="inline-flex items-center rounded-full bg-[#25D366] px-5 md:px-7 py-2.5 md:py-3 text-xs md:text-sm font-semibold text-white shadow-lg transition hover:bg-accent-green/90"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="md:w-5 md:h-5"
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
                  <span className="ml-1.5 md:ml-2">WhatsApp</span>
                </Link>
                <Link
                  href="/contact#contact-form"
                  className="inline-flex items-center rounded-full bg-white px-5 md:px-7 py-2.5 md:py-3 text-xs md:text-sm font-semibold text-primary-800 transition hover:bg-primary-50"
                >
                  <svg
                    width="18"
                    height="14"
                    viewBox="0 0 20 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="md:w-5 md:h-4"
                  >
                    <path
                      d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H2ZM10 9L2 4V14H18V4L10 9ZM10 7L18 2H2L10 7ZM2 4V2V4V14V4Z"
                      fill="#500088"
                    />
                  </svg>
                  <span className="ml-1.5 md:ml-2">Email</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ContactDialog
        isOpen={showContactDialog}
        onClose={() => setShowContactDialog(false)}
      />
    </>
  );
}
