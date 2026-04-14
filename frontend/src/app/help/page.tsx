"use client";

import Link from "next/link";
import {
  DocumentTextIcon,
  CreditCardIcon,
  CalendarDaysIcon,
  StarIcon,
  ShieldCheckIcon,
  MapIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";

const helpTopics = [
  {
    title: "Visas y Documentacion",
    description:
      "Asesoria integral, validez de pasaportes y solicitudes de visa.",
    icon: DocumentTextIcon,
  },
  {
    title: "Pagos y Facturacion",
    description:
      "Gestion de facturas, estado de reembolsos y metodos de pago seguros.",
    icon: CreditCardIcon,
  },
  {
    title: "Cancelaciones y Cambios",
    description:
      "Opciones de reserva flexible, reprogramacion de viajes y terminos de cancelacion.",
    icon: CalendarDaysIcon,
  },
  {
    title: "Programa de Lealtad",
    description:
      "Beneficios para miembros, acumulacion de puntos y acceso a recompensas exclusivas.",
    icon: StarIcon,
  },
  {
    title: "Seguro de Viaje",
    description:
      "Cobertura de polizas, proceso de reclamos y asistencia medica de emergencia.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Guias de Destino",
    description:
      "Informacion local, itinerarios curados y tesoros ocultos en todo el mundo.",
    icon: MapIcon,
  },
];

const faqs = [
  {
    question: "Como verificar el estado de mi visa?",
    answer:
      "Puedes rastrear tu solicitud directamente en tu panel de Luxviajes bajo la pestana de Documentos. Tambien enviamos actualizaciones automaticas via email y WhatsApp en cada paso del proceso de verificacion.",
  },
  {
    question: "Cual es la politica de cancelacion?",
    answer:
      "Trabajamos con politicas flexibles segun proveedor. Nuestro equipo revisa tu caso y te presenta la mejor alternativa entre reembolso, cambio de fecha o credito de viaje.",
  },
  {
    question: "Como contacto a mi asesora?",
    answer:
      "Puedes escribir por WhatsApp, llamar a nuestra linea de soporte o responder al correo de confirmacion. Siempre tendras una asesora asignada para seguimiento personalizado.",
  },
];

export default function HelpPage() {
  return (
    <>
      <section className="bg-primary-50 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,white_0%,transparent_40%)]" />
          </div>

          <div className="relative mx-auto max-w-3xl text-center text-primary-900">
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              Como podemos ayudarte hoy?
            </h1>

            <form className="mx-auto mt-8 max-w-xl">
              <div className="flex items-center rounded-full bg-white px-4 py-3 shadow-lg ring-1 ring-primary-100">
                <MagnifyingGlassIcon className="mr-3 h-5 w-5 text-primary-700" />
                <input
                  type="text"
                  placeholder="Busca articulos, itinerarios o soporte..."
                  className="w-full bg-transparent text-sm text-neutral-700 outline-none placeholder:text-neutral-400"
                />
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-primary-50 pb-14 md:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {helpTopics.map((topic) => {
              const IconComponent = topic.icon;
              return (
                <article
                  key={topic.title}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary-100"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100">
                    <IconComponent  className="h-6 w-6 text-primary-700" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900">
                    {topic.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {topic.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-secondary-100 py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-neutral-900">
            Preguntas Frecuentes
          </h2>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="group overflow-hidden rounded-2xl bg-white ring-1 ring-primary-100"
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-left text-sm font-semibold text-neutral-900">
                  {faq.question}
                  <ChevronDownIcon className="h-5 w-5 text-primary-700 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-neutral-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-neutral-900">
              Aun necesitas ayuda?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-neutral-600">
              Nuestro equipo de soporte esta disponible las 24 horas para
              asegurar que tu viaje sea impecable.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            <article className="rounded-2xl bg-primary-700 p-8 text-center text-white shadow-lg">
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-600">
                <ChatBubbleLeftIcon className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">WhatsApp Directo</h3>
              <p className="mt-2 text-sm text-primary-100">
                Mensajeria instantanea con nuestros expertos locales.
              </p>
              <Link
                href="https://wa.me/593984220600"
                target="_blank"
                className="mt-6 inline-flex rounded-full bg-tertiary-200 px-6 py-2.5 text-sm font-semibold text-tertiary-900 transition hover:bg-tertiary-100"
              >
                Chatear Ahora
              </Link>
            </article>

            <article className="rounded-2xl bg-secondary-100 p-8 text-center shadow-sm ring-1 ring-primary-200">
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <PhoneIcon className="h-6 w-6 text-primary-700" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900">
                Linea de Soporte 24/7
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                Llamanos en cualquier momento, desde cualquier lugar del mundo.
              </p>
              <Link
                href="tel:+593964220600"
                className="mt-6 inline-flex rounded-full border border-primary-300 px-6 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
              >
                +593 96 422 0600
              </Link>
            </article>

            <article className="rounded-2xl bg-secondary-100 p-8 text-center shadow-sm ring-1 ring-primary-200">
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <EnvelopeIcon className="h-6 w-6 text-primary-700" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900">
                Consulta por Email
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                Envianos una solicitud detallada y te responderemos en menos de
                2 horas.
              </p>
              <Link
                href="mailto:info@luxviajes.com"
                className="mt-6 inline-flex rounded-full border border-primary-300 px-6 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
              >
                Enviar Email
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-primary-700 py-6 text-center text-white">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheckIcon className="h-5 w-5" />
          <p className="text-sm font-medium">
            Tranquilidad en cada paso de tu viaje.
          </p>
        </div>
      </section>
    </>
  );
}
