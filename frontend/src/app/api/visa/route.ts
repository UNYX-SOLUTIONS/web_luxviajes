import { NextResponse } from "next/server";
import qs from "qs";
import { VisasPage } from "@/types";

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

interface StrapiVisaItem {
  id: number;
  documentId: string;
  titulo: string;
  subtitulo: string;
  validez: string;
  procesamiento: string;
  requisitos: string;
  precio?: number;
  bandera?: StrapiImagen;
  pdf?: StrapiPdf;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiVisasPageResponse {
  data: {
    id: number;
    documentId: string;
    heroTitulo: string;
    heroSubtitulo: string;
    seccionGeneralTitulo: string;
    seccionGeneralContenido: string;
    llamadaTitulo: string;
    llamadaSubtitulo: string;
    subscripcionTitulo: string;
    subscripcionSubtitulo: string;
    heroImagen?: StrapiImagen;
    visa_items: StrapiVisaItem[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  meta: Record<string, unknown>;
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
          heroImagen: {
            populate: "*",
          },
          visa_items: {
            populate: {
              bandera: {
                populate: "*",
              },
              pdf: {
                populate: "*",
              },
            },
          },
        },
      },
      { encodeValuesOnly: true },
    );

    // console.log("🛂 Fetching visas page data from Strapi...");
    const response = await fetch(`${STRAPI_URL}/visa?${query}`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Strapi responded with status: ${response.status}`);
    }

    const strapiData: StrapiVisasPageResponse = await response.json();
    // console.log("✅ Visas page data received");
    // console.log(`📊 Total visas: ${strapiData.data.visa_items?.length || 0}`);

    // Transformar datos
    const transformedData: VisasPage = {
      heroTitulo: strapiData.data.heroTitulo,
      heroSubtitulo: strapiData.data.heroSubtitulo,
      seccionGeneralTitulo: strapiData.data.seccionGeneralTitulo,
      seccionGeneralContenido: strapiData.data.seccionGeneralContenido,
      llamadaTitulo: strapiData.data.llamadaTitulo,
      llamadaSubtitulo: strapiData.data.llamadaSubtitulo,
      subscripcionTitulo: strapiData.data.subscripcionTitulo,
      subscripcionSubtitulo: strapiData.data.subscripcionSubtitulo,
      heroImagen: getImageUrl(strapiData.data.heroImagen),
      visa_items: (strapiData.data.visa_items || []).map((visa) => ({
        ...visa,
        imagen: getImageUrl(visa.bandera),
        pdf: getPdfUrl(visa.pdf),
        precio: visa.precio,
      })),
    };

    return NextResponse.json(transformedData, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("❌ Error fetching visas page data:", error);
    return NextResponse.json(
      { error: "Failed to fetch visas page data" },
      { status: 500 },
    );
  }
}
