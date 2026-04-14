/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

const serviceCards = [
  {
    title: 'Boleto Aereo',
    image: 'https://images.unsplash.com/photo-1540339832862-474599807836?w=900&h=600&fit=crop',
  },
  {
    title: 'Paquetes Turisticos',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&h=600&fit=crop',
    large: true,
  },
  {
    title: 'Tours Nacionales',
    image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=900&h=600&fit=crop',
  },
  {
    title: 'Seguros de Viaje',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900&h=600&fit=crop',
  },
  {
    title: 'Visas y Turnos',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=900&h=600&fit=crop',
  },
  {
    title: 'Expediciones en Crucero',
    image: 'https://images.unsplash.com/photo-1518544866330-95a2af4899a3?w=1400&h=600&fit=crop',
    wide: true,
  },
];

const testimonials = [
  {
    name: 'Maria M.',
    text: 'Organizaron cada detalle y no tuve que preocuparme por nada.',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=500&fit=crop',
  },
  {
    name: 'Alejandro M.',
    text: 'Luxviajes transformo mis vacaciones familiares en una experiencia perfecta.',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=900&h=700&fit=crop',
    featured: true,
  },
  {
    name: 'Pedro M.',
    text: 'Excelente asesoria para visas y rutas internacionales.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=500&fit=crop',
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-neutral-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=1800&h=900&fit=crop"
            alt="Servicios de viaje premium"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-primary-950/90 via-primary-900/70 to-primary-900/30" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl text-white">
            <span className="inline-flex rounded-full bg-tertiary-500/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-tertiary-50">
              Elite Excursives
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-6xl">
              Tu Viaje,
              <br />
              Nuestra Prioridad
            </h1>
            <p className="mt-5 max-w-xl text-base text-primary-100 md:text-lg">
              Elevamos tus experiencias de viaje a una obra maestra. Un servicio de guante blanco disenado para quienes buscan lo extraordinario.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-700"
              >
                Disenar Mi Viaje
              </Link>
              <span className="text-sm text-primary-100">Acompanamiento 24/7</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-white [clip-path:polygon(0_45%,100%_0,100%_100%,0_100%)]" />
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-primary-700 md:text-4xl">Nuestra Propuesta de Valor</h2>
              <p className="mt-2 max-w-xl text-sm text-neutral-600">
                Cada detalle es orquestado por expertos para asegurar que tu unica preocupacion sea disfrutar el horizonte.
              </p>
            </div>
            <div className="hidden h-[2px] w-16 bg-tertiary-500 md:block" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {serviceCards.map((card) => (
              <article
                key={card.title}
                className={[
                  'group relative overflow-hidden rounded-xl',
                  card.large ? 'md:col-span-2' : '',
                  card.wide ? 'md:col-span-3' : '',
                ].join(' ')}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className={[
                    'w-full object-cover transition duration-300 group-hover:scale-105',
                    card.wide ? 'h-44 md:h-52' : 'h-52 md:h-60',
                  ].join(' ')}
                />
                <div className="absolute inset-0 bg-linear-to-t from-neutral-950/75 via-neutral-900/25 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-accent-red">Testimonios</p>
          <h2 className="mt-1 text-4xl font-bold text-neutral-900">Historias de Viajeros</h2>

          <div className="mt-10 grid grid-cols-1 items-end gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <article
                key={item.name}
                className={[
                  'relative overflow-hidden rounded-2xl shadow-lg',
                  item.featured ? 'md:scale-105' : '',
                ].join(' ')}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className={[
                    'w-full object-cover',
                    item.featured ? 'h-80' : 'h-56',
                  ].join(' ')}
                />
                <div className="absolute inset-0 bg-linear-to-t from-primary-950/70 to-transparent" />
                <div className={[
                  'absolute left-4 right-4 rounded-xl p-4 text-white',
                  item.featured ? 'bottom-4 bg-primary-700/90' : 'bottom-3 bg-primary-800/85',
                ].join(' ')}>
                  <p className="text-xs font-semibold uppercase tracking-wider">{item.name}</p>
                  <p className="mt-2 text-sm leading-relaxed">"{item.text}"</p>
                  <p className="mt-2 text-tertiary-300">★★★★★</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-50 pb-16 md:pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-primary-900 to-primary-700 px-8 py-14 text-center text-white shadow-2xl">
            <div className="pointer-events-none absolute inset-0 opacity-15">
              <img
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=500&fit=crop"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="relative">
              <h3 className="text-4xl font-extrabold md:text-5xl">Listo para tu proxima historia?</h3>
              <p className="mx-auto mt-3 max-w-2xl text-primary-100">
                Nuestros asesores estan listos para transformar sus deseos en un itinerario inolvidable.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="https://wa.me/593984220600"
                  target="_blank"
                  className="inline-flex items-center rounded-full bg-accent-green px-7 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-accent-green/90"
                >
                  WhatsApp Directo
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-primary-800 transition hover:bg-primary-50"
                >
                  Formulario de Contacto
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
