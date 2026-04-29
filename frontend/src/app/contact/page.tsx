/* eslint-disable @next/next/no-img-element */
"use client";

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import { AppointmentDialog } from "@/components/common/appointment_dialog";
import { useRedSocial, useContactData } from "@/hooks";

interface ContactOption {
  title: string;
  description: string;
  action: string;
  href: string;
  image: string;
  isVideocall?: boolean;
  isAgenda?: boolean;
}

interface FormData {
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  servicio: string;
  mensaje: string;
  promociones: boolean;
}

interface AppointmentWebhookPayload {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  appointment_date: string;
  message: string;
  receivePromotion: boolean;
  source: "web";
}

const CONTACT_WEBHOOK_URL =
  "https://flow.agencialuxviajes.com/webhook/de1e3a16-857f-48ec-a863-3eaf2aed41cc";

export default function ContactPage() {
  const { data: redes } = useRedSocial();
  const { data: contactData, loading, error } = useContactData();
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    servicio: "",
    mensaje: "",
    promociones: false,
  });

  const contactOptions: ContactOption[] = [
    {
      title: "Videollamada al Instante",
      description:
        "¿No quieres esperar? Agenda una videollamada inmediata con uno de nuestros asesores y resuelve todas tus dudas al instante.",
      action: "Hacer Videollamada",
      href: "#",
      isVideocall: true,
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&h=600&fit=crop",
    },
    {
      title: "WhatsApp",
      description:
        "¿Prefieres escribir? Contáctanos directamente por WhatsApp y recibe atención personalizada en tiempo real.",
      action: "WhatsApp Directo",
      href: redes?.whatsapp
        ? `https://wa.me/${redes.whatsapp.replace(/[^0-9]/g, "")}`
        : "https://wa.me/593964220600",
      image:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900&h=600&fit=crop",
    },
    {
      title: "Agenda tu cita Online",
      description:
        "¿Quieres una atención más personalizada? Agenda una cita online con uno de nuestros expertos y planifica tu viaje de ensueño con asesoría dedicada.",
      action: "Agendar Cita",
      href: "#",
      isAgenda: true,
      image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900&h=600&fit=crop",
    },
    {
      title: "Asesoria en Oficinas",
      description:
        "¿Prefieres una atención cara a cara? Visítanos en nuestras oficinas ubicadas en las principales ciudades del país y recibe asesoría personalizada de nuestros expertos en viajes.",
      action: "Ver Ubicaciones",
      href: "#offices",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&h=600&fit=crop",
    },
  ];

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const nextValue =
      e.target instanceof HTMLInputElement && e.target.type === "checkbox"
        ? e.target.checked
        : value;
    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const generateAppointmentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const defaultTime = "10:00";
    return `${day}/${month}/${year} ${defaultTime}`;
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { nombre, apellido, telefono, correo, servicio, mensaje } = formData;
    if (!nombre || !apellido || !telefono || !correo || !servicio || !mensaje) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (!CONTACT_WEBHOOK_URL) {
      alert("Falta configurar el webhook de contacto");
      return;
    }

    const payload: AppointmentWebhookPayload = {
      name: nombre,
      lastName: apellido,
      email: correo,
      phone: telefono,
      service: servicio,
      appointment_date: generateAppointmentDate(),
      message: mensaje,
      receivePromotion: formData.promociones,
      source: "web",
    };

    try {
      setIsSubmitting(true);
      const response = await fetch(CONTACT_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook respondio con estado ${response.status}`);
      }

      alert("Mensaje enviado correctamente. Nos pondremos en contacto pronto.");
      setFormData({
        nombre: "",
        apellido: "",
        telefono: "",
        correo: "",
        servicio: "",
        mensaje: "",
        promociones: false,
      });
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      alert("No se pudo enviar el mensaje. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScrollToOffices = () => {
    const officesSection = document.getElementById("offices");
    if (officesSection) {
      officesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Error al cargar datos: {error.message}</p>
        </div>
      </div>
    );
  }

  const heroImage = contactData?.heroImagen || "/images/contacts/hero.png";
  const heroTitle = contactData?.heroTitulo || "Contáctanos";
  const heroSubtitle =
    contactData?.heroSubtitulo ||
    "¿Tienes alguna pregunta o comentario? ¡Háznoslo saber!";
  const direcciones = contactData?.direcciones || [];

  return (
    <>
      <section className="relative overflow-hidden bg-neutral-900 h-screen">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={heroTitle}
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
              {heroTitle}
            </h1>
            <div className="sm:py-2 md:py-4">
              <a className="text-2xl font-semibold text-primary-100">
                {heroSubtitle}
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={
                  redes?.llamada ? `tel:${redes.llamada}` : "tel:+593123456789"
                }
                className="inline-flex rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-700"
              >
                Llámanos {redes?.llamada || "+593123456789"}{" "}
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
                  {option.isVideocall || option.isAgenda ? (
                    <button
                      onClick={() => setShowAppointmentDialog(true)}
                      className="mt-6 mb-8 inline-flex w-full items-center justify-center rounded-full bg-neutral-100 px-4 py-3 text-sm font-bold text-primary-700 transition hover:bg-primary-800 hover:text-white duration-200"
                    >
                      {option.action}
                    </button>
                  ) : option.href === "#offices" ? (
                    <button
                      onClick={handleScrollToOffices}
                      className="mt-6 mb-8 inline-flex w-full items-center justify-center rounded-full bg-neutral-100 px-4 py-3 text-sm font-bold text-primary-700 transition hover:bg-primary-800 hover:text-white duration-200"
                    >
                      {option.action}
                    </button>
                  ) : (
                    <Link
                      href={option.href}
                      target={
                        option.href.startsWith("https://")
                          ? "_blank"
                          : undefined
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

      <section id="contact-form" className="bg-secondary-50 py-14 md:py-16">
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

          <form
            onSubmit={handleFormSubmit}
            className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-primary-100 sm:p-10 h-auto overflow-y-auto"
          >
            <h3 className="text-3xl font-bold text-primary-700">
              Envíanos un mensaje
            </h3>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleFormChange}
                  placeholder="Ej: Juan Pérez"
                  className="h-12 w-full rounded-lg border border-primary-200 bg-primary-50 px-4 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleFormChange}
                  placeholder="Ej: García López"
                  className="h-12 w-full rounded-lg border border-primary-200 bg-primary-50 px-4 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleFormChange}
                  placeholder="+593"
                  className="h-12 w-full rounded-lg border border-primary-200 bg-primary-50 px-4 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleFormChange}
                  placeholder="ejemplo@email.com"
                  className="h-12 w-full rounded-lg border border-primary-200 bg-primary-50 px-4 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition"
                />
              </div>

              {/* <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Servicioo
                </label>
                <input
                  type="text"
                  name="servicio"
                  value={formData.servicio}
                  onChange={handleFormChange}
                  maxLength={20}
                  placeholder="Asesoría de viajes"
                  className="h-12 w-full rounded-lg border border-primary-200 bg-primary-50 px-4 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition"
                />
                <p className="text-xs text-neutral-400 text-right mt-1">
                  {formData.servicio.length}/20
                </p>
              </div> */}
            </div>

            {/* <div className="mt-6">
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                Mensaje
              </label>
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleFormChange}
                maxLength={100}
                placeholder="Cuéntenos sobre el viaje de sus sueños..."
                className="h-40 w-full rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition resize-none"
              />
              <p className="text-xs text-neutral-400 text-right mt-1">
                {formData.mensaje.length}/100
              </p>
            </div> */}

            <div className="mt-6 flex items-center">
              <input
                type="checkbox"
                id="promociones"
                name="promociones"
                checked={formData.promociones}
                onChange={handleFormChange}
                className="w-4 h-4 rounded border-primary-200 text-primary-600 focus:ring-primary-600"
              />
              <label htmlFor="promociones" className="ml-3 text-sm text-neutral-700">
                Deseo recibir promociones y descuentos en mi correo
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 inline-flex rounded-full bg-primary-700 px-10 py-3 text-base font-semibold text-white transition hover:bg-primary-800 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
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
            {direcciones.length > 0 ? (
              direcciones.map((office, index) => (
                <article
                  key={office.documentId}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200"
                >
                  <div className="relative">
                    <img
                      src={office.imagen || "/images/Contacts/default.png"}
                      alt={office.ciudad}
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
                      {office.ciudad}
                    </h3>
                    <p className="mt-2 text-sm text-neutral-600">
                      <MapPinIcon className="inline-block h-5 w-5 mr-2 text-primary-700" />{" "}
                      {office.direccion}
                    </p>

                    <button
                      onClick={() => window.open(office.url, "_blank")}
                      className="mt-4 w-full rounded-lg bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-100"
                    >
                      VER MAPA
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-neutral-600">
                  No hay oficinas disponibles en este momento.
                </p>
              </div>
            )}
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
