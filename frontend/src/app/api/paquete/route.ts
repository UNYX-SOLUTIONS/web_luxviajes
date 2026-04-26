import { NextResponse } from "next/server";
import qs from "qs";

const STRAPI_URL = "https://cms.agencialuxviajes.com/api";
const STRAPI_ORIGIN = "https://cms.agencialuxviajes.com";

interface StrapiImagen {
  formats?: {
    large?: { url?: string };
    medium?: { url?: string };
    small?: { url?: string };
  };
  url?: string;
}

interface StrapiPdf {
  url?: string;
}

interface DestinoSonado {
  id: number;
  documentId: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  disponibilidad: string;
  duracion: string;
  precio: string;
  descripcionDetallada: string;
  imagen?: StrapiImagen;
  pdf?: StrapiPdf;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface PaquetePremium {
  id: number;
  documentId: string;
  etiqueta: string;
  dias: string;
  titulo: string;
  descripcion: string;
  duracion: string;
  precio: string;
  imagen?: StrapiImagen;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  pdf?: StrapiPdf;
}

interface ParqueTematico {
  id: number;
  documentId: string;
  titulo: string;
  subtitulo?: string;
  imagen?: StrapiImagen;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiPaqueteResponse {
  data: {
    id: number;
    documentId: string;
    heroTitulo?: string;
    heroSubtitulo?: string;
    llamadaTitulo?: string;
    llamadaSubtitulo?: string;
    boletinTitulo?: string;
    boletinDescripcion?: string;
    imagen?: StrapiImagen;
    destinosSonados?: DestinoSonado[];
    paquetesPremium?: PaquetePremium[];
    parquesTematicos?: ParqueTematico[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

// Helper para extraer URL de imagen (prioriza large > medium > small > url)
function getImageUrl(imagen?: StrapiImagen): string | undefined {
  if (!imagen) return undefined;

  const url =
    imagen.formats?.large?.url ||
    imagen.formats?.medium?.url ||
    imagen.formats?.small?.url ||
    imagen.url;

  return url ? `${STRAPI_ORIGIN}${url}` : undefined;
}

// Helper para extraer URL de PDF
function getPdfUrl(pdf?: StrapiPdf): string | undefined {
  if (!pdf?.url) return undefined;
  return `${STRAPI_ORIGIN}${pdf.url}`;
}

export async function GET() {
  try {
    // Construir query con populate anidado usando qs
    const query = qs.stringify(
      {
        populate: {
          imagen: {
            populate: "*",
          },
          destinosSonados: {
            populate: {
              imagen: {
                populate: "*",
              },
              pdf: {
                populate: "*",
              },
            },
          },
          paquetesPremium: {
            populate: {
              imagen: {
                populate: "*",
              },
              pdf: {
                populate: "*",
              },
            },
          },
          parquesTematicos: {
            populate: {
              imagen: {
                populate: "*",
              },
            },
          },
        },
      },
      { encodeValuesOnly: true },
    );

    console.log("📦 Fetching paquete data from Strapi...");
    const response = await fetch(`${STRAPI_URL}/paquete?${query}`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Strapi responded with status: ${response.status}`);
    }

    const strapiData: StrapiPaqueteResponse = await response.json();
    console.log("✅ Paquete data received");
    console.log(
      `📊 Destinos soñados: ${strapiData.data.destinosSonados?.length || 0}`,
    );
    console.log(
      `📊 Paquetes premium: ${strapiData.data.paquetesPremium?.length || 0}`,
    );
    console.log(
      `📊 Parques temáticos: ${strapiData.data.parquesTematicos?.length || 0}`,
    );

    // Transformar destinosSonados
    const transformedDestinosSonados =
      strapiData.data.destinosSonados?.map((destino) => ({
        ...destino,
        imagen: getImageUrl(destino.imagen),
        pdf: getPdfUrl(destino.pdf),
      })) || [];

    // Transformar paquetesPremium
    const transformedPaquetesPremium =
      strapiData.data.paquetesPremium?.map((paquete) => ({
        ...paquete,
        imagen: getImageUrl(paquete.imagen),
        pdf: getPdfUrl(paquete.pdf),
      })) || [];

    // Transformar parquesTematicos
    const transformedParquesTematicos =
      strapiData.data.parquesTematicos?.map((parque) => ({
        ...parque,
        imagen: getImageUrl(parque.imagen),
      })) || [];

    // Construir respuesta transformada
    const transformedData = {
      id: strapiData.data.id,
      documentId: strapiData.data.documentId,
      heroTitulo: strapiData.data.heroTitulo,
      heroSubtitulo: strapiData.data.heroSubtitulo,
      llamadaTitulo: strapiData.data.llamadaTitulo,
      llamadaSubtitulo: strapiData.data.llamadaSubtitulo,
      boletinTitulo: strapiData.data.boletinTitulo,
      boletinDescripcion: strapiData.data.boletinDescripcion,
      imagen: getImageUrl(strapiData.data.imagen),
      destinosSonados: transformedDestinosSonados,
      paquetesPremium: transformedPaquetesPremium,
      parquesTematicos: transformedParquesTematicos,
      createdAt: strapiData.data.createdAt,
      updatedAt: strapiData.data.updatedAt,
      publishedAt: strapiData.data.publishedAt,
    };

    return NextResponse.json(transformedData, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("❌ Error fetching paquete data:", error);
    return NextResponse.json(
      { error: "Failed to fetch paquete data" },
      { status: 500 },
    );
  }
}
