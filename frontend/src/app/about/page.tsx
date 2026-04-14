/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

const highlights = [
  {
    title: 'Atencion personalizada',
    description: 'No hay dos viajeros iguales. Disenamos cada minuta pensando solo en ti.',
  },
  {
    title: 'Asesoria en visas',
    description: 'Expertas en tramites complejos para que tu unica preocupacion sea empacar.',
  },
  {
    title: 'Soporte 24/7',
    description: 'Estamos contigo en cada zona horaria. Nunca viajaras solo.',
  },
  {
    title: 'Planificacion integral',
    description: 'Desde vuelos hasta cenas secretas. Manejamos todo el ecosistema de tu viaje.',
  },
];

const values = [
  {
    title: 'Confianza',
    description: 'Transparencia en cada paso.',
  },
  {
    title: 'Cercania',
    description: 'Trato de humano a humano.',
  },
  {
    title: 'Respuesta rapida',
    description: 'Tu tiempo es nuestro activo.',
  },
  {
    title: 'Soluciones',
    description: 'Nada es imposible para nosotros.',
  },
];

const teamByOffice = [
  {
    office: 'Sede Guayaquil',
    members: [
      { name: 'Ana Rivas', role: 'Asesora Senior', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop' },
      { name: 'Marta Leon', role: 'Visas y Documentos', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop' },
      { name: 'Judith Villacis', role: 'Paquetes Premium', photo: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=300&h=300&fit=crop' },
      { name: 'Elina Reyes', role: 'Atencion al Cliente', photo: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=300&h=300&fit=crop' },
      { name: 'Karla Salas', role: 'Experiencias Luxury', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop' },
    ],
  },
  {
    office: 'Sede Quito',
    members: [
      { name: 'Kenia Ayala', role: 'Coordinadora Quito', photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop' },
      { name: 'Karla Jara', role: 'Asesora Corporativa', photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&h=300&fit=crop' },
      { name: 'Kari Mazo', role: 'Especialista Europa', photo: 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=300&h=300&fit=crop' },
    ],
  },
  {
    office: 'Sede Cuenca',
    members: [
      { name: 'Ludmila Chacon', role: 'Lider Regional', photo: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=300&h=300&fit=crop' },
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1800&h=900&fit=crop"
            alt="Equipo Lux Viajes"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-neutral-950/55" />
          <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-b from-primary-950/80 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold leading-tight text-white md:text-6xl">
              Mas que una agencia, somos tu aliado de viaje
            </h1>
            <p className="mt-5 max-w-xl text-lg text-neutral-100">
              Creamos experiencias, no solo viajes.
            </p>
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-700"
              >
                Planifica tu viaje
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="mx-auto max-w-md">
            <img
              src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1200&fit=crop"
              alt="Asesora Lux Viajes"
              className="w-full rounded-2xl object-cover shadow-xl"
            />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent-red">Quienes somos</p>
            <h2 className="mt-4 text-4xl font-bold leading-tight text-neutral-900">
              Expertos en hacer <span className="text-primary-700 italic">realidad</span> tus suenos de viaje
            </h2>
            <div className="mt-6 space-y-4 text-neutral-700">
              <p>
                Nuestra historia comenzo en 2016 como un sueno apasionado: transformar la manera en que los ecuatorianos descubren el mundo.
                Lo que empezo como una pequena semilla de curiosidad, se convirtio en una vision clara de excelencia.
              </p>
              <p>
                A pesar de los desafios globales, en 2021, tras la pandemia, Luxviajes nacio oficialmente. Entendimos que el mundo habia cambiado
                y que el viajero moderno buscaba algo mas que un ticket: buscaba seguridad, personalizacion y, sobre todo, una mano experta que lo guiara.
              </p>
              <p>
                Hoy, somos el referente del lujo y la confianza en Guayaquil, Quito y Cuenca.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">Por que elegirnos</p>
            <h3 className="mt-2 text-3xl font-bold text-neutral-900">La diferencia esta en el detalle</h3>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => (
              <article key={item.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
                <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-neutral-900">{item.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-800 py-14 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="md:col-span-2">
            <h3 className="text-3xl font-bold leading-tight">Un equipo en expansion, una confianza que cruza fronteras</h3>
            <p className="mt-3 max-w-2xl text-primary-100">
              Crecemos para estar mas cerca de ti, manteniendo siempre la esencia humana.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-4xl font-extrabold">+16</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-primary-100">Expertos en el equipo</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-4xl font-extrabold">3</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-primary-100">Ciudades (Gye, Uio, Cue)</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-tertiary-700">Nuestros valores</p>
          <h3 className="mt-2 text-4xl font-bold text-neutral-900">Lo que nos mueve</h3>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title}>
                <h4 className="text-lg font-semibold text-primary-700">{value.title}</h4>
                <p className="mt-1 text-sm text-neutral-600">{value.description}</p>
              </div>
            ))}
          </div>

          <blockquote className="mx-auto mt-14 max-w-3xl text-4xl font-bold leading-tight text-neutral-700">
            Viajar es la unica cosa que compras que te hace mas rico
          </blockquote>
        </div>
      </section>

      <section className="bg-primary-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl rounded-t-3xl bg-primary-50 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h3 className="text-4xl font-bold text-neutral-900">Conoce a tus complices</h3>
            <p className="mt-2 text-neutral-600">El talento detras de cada itinerario perfecto.</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-primary-100 bg-white/50">
            {teamByOffice.map((office) => (
              <div key={office.office} className="grid grid-cols-1 gap-6 border-b border-primary-100 px-6 py-8 last:border-b-0 md:grid-cols-[220px_1fr] md:gap-10">
                <div className="flex items-center">
                  <h4 className="text-3xl font-semibold text-primary-700">{office.office}</h4>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {office.members.map((member) => (
                    <article key={member.name} className="relative overflow-hidden rounded-2xl">
                      <img src={member.photo} alt={member.name} className="aspect-square w-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-neutral-950/90 via-neutral-900/45 to-transparent px-3 py-2">
                        <p className="text-sm font-semibold text-white">{member.name}</p>
                        <p className="text-xs text-neutral-200">{member.role}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-100 py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-linear-to-r from-primary-800 to-primary-700 px-8 py-14 text-center shadow-2xl">
            <h3 className="text-4xl font-extrabold text-white">Listo para tu proximo viaje?</h3>
            <p className="mx-auto mt-3 max-w-2xl text-primary-100">
              Estamos aqui para convertir tus planes en recuerdos inolvidables. Hablemos hoy mismo.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="https://wa.me/593984220600"
                target="_blank"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-primary-800 transition hover:bg-primary-50"
              >
                Hablar con un asesor
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-full border border-primary-300 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Ver nuestros servicios
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
