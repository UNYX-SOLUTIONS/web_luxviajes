/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import {
  CheckBadgeIcon,
  AdjustmentsHorizontalIcon,
  EnvelopeIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { ContactDialog } from "@/components/common/contact_dialog";
import { useVisasData } from "@/hooks/useVisasData";
import { Visa } from "@/types";
import { APPOINTMENT_WEBHOOK_URL, AppointmentSource } from "@/components/common/AppointmentBase";

const steps = [
  {
    id: "01",
    title: "Consultoria Personalizada",
    description:
      "Analizamos tu perfil y destino para ofrecerte una ruta de visado optimizada y sin contratiempos.",
  },
  {
    id: "02",
    title: "Gestion de Documentos",
    description:
      "Nos encargamos de cada detalle, desde la recopilación de requisitos hasta la presentación ante las embajadas, garantizando una experiencia sin estrés.",
  },
  {
    id: "03",
    title: "Seguimiento Proactivo",
    description:
      "Te mantenemos informado en cada etapa del proceso, anticipándonos a cualquier eventualidad para asegurar que tu visado sea aprobado sin sorpresas.",
  },
];

export default function VisasPage() {
  const [selectedVisa, setSelectedVisa] = useState<Visa | null>(null);
  const [showRequirementsDialog, setShowRequirementsDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const { data: visasPageData, loading, error } = useVisasData();
  
  // Estado para el newsletter
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleShowRequirements = (visa: Visa) => {
    setSelectedVisa(visa);
    setShowRequirementsDialog(true);
  };

  const handleCloseDialog = () => {
    setShowRequirementsDialog(false);
    setSelectedVisa(null);
  };

  // Manejar suscripción al newsletter
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar email
    if (!newsletterEmail || !newsletterEmail.includes("@") || !newsletterEmail.includes(".")) {
      setNewsletterMessage({ type: "error", text: "Por favor ingresa un correo electrónico válido" });
      return;
    }

    setIsSubmittingNewsletter(true);
    setNewsletterMessage(null);

    try {
      const response = await fetch(APPOINTMENT_WEBHOOK_URL, { // Usar la misma constante que en AppointmentBase
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newsletterEmail,
          source: AppointmentSource.MAIL_MARKETING,
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook respondió con estado ${response.status}`);
      }

      // Éxito
      setNewsletterMessage({ type: "success", text: "¡Gracias por suscribirte! Revisa tu correo para confirmar la suscripción." });
      setNewsletterEmail(""); // Limpiar el campo
      
      setTimeout(() => {
        setNewsletterMessage(null);
      }, 5000);
      
    } catch (error) {
      console.error("Error al enviar suscripción:", error);
      setNewsletterMessage({ type: "error", text: "Hubo un error al procesar tu suscripción. Por favor intenta nuevamente." });
    } finally {
      setIsSubmittingNewsletter(false);
    }
  };

  // Controlar scroll del body cuando el dialog de requisitos está abierto
  useEffect(() => {
    if (showRequirementsDialog) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.body.style.overflow = "unset";
        document.body.style.paddingRight = "unset";
      };
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "unset";
    }
  }, [showRequirementsDialog]);
  
  return (
    <>
      {/* Hero section */}
      <section className="relative overflow-hidden bg-neutral-900 h-screen py-32">
        <div className="absolute inset-0">
          <img
            src={visasPageData?.heroImagen || "/images/hero/visas.png"}
            alt="Asesoria de visas"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-primary-950/85 via-neutral-900/50 to-neutral-900/25" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-22">
          <div className="max-w-2xl text-white!">
            <span className="inline-flex rounded-full bg-primary-500/80 px-3 py-1 text-xs! font-semibold uppercase tracking-wider">
              Servicio White-Glove
            </span>
            <h1
              className="mt-5 text-5xl! font-extrabold leading-tight md:text-6xl!"
              dangerouslySetInnerHTML={{
                __html:
                  visasPageData?.heroTitulo || "Viaja Sin <br /> Fronteras",
              }}
            />
            <h5 className="mt-5 max-w-xl text-base! text-white! md:text-lg!">
              {visasPageData?.heroSubtitulo ||
                "Gestionamos tu documentacion con la precision de un concierge digital. Disfruta de tramites sin estres mientras nosotros cuidamos cada detalle de tu visado."}
            </h5>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setShowContactDialog(true)}
                className="inline-flex rounded-full bg-primary-600 px-6 py-3 text-sm! font-semibold text-white shadow-lg transition hover:bg-primary-700"
              >
                Iniciar Asesoria
              </button>
              <Link
                href="/packages"
                className="inline-flex rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm! font-semibold text-white transition hover:bg-white/20"
              >
                Ver Destinos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Visas */}
      <section className="bg-neutral-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl! md:text-5xl! font-bold text-neutral-900">
              {visasPageData?.seccionGeneralTitulo ||
                "Especialistas en Visados Mundiales"}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base! text-neutral-600 md:text-md! lg:text-lg!">
              {visasPageData?.seccionGeneralContenido ||
                "Seleccionamos los destinos mas solicitados para brindarte una experiencia de solicitud optimizada y garantizada."}
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-neutral-600">Cargando visas...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-red-600">Error al cargar las visas</p>
              </div>
            ) : visasPageData?.visa_items &&
              visasPageData.visa_items.length > 0 ? (
              visasPageData.visa_items.map((visa) => (
                <article
                  key={visa.documentId}
                  className="flex flex-col rounded-3xl bg-white p-8 shadow-sm ring-1 ring-neutral-200 transition hover:shadow-md items-center text-center justify-center"
                >
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100 overflow-hidden border border-neutral-400">
                    {visa.imagen ? (
                      <img
                        src={visa.imagen}
                        alt={visa.titulo}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">🌍</span>
                    )}
                  </div>
                  <h5 className="text-lg font-bold text-neutral-900">
                    {visa.titulo}
                  </h5>
                  <p className="mt-2 mb-6 text-sm text-neutral-600">
                    {visa.subtitulo}
                  </p>

                  <div className="mt-auto w-full">
                    <button
                      onClick={() => setShowContactDialog(true)}
                      className="w-full rounded-full bg-secondary-50 px-4 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-100 cursor-pointer"
                    >
                      Solicitar
                    </button>
                    <button
                      onClick={() => handleShowRequirements(visa)}
                      className="mt-4 block w-full text-center text-xs text-neutral-600 hover:text-primary-700 transition cursor-pointer"
                    >
                      Más Información
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-neutral-600">No hay visas disponibles</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Paso a Paso */}
      <section className="bg-primary-50 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-20 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
              <article className="overflow-hidden rounded-3xl h-50 md:h-80">
                <img
                  src="/images/visa/imagen1.jpeg"
                  alt="Consultoria"
                  className="object-cover"
                />
              </article>
              <article className="flex items-center justify-center rounded-3xl bg-primary-700 text-white h-40 md:h-64">
                <CheckBadgeIcon className="h-16 w-16" />
              </article>
            </div>

            <div className="flex flex-col gap-4">
              <article className="flex items-center justify-center rounded-3xl bg-tertiary-500 text-white h-40 md:h-64">
                <AdjustmentsHorizontalIcon className="h-16 w-16" />
              </article>
              <article className="overflow-hidden rounded-3xl h-50 md:h-80">
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=500&fit=crop"
                  alt="Revision de documentos"
                  className="h-full w-full object-cover"
                />
              </article>
            </div>
          </div>

          <div>
            <h3 className="text-5xl font-bold text-neutral-900">
              Gestionamos tu visado paso a paso
            </h3>

            <div className="mt-10 space-y-8">
              {steps.map((step) => (
                <div key={step.id} className="flex gap-5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-700 text-sm font-bold text-white">
                    {step.id}
                  </div>
                  <div>
                    <h5 className="text-xl font-bold text-neutral-900">
                      {step.title}
                    </h5>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visados de Estudios */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
              Oportunidades Academicas
            </p>
            <h2 className="mt-2 text-4xl font-bold text-neutral-900">
              Visados de Estudios
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
            <article className="relative overflow-hidden rounded-3xl">
              <img
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&h=900&fit=crop"
                alt="Programas de larga duracion"
                className="h-80 w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-primary-950/85 via-primary-900/30 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <h3 className="text-3xl font-bold mt-2">
                  Programas de Larga Duracion
                </h3>
                <p className="my-2 max-w-2xl text-sm text-white!">
                  Maestrias, pregrados y PhD. Estancias superiores a 6 meses con
                  beneficios de residencia estudiantil.
                </p>
                <a className="mt-4 text-sm font-semibold" href="/contact">
                  Duracion: +1 Ano
                </a>
              </div>
            </article>

            <div className="space-y-4">
              <article className="rounded-2xl bg-tertiary-50 p-6 ring-1 ring-tertiary-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-tertiary-700">
                  Cursos de Idiomas
                </p>
                <p className="mt-2 text-sm text-neutral-700">
                  Experiencias inmersivas de 3 a 6 meses en escuelas
                  certificadas.
                </p>
                <Link
                  href="/contact"
                  className="mt-3 inline-flex text-sm font-semibold text-tertiary-700 hover:text-tertiary-800"
                >
                  Consultar Duracion →
                </Link>
              </article>

              <article className="rounded-2xl bg-primary-50 p-6 ring-1 ring-primary-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
                  Diplomados Cortos
                </p>
                <p className="mt-2 text-sm text-neutral-700">
                  Especializaciones tecnicas con procesos de visado
                  simplificados.
                </p>
                <Link
                  href="/contact"
                  className="mt-3 inline-flex text-sm font-semibold text-primary-700 hover:text-primary-800"
                >
                  Ver Requisitos →
                </Link>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white pb-16 md:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-linear-to-r from-primary-800 to-primary-700 px-8 py-14 text-center text-white shadow-xl">
            <h3 className="text-5xl font-bold">
              {visasPageData?.llamadaTitulo || "Listo para despegar?"}
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-white!">
              {visasPageData?.llamadaSubtitulo ||
                "Habla hoy con un especialista en visados y garantiza que tu proxima aventura comience sin contratiempos."}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() => setShowContactDialog(true)}
                className="inline-flex rounded-full bg-white px-8 py-3 text-sm font-bold text-primary-800 transition hover:bg-primary-50"
              >
                Hablar con un Especialista
              </button>
              <Link
                href="/packages"
                className="inline-flex rounded-full border border-white/30 bg-white/10 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Ver Paquetes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <section className="bg-white pb-16 md:pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[120px_1fr]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center text-primary-700 md:mx-0 md:h-24 md:w-24">
              <EnvelopeIcon className="h-16 w-16" />
            </div>

            <div>
              <h3 className="text-4xl font-bold text-primary-700">
                {visasPageData?.subscripcionTitulo ||
                  "Ofertas exclusivas en tu email"}
              </h3>
              <form onSubmit={handleNewsletterSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Email"
                  disabled={isSubmittingNewsletter}
                  className="h-12 flex-1 rounded-lg border border-neutral-300 px-4 text-sm outline-none focus:border-primary-400 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isSubmittingNewsletter}
                  className="h-12 rounded-full bg-primary-700 px-6 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingNewsletter ? "Enviando..." : "¡Quiero recibirlas!"}
                </button>
              </form>
              <p className="mt-3 text-xs text-neutral-500">
                {visasPageData?.subscripcionSubtitulo ||
                  "Recibirás emails promocionales de Luxviajes. Para más información consulta las políticas de privacidad."}
              </p>
              
              {/* Mensaje de feedback */}
              {newsletterMessage && (
                <div
                  className={`mt-4 rounded-lg p-3 text-sm ${
                    newsletterMessage.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {newsletterMessage.text}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Dialog */}
      {showRequirementsDialog && selectedVisa && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl flex flex-col max-h-[90vh] z-1000">
            <div className="shrink-0 border-b border-neutral-200 bg-white px-8 py-6">
              <button
                onClick={handleCloseDialog}
                className="absolute right-6 top-6 rounded-full bg-neutral-100 p-2 hover:bg-neutral-200 transition"
              >
                <XMarkIcon className="h-6 w-6 text-neutral-700" />
              </button>

              <div className="flex items-center gap-4 pr-10">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 overflow-hidden">
                  {selectedVisa.imagen ? (
                    <img
                      src={selectedVisa.imagen}
                      alt={selectedVisa.titulo}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">🌍</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-3xl font-bold text-neutral-900 truncate">
                    {selectedVisa.titulo}
                  </h2>
                  <p className="text-sm text-neutral-600 mt-1 truncate">
                    {selectedVisa.subtitulo}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 md:p-10">
              <div className="mb-8 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-primary-50 p-4">
                  <p className="text-xs font-semibold text-primary-700 uppercase tracking-wider">
                    Validez
                  </p>
                  <p className="mt-2 text-lg font-bold text-neutral-900">
                    {selectedVisa.validez}
                  </p>
                </div>
                <div className="rounded-lg bg-tertiary-50 p-4">
                  <p className="text-xs font-semibold text-tertiary-700 uppercase tracking-wider">
                    Procesamiento
                  </p>
                  <p className="mt-2 text-lg font-bold text-neutral-900">
                    {selectedVisa.procesamiento}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">
                  Requisitos Necesarios
                </h3>
                <ul className="space-y-3">
                  {selectedVisa.requisitos
                    .split("\n")
                    .filter((req: string) => req.trim())
                    .map((req: string, idx: number) => (
                      <li key={idx} className="flex gap-3">
                        <CheckBadgeIcon className="h-5 w-5 shrink-0 text-primary-700 mt-0.5" />
                        <span className="text-sm text-neutral-700">
                          {req.trim()}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            <div className="shrink-0 border-t border-neutral-200 bg-white px-8 py-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setShowContactDialog(true)}
                className="flex-1 rounded-full bg-primary-700 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-primary-800 cursor-pointer"
              >
                Iniciar Trámite
              </button>
              {selectedVisa.pdf && (
                <a
                  href={selectedVisa.pdf}
                  download
                  className="flex-1 rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Descargar PDF
                </a>
              )}
              {!selectedVisa.pdf && (
                <button
                  onClick={handleCloseDialog}
                  className="flex-1 rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 cursor-pointer"
                >
                  Cerrar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <ContactDialog
        isOpen={showContactDialog}
        onClose={() => setShowContactDialog(false)}
      />
    </>
  );
}