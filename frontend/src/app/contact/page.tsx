/* eslint-disable @next/next/no-img-element */
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const contactOptions = [
  {
    title: "Videollamada",
    description:
      "Puedes contactarnos directamente por una videollamada, estaremos dispuestos a brindarte asesoria.",
    action: "Hacer Videollamada",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&h=600&fit=crop",
  },
  {
    title: "WhatsApp",
    description: "Puedes contactarnos por WhatsApp a la hora que gustes.",
    action: "WhatsApp Directo",
    href: "https://wa.me/593984220600",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900&h=600&fit=crop",
  },
  {
    title: "Agenda tu cita",
    description:
      "Agenda tu cita con nosotros y te contactaremos inmediatamente.",
    action: "Agendar Cita",
    href: "/#appointment",
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
    image:
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=900&h=600&fit=crop",
  },
  {
    city: "Quito",
    address: "Av. Amazonas y Eloy Alfaro, Edificio Luxury Trade.",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?w=900&h=600&fit=crop",
  },
  {
    city: "Cuenca",
    address: "Calle Larga y Borrero, Casa Colonial Lux.",
    image:
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=900&h=600&fit=crop",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-neutral-900 min-h-150 max-h-200">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1800&h=900&fit=crop"
            alt="Contáctanos"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-primary-950/85 via-primary-900/55 to-primary-900/25" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl text-white">
            <span className="inline-flex rounded-full bg-tertiary-500/85 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-tertiary-50">
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
            <div className="hidden h-[2px] w-16 bg-tertiary-500 md:block" />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {contactOptions.map((option) => (
              <article
                key={option.title}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200"
              >
                <img
                  src={option.image}
                  alt={option.title}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-neutral-900">
                    {option.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                    {option.description}
                  </p>
                  <Link
                    href={option.href}
                    target={
                      option.href.startsWith("https://") ? "_blank" : undefined
                    }
                    className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary-100 px-4 py-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-200"
                  >
                    {option.action}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-50 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold text-accent-red">Contáctanos</p>
            <h2 className="mt-3 text-6xl font-bold leading-tight text-neutral-900">
              Haz <span className="text-primary-700 italic">realidad</span> el
              viaje que siempre soñaste
            </h2>
            <p className="mt-5 max-w-xl text-lg text-neutral-700">
              Déjanos tus datos y uno de nuestros expertos diseñará una
              experiencia única, pensada exclusivamente para ti.
            </p>
          </div>

          <form className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary-100 sm:p-8">
            <h3 className="text-4xl font-bold text-primary-700">
              Envíenos un mensaje
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Ej: Juan Pérez"
                className="h-12 rounded-lg border border-primary-100 bg-primary-50 px-4 text-sm outline-none focus:border-primary-300"
              />
              <input
                type="email"
                placeholder="ejemplo@email.com"
                className="h-12 rounded-lg border border-primary-100 bg-primary-50 px-4 text-sm outline-none focus:border-primary-300"
              />
              <input
                type="tel"
                placeholder="+593"
                className="h-12 rounded-lg border border-primary-100 bg-primary-50 px-4 text-sm outline-none focus:border-primary-300"
              />
              <select className="h-12 rounded-lg border border-primary-100 bg-primary-50 px-4 text-sm text-neutral-700 outline-none focus:border-primary-300">
                <option>Seleccione un destino</option>
                <option>Europa</option>
                <option>Asia</option>
                <option>Estados Unidos</option>
                <option>Sudamérica</option>
              </select>
            </div>
            <textarea
              placeholder="Cuéntenos sobre el viaje de sus sueños..."
              className="mt-4 h-32 w-full rounded-lg border border-primary-100 bg-primary-50 px-4 py-3 text-sm outline-none focus:border-primary-300"
            />
            <button
              type="submit"
              className="mt-5 inline-flex rounded-full bg-primary-700 px-8 py-3 text-sm font-semibold text-white transition hover:bg-primary-800"
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
            <div className="mx-auto mt-4 h-[3px] w-20 bg-tertiary-500" />
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
                    📍 {office.address}
                  </p>

                  <button className="mt-4 w-full rounded-lg bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-100">
                    VER MAPA
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white pb-0 pt-6 md:pt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-t-3xl bg-primary-700 px-8 py-14 text-center text-white shadow-xl">
            <div className="pointer-events-none absolute inset-0 opacity-25">
              <img
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&h=600&fit=crop"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="relative">
              <h3 className="mx-auto max-w-3xl text-5xl font-extrabold leading-tight">
                No espere más para vivir la experiencia Luxviajes
              </h3>
              <Link
                href="/packages"
                className="mt-7 inline-flex rounded-full bg-tertiary-400 px-8 py-3 text-sm font-semibold text-tertiary-950 transition hover:bg-tertiary-300"
              >
                Comenzar mi Planificación
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
