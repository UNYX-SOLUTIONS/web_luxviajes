/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { CheckBadgeIcon, AdjustmentsHorizontalIcon, EnvelopeIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import { ContactDialog } from '@/components/common/contact_dialog';

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

const visaRequirements = {
  'Visa Americana': {
    duration: '10 años',
    processing: '10-15 días',
    requirements: [
      'Pasaporte válido por mínimo 6 meses',
      'Formulario DS-160 completado',
      'Foto digital según especificaciones',
      'Comprobante de pago de la tarifa',
      'Comprobante de cita consular',
      'Documentos que demuestren vínculos con Ecuador',
      'Comprobante de solvencia económica',
      'Itinerario del viaje',
    ],
  },
  'Schengen': {
    duration: '3 años',
    processing: '15-20 días',
    requirements: [
      'Pasaporte válido por mínimo 3 meses después del viaje',
      'Formulario de solicitud completado',
      'Fotografía del tamaño correcto',
      'Seguro de viaje Schengen',
      'Comprobante de medios económicos',
      'Reserva de hotel o carta de invitación',
      'Reserva de vuelos',
      'Comprobante de solvencia laboral',
    ],
  },
  'Mexico': {
    duration: '6 años',
    processing: '3-5 días',
    requirements: [
      'Pasaporte válido',
      'Forma TM180 completada',
      'Comprobante de pago',
      'Fotografía digital',
      'Comprobante de estancia económica',
      'Comprobante de domicilio',
    ],
  },
  'Canada': {
    duration: '10 años',
    processing: '4-6 semanas',
    requirements: [
      'Pasaporte válido por mínimo 6 meses',
      'Confirmación de residencia',
      'Comprobante de medios económicos',
      'Carta de empleador',
      'Documentos de propósito de viaje',
      'Antecedentes penales limpios',
      'Examen médico (si aplica)',
    ],
  },
  'Reino Unido (UK)': {
    duration: '2-10 años',
    processing: '3-4 semanas',
    requirements: [
      'Pasaporte válido',
      'Comprobante de fondos económicos',
      'Comprobante de alojamiento',
      'Confirmación de viaje',
      'Carta de empleador',
      'Extractos bancarios de los últimos 6 meses',
      'Documentos que muestren vínculos con Ecuador',
    ],
  },
  'Costa Rica': {
    duration: 'Exento para ecuatorianos',
    processing: 'Inmediato',
    requirements: [
      'Pasaporte válido',
      'Comprobante de fondos',
      'Boleto de retorno',
      'Dirección en Costa Rica',
    ],
  },
  'Japon': {
    duration: '90 días',
    processing: '4-7 días',
    requirements: [
      'Pasaporte válido por mínimo 6 meses',
      'Formulario completado',
      'Fotografía 4x6 cm',
      'Comprobante de estancia económica',
      'Itinerario de viaje',
      'Carta de empleador',
      'Comprobantes de vivienda',
    ],
  },
  'Australia': {
    duration: '1-3 años',
    processing: '1-3 semanas',
    requirements: [
      'Pasaporte válido',
      'Comprobante de fondos',
      'Comprobante laboral',
      'Comprobante de domicilio',
      'Antecedentes penales',
      'Examen médico requerido',
      'Información de contacto de emergencia',
    ],
  },
  'Visado de Estudios Largos': {
    duration: 'Según programa',
    processing: '2-3 meses',
    requirements: [
      'Carta de aceptación de la universidad',
      'Comprobante de fondos suficientes',
      'Pasaporte válido',
      'Certificado de antecedentes penales',
      'Examen médico',
      'Seguro de salud estudiantil',
      'Comprobante de solvencia económica de patrocinador',
    ],
  },
  'Visados de Estudios Cortos': {
    duration: '3-6 meses',
    processing: '7-15 días',
    requirements: [
      'Carta de inscripción de la escuela',
      'Comprobante de pagos de cursos',
      'Pasaporte válido',
      'Comprobante de fondos',
      'Comprobante de domicilio',
      'Seguro de viaje',
    ],
  },
};

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
  const [selectedVisa, setSelectedVisa] = useState<string | null>(null);
  const [showRequirementsDialog, setShowRequirementsDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);

  const handleShowRequirements = (country: string) => {
    setSelectedVisa(country);
    setShowRequirementsDialog(true);
  };

  const handleCloseDialog = () => {
    setShowRequirementsDialog(false);
    setSelectedVisa(null);
  };

  // Controlar scroll del body cuando el dialog de requisitos está abierto
  useEffect(() => {
    if (showRequirementsDialog) {
      // Calcular el ancho de la scrollbar
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Aplicar nuevos estilos
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      
      // Cleanup
      return () => {
        document.body.style.overflow = 'unset';
        document.body.style.paddingRight = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = 'unset';
    }
  }, [showRequirementsDialog]);
  return (
    <>
      <section className="relative overflow-hidden bg-neutral-900 h-screen py-32">
        <div className="absolute inset-0">
          <img
            src="/images/hero/visas.png"
            alt="Asesoria de visas"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-primary-950/85 via-neutral-900/50 to-neutral-900/25" />
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
            <h5 className="mt-5 max-w-xl text-base text-white md:text-lg">
              Gestionamos tu documentacion con la precision de un concierge digital. Disfruta de tramites sin estres mientras nosotros cuidamos cada detalle de tu visado.
            </h5>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setShowContactDialog(true)}
                className="inline-flex rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-700"
              >
                Iniciar Asesoria
              </button>
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

      <section className="bg-neutral-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-neutral-900">Especialistas en Visados Mundiales</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-600">
              Seleccionamos los destinos mas solicitados para brindarte una experiencia de solicitud optimizada y garantizada.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visaCards.map((item) => (
              <article key={item.country} className="flex flex-col rounded-3xl bg-white p-8 shadow-sm ring-1 ring-neutral-200 transition hover:shadow-md">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-4xl">
                  {item.flag}
                </div>
                <h5 className="text-lg font-bold text-neutral-900">{item.country}</h5>
                <p className="mt-2 mb-6 text-sm text-neutral-600">{item.subtitle}</p>

                <div className="mt-auto">
                  <button
                    onClick={() => setShowContactDialog(true)}
                    className="w-full rounded-full bg-secondary-50 px-4 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-100 cursor-pointer"
                  >
                    Solicitar
                  </button>
                  <button 
                    onClick={() => handleShowRequirements(item.country)}
                    className="mt-4 block w-full text-center text-xs text-neutral-600 hover:text-primary-700 transition cursor-pointer"
                  >
                    Requisitos
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-50 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-20 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
              <article className="overflow-hidden rounded-3xl h-80">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop"
                  alt="Consultoria"
                  className="h-full w-full object-cover"
                />
              </article>
              <article className="flex items-center justify-center rounded-3xl bg-primary-700 text-white h-64">
                <CheckBadgeIcon className="h-16 w-16" />
              </article>
            </div>

            <div className="flex flex-col gap-4">
              <article className="flex items-center justify-center rounded-3xl bg-tertiary-500 text-white h-64">
                <AdjustmentsHorizontalIcon className="h-16 w-16" />
              </article>
              <article className="overflow-hidden rounded-3xl h-80">
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=500&fit=crop"
                  alt="Revision de documentos"
                  className="h-full w-full object-cover"
                />
              </article>
            </div>
          </div>

          <div>
            <h3 className="text-5xl font-bold text-neutral-900">Paso a Paso hacia tu Destino</h3>

            <div className="mt-10 space-y-8">
              {steps.map((step) => (
                <div key={step.id} className="flex gap-5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-700 text-sm font-bold text-white">
                    {step.id}
                  </div>
                  <div>
                    <h5 className="text-xl font-bold text-neutral-900">{step.title}</h5>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.description}</p>
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
                <h3 className="text-3xl font-bold mt-2">Programas de Larga Duracion</h3>
                <p className="my-2 max-w-2xl text-sm text-white!">
                  Maestrias, pregrados y PhD. Estancias superiores a 6 meses con beneficios de residencia estudiantil.
                </p>
                <a className="mt-4 text-sm font-semibold" href="/contact">
                  Duracion: +1 Ano
                </a>
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
            <p className="mx-auto mt-3 max-w-2xl text-white!">
              Habla hoy con un especialista en visados y garantiza que tu proxima aventura comience sin contratiempos.
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

      <section className="bg-white pb-16 md:pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[120px_1fr]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center text-primary-700 md:mx-0 md:h-24 md:w-24">
              <EnvelopeIcon className="h-16 w-16" />
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

      {/* Requirements Dialog */}
      {showRequirementsDialog && selectedVisa && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl flex flex-col max-h-[90vh] z-[1000]">
            {/* Header */}
            <div className="shrink-0 border-b border-neutral-200 bg-white px-8 py-6">
              <button
                onClick={handleCloseDialog}
                className="absolute right-6 top-6 rounded-full bg-neutral-100 p-2 hover:bg-neutral-200 transition"
              >
                <XMarkIcon className="h-6 w-6 text-neutral-700" />
              </button>
              
              <div className="flex items-center gap-4 pr-10">
                <span className="text-5xl">
                  {visaCards.find(v => v.country === selectedVisa)?.flag}
                </span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-3xl font-bold text-neutral-900 truncate">{selectedVisa}</h2>
                  <p className="text-sm text-neutral-600 mt-1 truncate">
                    {visaCards.find(v => v.country === selectedVisa)?.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Dialog Content - Scrollable */}
            <div className="flex-1 overflow-hidden p-8 md:p-10">
              {/* Quick Info */}
              <div className="mb-8 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-primary-50 p-4">
                  <p className="text-xs font-semibold text-primary-700 uppercase tracking-wider">Validez</p>
                  <p className="mt-2 text-lg font-bold text-neutral-900">
                    {visaRequirements[selectedVisa as keyof typeof visaRequirements]?.duration}
                  </p>
                </div>
                <div className="rounded-lg bg-tertiary-50 p-4">
                  <p className="text-xs font-semibold text-tertiary-700 uppercase tracking-wider">Procesamiento</p>
                  <p className="mt-2 text-lg font-bold text-neutral-900">
                    {visaRequirements[selectedVisa as keyof typeof visaRequirements]?.processing}
                  </p>
                </div>
              </div>

              {/* Requirements List */}
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">Requisitos Necesarios</h3>
                <ul className="space-y-3">
                  {visaRequirements[selectedVisa as keyof typeof visaRequirements]?.requirements.map((req, idx) => (
                    <li key={idx} className="flex gap-3">
                      <CheckBadgeIcon className="h-5 w-5 shrink-0 text-primary-700 mt-0.5" />
                      <span className="text-sm text-neutral-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Buttons - Fixed at bottom */}
            <div className="shrink-0 border-t border-neutral-200 bg-white px-8 py-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setShowContactDialog(true)}
                className="flex-1 rounded-full bg-primary-700 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-primary-800"
              >
                Iniciar Trámite
              </button>
              <button
                onClick={handleCloseDialog}
                className="flex-1 rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
              >
                Cerrar
              </button>
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
