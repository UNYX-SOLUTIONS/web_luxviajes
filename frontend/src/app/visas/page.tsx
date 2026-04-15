/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

const visaCards = [
  { country: 'Visa Americana', subtitle: 'Turismo, Negocios y Transito', flag: '🇺🇸' },
  { country: 'Schengen', subtitle: '27 Paises Europeos', flag: '🇪🇺' },
  { country: 'Mexico', subtitle: 'Visitame sin permiso de lujo', flag: '🇲🇽' },
  { country: 'Canada', subtitle: 'eTA o Visa de Visitante', flag: '🇨🇦' },
  { country: 'Reino Unido (UK)', subtitle: 'Turismo, Negocios y Transito', flag: '🇬🇧' },
  { country: 'Costa Rica', subtitle: '27 Paises Europeos', flag: '🇪🇺' },
  { country: 'Japon', subtitle: 'Visitame sin permiso de lujo', flag: '🇯🇵' },
  { country: 'Australia', subtitle: 'eTA o Visa de Visitante', flag: '🇦🇺' },
  { country: 'Visado de Estudios Largos', subtitle: 'Programas + 1 ano', flag: '🇺🇸' },
  { country: 'Visados de Estudios Cortos', subtitle: 'Cursos y diplomados', flag: '🇪🇺' },
];

const steps = [
  {
    id: '01',
    title: 'Diagnostico Inicial',
    description: 'Evaluamos tu perfil y proposito de viaje para determinar la mejor estrategia de solicitud.',
  },
  {
    id: '02',
    title: 'Gestion Documental',
    description: 'Recoleccion, revision tecnica y digitalizacion de todos los soportes necesarios.',
  },
  {
    id: '03',
    title: 'Acompanamiento VIP',
    description: 'Te preparamos para entrevistas y realizamos el seguimiento ante embajadas.',
  },
];

export default function VisasPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-neutral-900 h-screen py-32">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1800&h=900&fit=crop"
            alt="Asesoria de visas"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-primary-950/85 via-primary-900/50 to-primary-900/25" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl text-white">
            <span className="inline-flex rounded-full bg-primary-500/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              Servicio White-Glove
            </span>
            <h1 className="mt-5 text-5xl font-extrabold leading-tight md:text-7xl">
              Viaja Sin
              <br />
              <span className="text-primary-400">Fronteras</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-primary-100 md:text-lg">
              Gestionamos tu documentacion con la precision de un concierge digital. Disfruta de tramites sin estres mientras nosotros cuidamos cada detalle de tu visado.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-700"
              >
                Iniciar Asesoria
              </Link>
              <Link
                href="/packages"
                className="inline-flex rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Ver Destinos
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-neutral-900">Especialistas en Visados Mundiales</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-neutral-600">
              Seleccionamos los destinos mas solicitados para brindarte una experiencia de solicitud optimizada y garantizada.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visaCards.map((item) => (
              <article key={item.country} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-primary-100">
                <div className="mb-4 text-3xl">{item.flag}</div>
                <h3 className="text-lg font-semibold text-neutral-900">{item.country}</h3>
                <p className="mt-1 text-xs text-neutral-600">{item.subtitle}</p>

                <button className="mt-4 w-full rounded-full bg-primary-100 px-4 py-2 text-xs font-semibold text-primary-700 transition hover:bg-primary-200">
                  Solicitar
                </button>
                <p className="mt-2 text-center text-[11px] text-neutral-400">Requisitos</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-50 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="grid grid-cols-2 gap-3">
            <article className="overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=700&h=700&fit=crop"
                alt="Consultoria"
                className="h-full w-full object-cover"
              />
            </article>
            <article className="flex min-h-44 items-center justify-center rounded-2xl bg-tertiary-500 text-white">
              <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0-6l1.96 3.97L18 6.56l-2.82 2.75L15.82 13 12 11l-3.82 2 0.64-3.69L6 6.56l4.04-0.59L12 2z" />
              </svg>
            </article>
            <article className="flex min-h-44 items-center justify-center rounded-2xl bg-primary-700 text-white">
              <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6M7 8h10M7 4h10M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </article>
            <article className="overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=700&h=700&fit=crop"
                alt="Revision de documentos"
                className="h-full w-full object-cover"
              />
            </article>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-neutral-900">Paso a Paso hacia tu Destino</h2>

            <div className="mt-8 space-y-8">
              {steps.map((step) => (
                <div key={step.id} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-primary-700 ring-1 ring-primary-200">
                    {step.id}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">Oportunidades Academicas</p>
            <h2 className="mt-2 text-4xl font-bold text-neutral-900">Visados de Estudios</h2>
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
                <h3 className="text-3xl font-bold">Programas de Larga Duracion</h3>
                <p className="mt-2 max-w-2xl text-sm text-primary-100">
                  Maestrias, pregrados y PhD. Estancias superiores a 6 meses con beneficios de residencia estudiantil.
                </p>
                <p className="mt-4 text-sm font-semibold">Duracion: +1 Ano</p>
              </div>
            </article>

            <div className="space-y-4">
              <article className="rounded-2xl bg-tertiary-50 p-6 ring-1 ring-tertiary-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-tertiary-700">Cursos de Idiomas</p>
                <p className="mt-2 text-sm text-neutral-700">
                  Experiencias inmersivas de 3 a 6 meses en escuelas certificadas.
                </p>
                <Link href="/contact" className="mt-3 inline-flex text-sm font-semibold text-tertiary-700 hover:text-tertiary-800">
                  Consultar Duracion →
                </Link>
              </article>

              <article className="rounded-2xl bg-primary-50 p-6 ring-1 ring-primary-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">Diplomados Cortos</p>
                <p className="mt-2 text-sm text-neutral-700">
                  Especializaciones tecnicas con procesos de visado simplificados.
                </p>
                <Link href="/contact" className="mt-3 inline-flex text-sm font-semibold text-primary-700 hover:text-primary-800">
                  Ver Requisitos →
                </Link>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-16 md:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-linear-to-r from-primary-800 to-primary-700 px-8 py-14 text-center text-white shadow-xl">
            <h3 className="text-5xl font-bold">Listo para despegar?</h3>
            <p className="mx-auto mt-3 max-w-2xl text-primary-100">
              Habla hoy con un especialista en visados y garantiza que tu proxima aventura comience sin contratiempos.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex rounded-full bg-white px-8 py-3 text-sm font-semibold text-primary-800 transition hover:bg-primary-50"
              >
                Hablar con un Especialista
              </Link>
              <Link
                href="tel:+593984220600"
                className="inline-flex rounded-full border border-white/30 bg-white/10 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                +1 800 LUXVIAJES
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-16 md:pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[120px_1fr]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-lg border border-primary-300 text-primary-500 md:mx-0 md:h-24 md:w-24">
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l8.89 5.93a2 2 0 002.22 0L23 8m-20 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>

            <div>
              <h3 className="text-4xl font-bold text-primary-700">Ofertas exclusivas en tu email</h3>
              <form className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Email"
                  className="h-12 flex-1 rounded-lg border border-neutral-300 px-4 text-sm outline-none focus:border-primary-400"
                />
                <button
                  type="submit"
                  className="h-12 rounded-full bg-primary-700 px-6 text-sm font-semibold text-white transition hover:bg-primary-800"
                >
                  iQuiero recibirlas!
                </button>
              </form>
              <p className="mt-3 text-xs text-neutral-500">
                Recibiras emails promocionales de Luxviajes. Para mas informacion consulta las politicas de privacidad.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
