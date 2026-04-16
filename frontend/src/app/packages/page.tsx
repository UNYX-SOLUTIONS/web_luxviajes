"use client";

import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/outline";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState } from "react";

const premiumPackages = [
  {
    tag: "Seleccion del concierge",
    title: "Europa Majica",
    days: "12 Dias",
    price: "4,250",
    image:
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=900&h=1200&fit=crop",
  },
  {
    tag: "Popular",
    title: "Duqai Exclusivo",
    days: "8 Dias",
    price: "5,800",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&h=1200&fit=crop",
  },
  {
    tag: "Todo Incluido",
    title: "Cariqe All-Inclusive",
    days: "10 Dias",
    price: "2,900",
    image:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&h=1200&fit=crop",
  },
  {
    tag: "Seleccion del concierge",
    title: "Asia Ancestral",
    days: "15 Dias",
    price: "6,400",
    image:
      "https://images.unsplash.com/photo-1528164344705-47542687000d?w=900&h=1200&fit=crop",
  },
];

const dreamDestinations = [
  {
    title: "Cartagena",
    nights: "4 dias, 3 noches (3era noche gratis)",
    season: "Disponible de Julio a Noviembre",
    image:
      "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=900&h=600&fit=crop",
  },
  {
    title: "Panama Low Cost",
    nights: "4 dias, 3 noches",
    season: "Disponible de Julio a Noviembre",
    image:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=900&h=600&fit=crop",
  },
  {
    title: "Medellin Full Pack",
    nights: "4 dias, 3 noches",
    season: "Disponible de Julio a Noviembre",
    image:
      "https://images.unsplash.com/photo-1536421469767-80559bb6f5e1?w=900&h=600&fit=crop",
  },
  {
    title: "Cartagena + Panama",
    nights: "7 dias, 6 noches",
    season: "Disponible de Julio a Noviembre",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&h=600&fit=crop",
  },
];

const themeParks = [
  {
    title: "Disney y Universal",
    subtitle: "Orlando Experience",
    image:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&h=600&fit=crop",
  },
  {
    title: "Europa Parks",
    subtitle: "Aventura Familiar",
    image:
      "https://images.unsplash.com/photo-1503917988258-f87a78e3c995?w=900&h=600&fit=crop",
  },
  {
    title: "Tokyo Adventure",
    subtitle: "Parques en Japon",
    image:
      "https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?w=900&h=600&fit=crop",
  },
];

export default function PackagesPage() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const itemsPerView = 4;
  const maxIndex = Math.max(0, premiumPackages.length - itemsPerView);

  const handlePrev = () => {
    setCarouselIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCarouselIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visiblePackages = premiumPackages.slice(
    carouselIndex,
    carouselIndex + itemsPerView,
  );

  return (
    <>
      <section className="relative overflow-hidden bg-neutral-900 h-screen">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1431274172761-fca41d930114?w=1800&h=900&fit=crop"
            alt="Paquetes internacionales"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-primary-950/80 via-primary-900/45 to-primary-900/25" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-14 py-24 sm:px-6 lg:px-8 lg:pb-20 lg:py-32 flex flex-col items-center justify-center h-full">
          <div className="mx-auto max-w-3xl text-center text-white">
            <h1 className="text-4xl font-extrabold md:text-6xl">
              Explora el Mundo
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-white! md:text-lg lg:text-xl">
              Experiencias internacionales disenadas por expertos para el
              viajero más exigente.
            </p>
          </div>

          {/* <div className="mx-auto mt-10 max-w-4xl rounded-full bg-neutral-900/55 p-2 backdrop-blur-md ring-1 ring-white/20">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                <div className="rounded-full px-5 py-3 text-sm text-white/85">Destino</div>
                <div className="rounded-full px-5 py-3 text-sm text-white/85">Fecha de viaje</div>
                <div className="rounded-full px-5 py-3 text-sm text-white/85">Pasajeros</div>
                <button className="rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700">
                  Buscar
                </button>
              </div>
            </div> */}
        </div>
      </section>

      <section className="bg-neutral-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-4xl font-bold text-primary-700 mb-2">
                Paquetes Premium
              </h2>
              <p className="mt-2 max-w-xl text-sm text-neutral-600">
                Nuestra seleccion exclusiva de itinerarios curados para ofrecer
                el maximo confort y experiencias autenticas.
              </p>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <button
                onClick={handlePrev}
                disabled={carouselIndex === 0}
                className="h-9 w-9 rounded-full border border-neutral-300 text-neutral-600 transition hover:border-primary-400 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={carouselIndex === maxIndex}
                className="h-9 w-9 bg-primary-600 hover:bg-primary-500 rounded-full border border-primary-800 text-neutral-50 transition hover:border-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visiblePackages.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-80 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-primary-900 via-primary-900/10 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-neutral-900/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                    {item.tag}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex text-center items-center gap-1">
                      <ClockIcon className="h-3 w-3 inline-block mr-1" />
                      <p className="text-xs text-white!">{item.days}</p>
                    </div>
                    <h4 className="font-bold">{item.title}</h4>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-neutral-500! font-semibold">
                      Desde
                    </p>
                    <p className="text-xl font-bold text-primary-700!">
                      ${item.price} USD
                    </p>
                  </div>
                  <ArrowRightIcon className="h-8 w-8 rounded-full text-xl text-primary-700 transition hover:bg-primary-50 p-1.5 font-black" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-7 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm text-accent-red">
                Escapa, Explora, Disfruta
              </p>
              <h2 className="mt-1 text-4xl font-bold text-primary-700">
                Top Destinos Sonados
              </h2>
            </div>
            <Link
              href="/contact"
              className="text-sm font-semibold text-primary-700 transition hover:text-primary-800"
            >
              Ver mas destinos populares →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dreamDestinations.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-primary-100 flex flex-col h-full"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-40 w-full object-cover shrink-0"
                />
                <div className="p-4 flex flex-col h-full">
                  <div className="shrink-0">
                    <h4 className="text-lg font-bold text-neutral-900 line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm text-primary-700! font-semibold">
                      ● {item.nights}
                    </p>
                  </div>
                  <ul className="mt-2 space-y-3 text-xs text-neutral-700 shrink-0">
                    <li>✈ Vuelo</li>
                    <li>🏨 Hotel</li>
                    <li>🧭 Tours</li>
                    <li>🛡 Asistencia de viaje</li>
                  </ul>
                  <div className="grow" />
                  <div className="shrink-0">
                    <p className="mt-2 text-xs text-tertiary-700! font-medium text-center">
                      {item.season}
                    </p>
                    <button className="mt-3 w-full rounded-full bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800">
                      Cotizar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-neutral-900">
            Parques Tematicos
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {themeParks.map((park) => (
              <article
                key={park.title}
                className="relative overflow-hidden rounded-2xl"
              >
                <img
                  src={park.image}
                  alt={park.title}
                  className="h-72 w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-neutral-950/75 via-neutral-900/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-sm text-primary-100">{park.subtitle}</p>
                  <h3 className="text-3xl font-bold">{park.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white pb-16 md:pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-primary-800 to-primary-700 px-8 py-12 text-white shadow-xl">
            <div className="pointer-events-none absolute inset-0 opacity-30">
              <img
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=500&fit=crop"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h3 className="text-5xl font-bold leading-none">
                  ¿Listo para cruzar fronteras?
                </h3>
                <p className="mt-4 max-w-2xl text-white!">
                  Nuestros asesores expertos estan listos para disenar el viaje
                  de tus suenos. Consultoria personalizada y sin compromiso.
                </p>
              </div>
              <Link
                href="https://wa.me/593984220600"
                target="_blank"
                className="inline-flex rounded-full bg-primary-50 px-3 py-3 text-sm font-semibold text-primary-800! transition hover:bg-primary-50 gap-2 items-center"
              >
                <PhoneIcon className="h-5 w-5 inline-block" />
                <p className="text-sm font-semibold text-primary-800!"> Contactar a un Asesor</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary-700 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold">Unete al Circulo Exclusivo</h3>
          <p className="mx-auto mt-3 max-w-2xl text-white!">
            Recibe ofertas privilegiadas y destinos secretos directamente en tu
            bandeja de entrada.
          </p>

          <form className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Tu correo electronico"
              className="h-12 flex-1 rounded-full border border-white/20 bg-white px-5 text-sm text-neutral-800 placeholder:text-neutral-600 outline-none focus:border-white/50"
            />
            <button
              type="submit"
              className="h-12 rounded-full bg-primary-50 px-7 text-sm font-semibold text-primary-800 transition hover:bg-primary-100"
            >
              Suscribirme
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
