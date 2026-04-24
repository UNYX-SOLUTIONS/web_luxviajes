"use client";

import Link from "next/link";
import { useState } from "react";
import { ContactDialog } from "@/components/common/contact_dialog";
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
    title: "Politicas de Agencia",
    description:
      "Informacion sobre nuestras politicas de reserva, precios y condiciones.",
    icon: CreditCardIcon,
  },
  {
    title: "Politicas de Viaje",
    description:
      "Requisitos de entrada, restricciones de viaje y recomendaciones para destinos específicos.",
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
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [showContactDialog, setShowContactDialog] = useState(false);

  const toggleFlip = (title: string) => {
    const newFlipped = new Set(flippedCards);
    if (newFlipped.has(title)) {
      newFlipped.delete(title);
    } else {
      newFlipped.add(title);
    }
    setFlippedCards(newFlipped);
  };

  const supportChannels = [
    {
      id: "whatsapp",
      title: "WhatsApp Directo",
      description: "Mensajeria instantanea con nuestros expertos locales.",
      icon: ChatBubbleLeftIcon,
      href: "https://wa.me/593964220600",
      isExternal: true,
      bgColor: "bg-secondary-100",
      bgColorSelected: "bg-primary-700",
      buttonColor: "bg-tertiary-200 text-tertiary-900 hover:bg-tertiary-100",
      textColor: "text-neutral-900",
      buttonText: "Chatear Ahora",
    },
    {
      id: "phone",
      title: "Linea de Soporte 24/7",
      description:
        "Llamanos en cualquier momento, desde cualquier lugar del mundo.",
      icon: PhoneIcon,
      href: "tel:+593964220600",
      isExternal: false,
      bgColor: "bg-secondary-100",
      bgColorSelected: "bg-primary-700",
      buttonColor:
        "border border-primary-300 text-primary-700 hover:bg-primary-50",
      textColor: "text-neutral-900",
      buttonText: "+593 96 422 0600",
    },
    {
      id: "email",
      title: "Consulta por Email",
      description:
        "Envianos una solicitud detallada y te responderemos en menos de 2 horas.",
      icon: EnvelopeIcon,
      href: "mailto:info@luxviajes.com",
      isExternal: false,
      bgColor: "bg-secondary-100",
      bgColorSelected: "bg-primary-700",
      buttonColor:
        "border border-primary-300 text-primary-700 hover:bg-primary-50",
      textColor: "text-neutral-900",
      buttonText: "Enviar Email",
    },
  ];

  return (
    <>
      <section className="bg-secondary-50 pb-14 md:py-20 min-h-11/12 flex justify-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,white_0%,transparent_40%)]" />
          </div>

          <div className="relative mx-auto max-w-3xl text-center text-neutral-900! mt-40 mb-3">
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              ¿Cómo podemos ayudarte hoy?
            </h1>

            <form className="mx-auto mt-8 max-w-xl w-full">
              <div className="flex items-center rounded-full bg-white px-4 py-3 shadow-lg ring-1 ring-neutral-300 focus-within:ring-1 focus-within:ring-primary-500">
                <MagnifyingGlassIcon className="mr-3 h-5 w-5 text-neutral-700" />
                <input
                  type="text"
                  placeholder="Busca articulos, itinerarios o soporte..."
                  className="w-full bg-transparent text-sm text-neutral-800! outline-none placeholder:text-neutral-400"
                />
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-secondary-50 pb-14 md:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {helpTopics.map((topic) => {
              const IconComponent = topic.icon;
              const isFlipped = flippedCards.has(topic.title);
              return (
                <div
                  key={topic.title}
                  onClick={() => toggleFlip(topic.title)}
                  className="h-48 cursor-pointer"
                  style={{
                    perspective: "1000px",
                  }}
                >
                  <div
                    className="relative w-full h-full transition-transform duration-500"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: isFlipped
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                    }}
                  >
                    {/* Front of card */}
                    <article
                      className="absolute w-full h-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 flex flex-col items-start justify-start"
                      style={{
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100">
                        <IconComponent className="h-6 w-6 text-primary-700" />
                      </div>
                      <h5 className="text-xl font-bold text-neutral-900">
                        {topic.title}
                      </h5>
                      <p className="mt-2 text-xs text-neutral-500 italic">
                        Click para más info
                      </p>
                    </article>

                    {/* Back of card */}
                    <div
                      className="absolute w-full h-full rounded-2xl bg-primary-700 p-6 shadow-sm ring-1 ring-primary-600 flex flex-col items-center justify-between"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <p className="text-sm leading-relaxed text-white! text-center">
                        {topic.description}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowContactDialog(true);
                          toggleFlip(topic.title);
                        }}
                        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-tertiary-500 px-4 py-2.5 text-sm font-bold text-tertiary-950 transition hover:bg-tertiary-400"
                      >
                        Consultar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-neutral-50 py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-neutral-900">
            Preguntas Frecuentes
          </h2>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="group overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200"
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-left text-sm font-semibold text-neutral-900">
                  {faq.question}
                  <ChevronDownIcon className="h-5 w-5 text-primary-700 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-neutral-600!">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
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
            {supportChannels.map((channel) => {
              const IconComponent = channel.icon;
              const isSelected = selectedChannel === channel.id;

              return (
                <button
                  key={channel.id}
                  onClick={() =>
                    setSelectedChannel(isSelected ? null : channel.id)
                  }
                  className={`rounded-2xl p-8 text-center shadow-lg transition-all duration-300 ${
                    isSelected
                      ? `${channel.bgColorSelected} text-white! ring-2 ring-secondary-700 scale-105`
                      : `${channel.bgColor} ${channel.textColor} ring-1 ring-primary-200 hover:shadow-2xl hover:scale-102`
                  }`}
                >
                  <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-opacity-20">
                    <IconComponent
                      className={`h-6 w-6 ${isSelected ? "text-white!" : "text-primary-700"}`}
                    />
                  </div>
                  <h3 className="text-2xl font-bold">{channel.title}</h3>
                  <p
                    className={`mt-2 text-sm ${isSelected ? "text-white!" : "text-neutral-600"}`}
                  >
                    {channel.description}
                  </p>
                  <Link
                    href={channel.href}
                    target={channel.isExternal ? "_blank" : undefined}
                    onClick={(e) => e.stopPropagation()}
                    className={`mt-6 inline-flex rounded-full px-6 py-2.5 text-sm font-semibold transition text-primary-800! ${channel.buttonColor} ${isSelected ? "bg-tertiary-400 border border-tertiary-500! hover:bg-tertiary-300" : "bg-transparent border border-primary-300 hover:bg-primary-50"}`}
                  >
                    {channel.buttonText}
                  </Link>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-8 md:py-10 text-center text-neutral-900!">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheckIcon className="h-5 w-5" />
          <a className="text-sm font-medium text-neutral-900!">
            Tranquilidad en cada paso de tu viaje.
          </a>
        </div>
      </section>

      {/* Seccion de trabaje con nosotros */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-linear-to-r from-primary-800 to-primary-700 px-8 py-14 text-center shadow-2xl">
            <h3 className="text-4xl font-extrabold text-white">
              ¿Quieres ser parte de nuestro equipo?
            </h3>
            <p className="mt-4 text-lg text-white!">
              Estamos buscando talentos apasionados para unirse a nuestra
              familia
              <br />y ayudar a crear experiencias de viaje inolvidables.
            </p>
            {/* Boton que envia a correo */}
            <a
              href="mailto:agencia@luxviajes.com"
              className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
            >
              Haznos llegar tu CV
            </a>
          </div>
        </div>
      </section>

      {/*  <section className="bg-primary-700 py-8 md:py-10 text-center text-white!">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheckIcon className="h-5 w-5" />
          <a className="text-sm font-medium text-white!">
            Tranquilidad en cada paso de tu viaje.
          </a>
        </div>
      </section> */}

      <ContactDialog
        isOpen={showContactDialog}
        onClose={() => setShowContactDialog(false)}
      />
    </>
  );
}
