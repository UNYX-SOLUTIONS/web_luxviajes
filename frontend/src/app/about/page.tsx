/* eslint-disable @next/next/no-img-element */
'use client';

import { Hero } from "@/components/common/Hero";
import { ContactDialog } from "@/components/common/contact_dialog";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useRedSocial, useAboutData } from "@/hooks";
import type { Asesor } from "@/types";

/**
 * Parsea texto con formato markdown-like:
 * - *texto* se convierte en <span className="...">texto</span>
 * - Soporta saltos de línea con <br/> o \n
 */
function parseStyledText(text: string, className: string = "text-primary-700 italic"): string {
  if (!text) return '';
  
  // Reemplazar *texto* con span estilizado
  let parsed = text.replace(
    /\*([^*]+)\*/g,
    `<span class="${className}">$1</span>`
  );
  
  // Convertir <br> y <br/> a <br /> válido
  parsed = parsed.replace(/<br\s*\/?>/gi, '<br />');
  
  // Convertir \n en <br />
  parsed = parsed.replace(/\n/g, '<br />');
  
  return parsed;
}

const highlights = [
  {
    title: "Atención personalizada",
    description:
      "No hay dos viajeros iguales. Diseñamos cada minuta pensando solo en ti.",
    icon: (
      <svg
        width="20"
        height="18"
        viewBox="0 0 20 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 18V16H17V8.9C17 6.95 16.3208 5.29583 14.9625 3.9375C13.6042 2.57917 11.95 1.9 10 1.9C8.05 1.9 6.39583 2.57917 5.0375 3.9375C3.67917 5.29583 3 6.95 3 8.9V15H2C1.45 15 0.979167 14.8042 0.5875 14.4125C0.195833 14.0208 0 13.55 0 13V11C0 10.65 0.0875 10.3208 0.2625 10.0125C0.4375 9.70417 0.683333 9.45833 1 9.275L1.075 7.95C1.20833 6.81667 1.5375 5.76667 2.0625 4.8C2.5875 3.83333 3.24583 2.99167 4.0375 2.275C4.82917 1.55833 5.7375 1 6.7625 0.6C7.7875 0.2 8.86667 0 10 0C11.1333 0 12.2083 0.2 13.225 0.6C14.2417 1 15.15 1.55417 15.95 2.2625C16.75 2.97083 17.4083 3.80833 17.925 4.775C18.4417 5.74167 18.775 6.79167 18.925 7.925L19 9.225C19.3167 9.375 19.5625 9.6 19.7375 9.9C19.9125 10.2 20 10.5167 20 10.85V13.15C20 13.4833 19.9125 13.8 19.7375 14.1C19.5625 14.4 19.3167 14.625 19 14.775V16C19 16.55 18.8042 17.0208 18.4125 17.4125C18.0208 17.8042 17.55 18 17 18H9ZM7 11C6.71667 11 6.47917 10.9042 6.2875 10.7125C6.09583 10.5208 6 10.2833 6 10C6 9.71667 6.09583 9.47917 6.2875 9.2875C6.47917 9.09583 6.71667 9 7 9C7.28333 9 7.52083 9.09583 7.7125 9.2875C7.90417 9.47917 8 9.71667 8 10C8 10.2833 7.90417 10.5208 7.7125 10.7125C7.52083 10.9042 7.28333 11 7 11ZM13 11C12.7167 11 12.4792 10.9042 12.2875 10.7125C12.0958 10.5208 12 10.2833 12 10C12 9.71667 12.0958 9.47917 12.2875 9.2875C12.4792 9.09583 12.7167 9 13 9C13.2833 9 13.5208 9.09583 13.7125 9.2875C13.9042 9.47917 14 9.71667 14 10C14 10.2833 13.9042 10.5208 13.7125 10.7125C13.5208 10.9042 13.2833 11 13 11ZM4.025 9.45C3.90833 7.68333 4.44167 6.16667 5.625 4.9C6.80833 3.63333 8.28333 3 10.05 3C11.5333 3 12.8375 3.47083 13.9625 4.4125C15.0875 5.35417 15.7667 6.55833 16 8.025C14.4833 8.00833 13.0875 7.6 11.8125 6.8C10.5375 6 9.55833 4.91667 8.875 3.55C8.60833 4.88333 8.04583 6.07083 7.1875 7.1125C6.32917 8.15417 5.275 8.93333 4.025 9.45Z"
          fill="#500088"
        />
      </svg>
    ),
  },
  {
    title: "Asesoría en visas",
    description:
      "Expertas en trámites complejos para que tu única preocupación sea empacar.",
    icon: (
      <svg
        width="16"
        height="20"
        viewBox="0 0 16 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.95 13.55L12.6 7.9L11.175 6.475L6.95 10.7L4.85 8.6L3.425 10.025L6.95 13.55ZM8 20C5.68333 19.4167 3.77083 18.0875 2.2625 16.0125C0.754167 13.9375 0 11.6333 0 9.1V3L8 0L16 3V9.1C16 11.6333 15.2458 13.9375 13.7375 16.0125C12.2292 18.0875 10.3167 19.4167 8 20ZM8 17.9C9.73333 17.35 11.1667 16.25 12.3 14.6C13.4333 12.95 14 11.1167 14 9.1V4.375L8 2.125L2 4.375V9.1C2 11.1167 2.56667 12.95 3.7 14.6C4.83333 16.25 6.26667 17.35 8 17.9Z"
          fill="#500088"
        />
      </svg>
    ),
  },
  {
    title: "Soporte 24/7",
    description: "Estamos contigo en cada zona horaria. Nunca viajarás solo.",
    icon: (
      <svg
        width="21"
        height="19"
        viewBox="0 0 21 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 18.15V16.15H20V18.15H2ZM3.75 13.15L0 6.9L2.4 6.25L5.2 8.6L8.7 7.675L3.525 0.775L6.425 0L13.9 6.275L18.15 5.125C18.6833 4.975 19.1875 5.0375 19.6625 5.3125C20.1375 5.5875 20.45 5.99167 20.6 6.525C20.75 7.05833 20.6875 7.5625 20.4125 8.0375C20.1375 8.5125 19.7333 8.825 19.2 8.975L3.75 13.15Z"
          fill="#500088"
        />
      </svg>
    ),
  },
  {
    title: "Planificación integral",
    description:
      "Desde vuelos hasta cenas secretas. Manejamos todo el ecosistema de tu viaje.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 18L6 15.9L1.35 17.7C1.01667 17.8333 0.708333 17.7958 0.425 17.5875C0.141667 17.3792 0 17.1 0 16.75V2.75C0 2.53333 0.0625 2.34167 0.1875 2.175C0.3125 2.00833 0.483333 1.88333 0.7 1.8L6 0L12 2.1L16.65 0.3C16.9833 0.166667 17.2917 0.204167 17.575 0.4125C17.8583 0.620833 18 0.9 18 1.25V15.25C18 15.4667 17.9375 15.6583 17.8125 15.825C17.6875 15.9917 17.5167 16.1167 17.3 16.2L12 18ZM11 15.55V3.85L7 2.45V14.15L11 15.55ZM13 15.55L16 14.55V2.7L13 3.85V15.55ZM2 15.3L5 14.15V2.45L2 3.45V15.3ZM13 3.85V15.55V3.85ZM5 2.45V14.15V2.45Z"
          fill="#500088"
        />
      </svg>
    ),
  },
];

const values = [
  {
    title: "Confianza",
    description: "Transparencia en cada paso.",
  },
  {
    title: "Cercanía",
    description: "Trato de humano a humano.",
  },
  {
    title: "Respuesta rápida",
    description: "Tu tiempo es nuestro activo.",
  },
  {
    title: "Soluciones",
    description: "Nada es imposible para nosotros.",
  },
];

export default function AboutPage() {
  const { data: redes } = useRedSocial();
  const { data: aboutData } = useAboutData();
  const [showContactDialog, setShowContactDialog] = useState(false);

  // Agrupar asesores por sede
  const teamByOffice = useMemo(() => {
    if (!aboutData?.asesors) return [];

    console.log("=== INICIO AGRUPACIÓN ===");
    console.log("Total de asesores recibidos en frontend:", aboutData.asesors.length);
    console.log("Asesores completos:", aboutData.asesors);

    const grouped: { [key: string]: Asesor[] } = {};
    
    aboutData.asesors.forEach((asesor, index) => {
      // Normalizar sede a minúsculas y quitar espacios/acentos
      const sedeOriginal = asesor.sede || 'sin-sede';
      const sedeNormalizada = sedeOriginal
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
        .trim();
      
      console.log(`[${index}] Asesor: ${asesor.nombre}`);
      console.log(`     Sede RAW: "${asesor.sede}"`);
      console.log(`     Sede Original: "${sedeOriginal}"`);
      console.log(`     Sede Normalizada: "${sedeNormalizada}"`);
      
      if (!grouped[sedeNormalizada]) {
        console.log(`     -> Creando nuevo grupo: "${sedeNormalizada}"`);
        grouped[sedeNormalizada] = [];
      } else {
        console.log(`     -> Agregando a grupo existente: "${sedeNormalizada}"`);
      }
      
      grouped[sedeNormalizada].push(asesor);
      console.log(`     -> Total en grupo "${sedeNormalizada}": ${grouped[sedeNormalizada].length}`);
    });

    // Mapear nombres de sedes
    const sedeNames: { [key: string]: string } = {
      'samborondon': 'Sede Guayas Samborondón',
      'quito': 'Sede Quito',
      'cuenca': 'Sede Cuenca',
      'guayaquil': 'Sede Guayaquil',
    };

    console.log("=== RESULTADO AGRUPACIÓN ===");
    console.log("Grupos creados:", Object.keys(grouped));
    Object.entries(grouped).forEach(([sede, asesores]) => {
      console.log(`Sede "${sede}": ${asesores.length} asesores`);
      asesores.forEach(a => console.log(`  - ${a.nombre}`));
    });

    return Object.entries(grouped).map(([sede, members]) => ({
      office: sedeNames[sede] || sede,
      members: members.map(m => ({
        name: m.nombre,
        photo: m.imagen || '/images/team/default.png',
      })),
    }));
  }, [aboutData]);

  return (
    <>
      <Hero
        title={aboutData?.heroTitulo || "Más que una agencia, somos tu aliado de viaje"}
        subtitle={aboutData?.heroSubtitulo || "Creamos experiencias, no solo viajes."}
        ctaText="Planifica tu viaje"
        ctaHref="#"
        onClick={() => setShowContactDialog(true)}
        heroImage={aboutData?.heroImagen}
      /> 
      <section className="bg-white relative">
        {/* Quiénes somos */}
        <div className="min-h-[80vh] flex py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8 w-full">
            <div />

            <div>
              <p className="text-base font-semibold uppercase tracking-wide mb-3 text-[#880000]!">
                Quienes somos
              </p>
              <h2 
                className="mt-4 text-4xl font-bold leading-tight text-neutral-900"
                dangerouslySetInnerHTML={{
                  __html: parseStyledText(
                    aboutData?.quienesSomosTitulo || "Expertos en hacer *realidad* <br/> tus sueños de viaje"
                  )
                }}
              />
              <div 
                className="mt-6 space-y-4 text-neutral-700"
                dangerouslySetInnerHTML={{
                  __html: parseStyledText(
                    aboutData?.quienesSomosDescripcion || 
                    "Nuestra historia comenzó en 2016 como un sueño apasionado: transformar la manera en que los ecuatorianos descubren el mundo. Lo que empezó como una pequeña semilla de curiosidad, se convirtió en una visión clara de excelencia.\n\nA pesar de los desafíos globales, en 2021, tras la pandemia, Luxviajes nació oficialmente. Entendimos que el mundo había cambiado y que el viajero moderno buscaba algo más que un ticket: buscaba seguridad, personalización y, sobre todo, una mano experta que lo guiara.\n\nHoy, somos el referente del lujo y la confianza en Guayaquil, Quito y Cuenca.",
                    "text-neutral-700"
                  )
                }}
              />
            </div>
          </div>
        </div>

        {/* Imagen entre secciones */}
        <div className="absolute left-0 top-21 translate-y-0 w-full pointer-events-none hidden lg:block">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="pointer-events-auto">
              <Image
                src="/images/about/about2.png"
                alt="Asesora Lux Viajes"
                width={600}
                height={900}
                className="w-full object-cover max-w-md"
              />
            </div>
          </div>
        </div>
      </section>
 
      <section className="bg-neutral-100 py-14 text-white">
        {/* Por qué elegirnos */}
        <div className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-base font-bold uppercase tracking-wider text-primary-700!">
                Por qué elegirnos
              </p>
              <h3 className="mt-2 text-3xl font-bold text-neutral-900">
                La diferencia está en el detalle
              </h3>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {highlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200"
                >
                  <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                    {item.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-neutral-900">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#4C4452]">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#500088] py-14 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div>
            <h3 className="text-3xl font-extrabold leading-tight">
              Un equipo en expansión,una
            </h3>{" "}
            <h3 className="text-3xl font-extrabold leading-tight">
              confianza que cruza fronteras
            </h3>
            <p className="mt-3 max-w-2xl text-[#DFB7FF]!">
              Crecemos para estar más cerca de ti, manteniendo siempre la
              esencia humana.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white/10! px-6 py-5 min-h-25 flex flex-col justify-center">
              <p className="text-4xl font-extrabold text-[#FFDDBB]!">{aboutData?.numExpertos || "+16"}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-white!">
                Expertos en el equipo
              </p>
            </div>
            <div className="rounded-2xl bg-white/10! px-6 py-5 min-h-25 flex flex-col justify-center">
              <p className="text-4xl font-extrabold text-[#FFDDBB]!">{aboutData?.ciudades || "3"}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-white!">
                Ciudades (Gye, Uio, Cue)
              </p>
            </div>
          </div>
        </div>
      </section>
 
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-md font-bold uppercase tracking-wider text-[#4E2D00]!">
            Nuestros valores
          </p>
          <h3 className="mt-2 text-4xl font-bold text-neutral-900">
            Lo que nos mueve
          </h3>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title}>
                <h4 className="text-lg font-semibold text-primary-700">
                  {value.title}
                </h4>
                <p className="mt-1 text-sm text-[#4C4452]!">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

          <blockquote className="mx-auto mt-14 max-w-3xl text-4xl font-extrabold leading-tight text-[#4C4452]!">
            &quot;Viajar es la única cosa que compras que te hace más rico&quot;
          </blockquote>
        </div>
      </section>

      <section className="bg-primary-50 py-16 md:py-20"> 
        <div className="mx-auto max-w-7xl rounded-t-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h3 className="text-4xl font-bold text-neutral-900">
              Conoce a tus cómplices
            </h3>
            <p className="mt-2 text-neutral-600">
              El talento detrás de cada itinerario perfecto.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-primary-100 bg-white/50">
            {teamByOffice.map((office) => (
              <div
                key={office.office}
                className="grid grid-cols-1 gap-6 border-b border-primary-100 px-6 py-8 last:border-b-0 md:grid-cols-[220px_1fr] md:gap-10"
              >
                <div className="flex items-center">
                  <h4 className="text-3xl font-semibold text-primary-700">
                    {office.office}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {office.members.map((member) => (
                    <article
                      key={member.name}
                      className="relative overflow-hidden rounded-2xl"
                    >
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="aspect-square w-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-neutral-950/90 via-neutral-900/45 to-transparent px-3 py-2">
                        <p className="text-sm font-bold text-white!">
                          {member.name}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-linear-to-r from-primary-800 to-primary-700 px-8 py-14 text-center shadow-2xl">
            <h3 className="text-4xl font-extrabold text-white">
              ¿Listo para tu próximo viaje?
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-primary-100!">
              Estamos aquí para convertir tus planes en recuerdos inolvidables.
              Hablemos hoy mismo.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <button
                onClick={() => setShowContactDialog(true)}
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-primary-800 transition hover:bg-primary-50"
              >
                Hablar con un asesor
              </button>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-full border border-primary-300 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Ver nuestros servicios
              </Link>
            </div>
          </div>
        </div>

        <ContactDialog
          isOpen={showContactDialog}
          onClose={() => setShowContactDialog(false)}
          whatsappNumber={redes?.whatsapp.replace(/[^0-9]/g, '') || "593964220600"}
          phoneNumber={redes?.llamada || "+593964220600"}
          videoCallUrl="/contact"
        />
      </section>
    </>
  );
}
