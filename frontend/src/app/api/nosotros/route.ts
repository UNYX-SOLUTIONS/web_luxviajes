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

interface Asesor {
  id: number;
  documentId: string;
  nombre: string;
  Sede: string;
  imagen?: StrapiImagen;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiNosotrosResponse {
  data: {
    id: number;
    documentId: string;
    heroTitulo?: string;
    heroSubtitulo?: string;
    heroImagen?: StrapiImagen;
    quienesSomosTitulo?: string;
    quienesSomosDescripcion?: string;
    numExpertos?: string;
    ciudades?: string;
    asesores?: Asesor[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

/**
 * Extrae la URL de imagen de un objeto de imagen de Strapi
 * Prioridad: large > medium > small > url
 */
function getImageUrl(imagen?: StrapiImagen): string {
  if (!imagen) return "";

  // Intentar obtener desde formatos (large, medium, small)
  const largeUrl = imagen.formats?.large?.url;
  if (largeUrl) return `${STRAPI_ORIGIN}${largeUrl}`;

  const mediumUrl = imagen.formats?.medium?.url;
  if (mediumUrl) return `${STRAPI_ORIGIN}${mediumUrl}`;

  const smallUrl = imagen.formats?.small?.url;
  if (smallUrl) return `${STRAPI_ORIGIN}${smallUrl}`;

  // Fallback a la url principal
  if (imagen.url) return `${STRAPI_ORIGIN}${imagen.url}`;

  return "";
}

/**
 * Extrae la URL de imagen pequeña de un objeto de imagen de Strapi
 * Prioridad: small > medium > url (para avatares y thumbnails)
 */
function getSmallImageUrl(imagen?: StrapiImagen): string {
  if (!imagen) return "";

  // Priorizar small para imágenes de asesoras
  const smallUrl = imagen.formats?.small?.url;
  if (smallUrl) return `${STRAPI_ORIGIN}${smallUrl}`;

  const mediumUrl = imagen.formats?.medium?.url;
  if (mediumUrl) return `${STRAPI_ORIGIN}${mediumUrl}`;

  // Fallback a la url principal
  if (imagen.url) return `${STRAPI_ORIGIN}${imagen.url}`;

  return "";
}

export async function GET() {
  try {
    const query = qs.stringify(
      {
        populate: {
          heroImagen: {
            populate: "*",
          },
          asesores: {
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

    // console.log("Query generada:", query);
    // console.log("URL completa:", `${STRAPI_URL}/nosotros?${query}`);

    const response = await fetch(`${STRAPI_URL}/nosotros?${query}`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 10 }, // Revalidar cada 10 segundos
    });

    if (!response.ok) {
      throw new Error(`Strapi respondió con estado ${response.status}`);
    }

    const data: StrapiNosotrosResponse = await response.json();

    // console.log("Respuesta completa de Strapi:", JSON.stringify(data, null, 2));
    // console.log(
    //   `Total de asesores recibidos: ${data.data.asesores?.length || 0}`,
    // );

    // Transformar asesores con sus imágenes
    const asesoresTransformados = (data.data.asesores || []).map((asesor) => ({
      id: asesor.id,
      documentId: asesor.documentId,
      nombre: asesor.nombre,
      sede: asesor.Sede,
      imagen: getSmallImageUrl(asesor.imagen),
      createdAt: asesor.createdAt,
      updatedAt: asesor.updatedAt,
      publishedAt: asesor.publishedAt,
    }));

    // console.log(
    //   `Total de asesores transformados: ${asesoresTransformados.length}`,
    // );
    // console.log("Asesores por sede:");
    const sedes: { [key: string]: number } = {};
    asesoresTransformados.forEach((a) => {
      sedes[a.sede] = (sedes[a.sede] || 0) + 1;
    });
    // console.log(sedes);

    // Transformar los datos
    const transformedData = {
      ...data.data,
      heroImagen: getImageUrl(data.data.heroImagen),
      asesores: asesoresTransformados,
    };

    // console.log(
    //   `Datos finales - Total asesores: ${transformedData.asesores?.length || 0}`,
    // );

    return NextResponse.json(transformedData, {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("Error al obtener datos de nosotros desde Strapi:", error);
    return NextResponse.json(
      { error: "Error al obtener datos de nosotros" },
      { status: 500 },
    );
  }
}
