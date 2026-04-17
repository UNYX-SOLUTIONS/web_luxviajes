/* eslint-disable @next/next/no-img-element */
'use client';

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import { AppointmentDialog } from "@/components/common/appointment_dialog";

interface ContactOption {
  title: string;
  description: string;
  action: string;
  href: string;
  image: string;
  isVideocall?: boolean;
  isAgenda?: boolean;
}

const contactOptions: ContactOption[] = [
  {
    title: "Videollamada",
    description:
      "Puedes contactarnos directamente por una videollamada, estaremos dispuestos a brindarte asesoria.",
    action: "Hacer Videollamada",
    href: "#",
    isVideocall: true,
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&h=600&fit=crop",
  },
  {
    title: "WhatsApp",
    description: "Puedes contactarnos por WhatsApp a la hora que gustes.",
    action: "WhatsApp Directo",
    href: "https://wa.me/593964220600",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900&h=600&fit=crop",
  },
  {
    title: "Agenda tu cita",
    description:
      "Agenda tu cita con nosotros y te contactaremos inmediatamente.",
    action: "Agendar Cita",
    href: "#",
    isAgenda: true,
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900&h=600&fit=crop",
  },
  {
    title: "Asesoria en Oficinas",
    description:
      "Puedes venir a nuestra oficina y ser atendido directamente por nuestros asesores.",
    action: "Ver Ubicaciones",
    href: "#offices",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&h=600&fit=crop",
  },
];

const offices = [
  {
    city: "Guayaquil",
    address: "Edificio X, Oficina Y, Sector Puerto Santa Ana.",
    image: "/images/Contacts/Guayaquil.png",
    mapUrl: "https://maps.app.goo.gl/Jb8QSrh2MjZH4HDz7",
  },
  {
    city: "Quito",
    address: "Av. Amazonas y Eloy Alfaro, Edificio Luxury Trade.",
    image: "/images/Contacts/Quito.png",
    mapUrl: "https://maps.app.goo.gl/f7gdNvxg5XPnrpB48",
  },
  {
    city: "Cuenca",
    address: "Calle Larga y Borrero, Casa Colonial Lux.",
    image: "/images/Contacts/Cuenca.png",
    mapUrl: "https://maps.app.goo.gl/zdy3WGpCAEsfBBzZ6",
  },
];

export default function ContactPage() {
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  return (
    <>
      <section className="relative overflow-hidden bg-neutral-900 h-screen">
        <div className="absolute inset-0">
          <img
            src="/images/contacts/hero.png"
            alt="Contáctanos"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-primary-950/85 via-primary-900/55 to-primary-900/25" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-60 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <span className="inline-flex rounded-full bg-tertiary-800 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-tertiary-100">
              Viaje Exclusivo
            </span>
            <h1 className="mt-5 text-5xl font-extrabold leading-tight md:text-7xl sm:pb-2 md:pb-4">
              Contáctanos
            </h1>
            <div className="sm:py-2 md:py-4">
              <a className="mt-5 text-2xl font-semibold text-primary-100">
                ¿Tienes alguna pregunta o comentario?
              </a>
              <br />
              <a className="text-2xl font-semibold text-primary-100">
                ¡Háznoslo saber!
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="tel:+593123456789"
                className="inline-flex rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-700"
              >
                Llámanos +593123456789{" "}
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
              <span className="text-sm text-primary-100">
                Acompañamiento 24/7
              </span>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-20 bg-white"
          style={{ clipPath: "polygon(0 95%, 100% 0, 100% 100%, 0 100%)" }}
        />
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-4">
            <h2 className="text-4xl font-bold text-primary-700">
              Elige la forma de contactarnos.
            </h2>
            <div className="hidden h-0.5 w-16 bg-tertiary-500 md:block" />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {contactOptions.map((option) => (
              <article
                key={option.title}
                className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 h-full"
              >
                <img
                  src={option.image}
                  alt={option.title}
                  className="h-58 w-full object-cover"
                />
                <div className="flex flex-col grow px-5 pt-6">
                  <p className="text-2xl font-bold text-neutral-900">
                    {option.title}
                  </p>
                  <p className="mt-3 grow text-sm leading-relaxed text-neutral-600">
                    {option.description}
                  </p>
                  {(option.isVideocall || option.isAgenda) ? (
                    <button
                      onClick={() => setShowAppointmentDialog(true)}
                      className="mt-6 mb-8 inline-flex w-full items-center justify-center rounded-full bg-neutral-100 px-4 py-3 text-sm font-bold text-primary-700 transition hover:bg-primary-800 hover:text-white duration-200"
                    >
                      {option.action}
                    </button>
                  ) : (
                    <Link
                      href={option.href}
                      target={
                        option.href.startsWith("https://") ? "_blank" : undefined
                      }
                      className="mt-6 mb-8 inline-flex w-full items-center justify-center rounded-full bg-neutral-100 px-4 py-3 text-sm font-bold text-primary-700 transition hover:bg-primary-800 hover:text-white duration-200"
                    >
                      {option.action}
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact-form" className="bg-primary-50 py-14 md:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="column">
            <a
              href="#contact-form"
              className="text-sm font-bold text-red-800 mb-1"
            >
              Contáctanos
            </a>
            <br />
            <h1 className="mt-3 text-5xl leading-none text-neutral-900 font-semibold py-2">
              Haz{" "}
              <span className="text-primary-700 italic font-black text-5xl leading-snug">
                realidad
              </span>{" "}
              el viaje que siempre soñaste
            </h1>
            <p className="mt-5 max-w-xl text-lg text-neutral-700">
              Déjanos tus datos y uno de nuestros expertos diseñará una
              experiencia única, pensada exclusivamente para ti.
            </p>
          </div>

          <form className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-primary-100 sm:p-10 h-auto overflow-y-auto">
            <h3 className="text-3xl font-bold text-primary-700">
              Envíenos un mensaje
            </h3>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  className="h-12 w-full rounded-lg border border-primary-200 bg-primary-50 px-4 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  placeholder="ejemplo@email.com"
                  className="h-12 w-full rounded-lg border border-primary-200 bg-primary-50 px-4 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  placeholder="+593"
                  className="h-12 w-full rounded-lg border border-primary-200 bg-primary-50 px-4 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Destino de Interés
                </label>
                <select className="h-12 w-full rounded-lg border border-primary-200 bg-primary-50 px-4 text-sm text-neutral-700 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition appearance-none cursor-pointer">
                  <option>Seleccione un destino</option>
                  <option>Europa</option>
                  <option>Asia</option>
                  <option>Estados Unidos</option>
                  <option>Sudamérica</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                Mensaje
              </label>
              <textarea
                placeholder="Cuéntenos sobre el viaje de sus sueños..."
                className="h-40 w-full rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition resize-none"
              />
            </div>

            <button
              type="submit"
              className="mt-8 inline-flex rounded-full bg-primary-700 px-10 py-3 text-base font-semibold text-white transition hover:bg-primary-800 shadow-lg hover:shadow-xl"
            >
              Enviar Solicitud
            </button>
          </form>
        </div>
      </section>

      <section id="offices" className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-neutral-900">
              Nuestras Oficinas
            </h2>
            <div className="mx-auto mt-4 h-0.75 w-20 bg-tertiary-500" />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {offices.map((office, index) => (
              <article
                key={office.city}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200"
              >
                <div className="relative">
                  <img
                    src={office.image}
                    alt={office.city}
                    className="h-44 w-full object-cover"
                  />
                  {index === 0 && (
                    <span className="absolute left-3 top-3 rounded-full bg-primary-700 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                      Matriz
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-3xl font-bold text-neutral-900">
                    {office.city}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600">
                    <MapPinIcon className="inline-block h-5 w-5 mr-2 text-primary-700" />{" "}
                    {office.address}
                  </p>

                  <button 
                    onClick={() => window.open(office.mapUrl, '_blank')}
                    className="mt-4 w-full rounded-lg bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-100"
                  >
                    VER MAPA
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-700 pb-0 pt-6 md:pt-10 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&h=600&fit=crop)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="rounded-t-3xl px-8 py-14 text-center text-white">
            <div className="relative">
              <h2 className="mx-auto min-w-md text-xl md:text-5xl font-extrabold leading-tight w-xl">
                No espere más para vivir la experiencia Luxviajes
              </h2>
              <Link
                href="/packages"
                className="mt-7 inline-flex rounded-full bg-tertiary-500 px-8 py-3 text-sm font-semibold text-tertiary-950 transition hover:bg-tertiary-400 text-tertiary-900 shadow-lg hover:shadow-xl "
              >
                Comenzar mi Planificación
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AppointmentDialog
        isOpen={showAppointmentDialog}
        onClose={() => setShowAppointmentDialog(false)}
      />
    </>
  );
}
