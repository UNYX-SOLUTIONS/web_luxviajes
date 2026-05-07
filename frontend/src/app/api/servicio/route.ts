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

interface TarjetaServicio {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
  imagen?: StrapiImagen;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface Testimonio {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
  calificacion?: number;
  imagen?: StrapiImagen;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiServicioResponse {
  data: {
    id: number;
    documentId: string;
    heroTitulo?: string;
    heroSubtitulo?: string;
    serviciosTitulo?: string;
    serviciosDescripcion?: string;
    imagen?: StrapiImagen;
    tarjeta_servicios?: TarjetaServicio[];
    testimonios?: Testimonio[];
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

  // Priorizar small para thumbnails
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
    // Construir query con populate para imagen, tarjetas de servicio y testimonios
    const query = qs.stringify(
      {
        populate: {
          imagen: {
            populate: "*",
          },
          tarjeta_servicios: {
            populate: {
              imagen: {
                populate: "*",
              },
            },
          },
          testimonios: {
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

    // console.log("Query generada para servicio:", query);
    // console.log("URL completa:", `${STRAPI_URL}/servicio?${query}`);

    const response = await fetch(`${STRAPI_URL}/servicio?${query}`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // Revalidar cada hora
    });

    if (!response.ok) {
      throw new Error(`Strapi respondió con estado ${response.status}`);
    }

    const data: StrapiServicioResponse = await response.json();

    // console.log(
    //   "Respuesta completa de Strapi servicio:",
    //   JSON.stringify(data, null, 2),
    // );
    // // console.log(
    //   `Total de tarjetas de servicio: ${data.data.tarjeta_servicios?.length || 0}`,
    // );
    // console.log(`Total de testimonios: ${data.data.testimonios?.length || 0}`);

    // Transformar tarjetas de servicio con sus imágenes
    const tarjetasTransformadas = (data.data.tarjeta_servicios || []).map(
      (tarjeta) => ({
        id: tarjeta.id,
        documentId: tarjeta.documentId,
        titulo: tarjeta.titulo,
        descripcion: tarjeta.descripcion,
        imagen: getImageUrl(tarjeta.imagen),
        createdAt: tarjeta.createdAt,
        updatedAt: tarjeta.updatedAt,
        publishedAt: tarjeta.publishedAt,
      }),
    );

    // Transformar testimonios con sus imágenes
    const testimoniosTransformados = (data.data.testimonios || []).map(
      (testimonio) => ({
        id: testimonio.id,
        documentId: testimonio.documentId,
        titulo: testimonio.titulo,
        descripcion: testimonio.descripcion,
        calificacion: testimonio.calificacion,
        imagen: getSmallImageUrl(testimonio.imagen),
        createdAt: testimonio.createdAt,
        updatedAt: testimonio.updatedAt,
        publishedAt: testimonio.publishedAt,
      }),
    );

    // console.log(`Tarjetas transformadas: ${tarjetasTransformadas.length}`);
    // console.log(
    //   `Testimonios transformados: ${testimoniosTransformados.length}`,
    // );

    // Transformar los datos
    const transformedData = {
      ...data.data,
      imagen: getImageUrl(data.data.imagen),
      tarjeta_servicios: tarjetasTransformadas,
      testimonios: testimoniosTransformados,
    };

    // console.log(
    //   `Datos finales - Tarjetas: ${transformedData.tarjeta_servicios?.length || 0}, Testimonios: ${transformedData.testimonios?.length || 0}`,
    // );

    return NextResponse.json(transformedData, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error al obtener datos de servicio desde Strapi:", error);
    return NextResponse.json(
      { error: "Error al obtener datos de servicio" },
      { status: 500 },
    );
  }
}
