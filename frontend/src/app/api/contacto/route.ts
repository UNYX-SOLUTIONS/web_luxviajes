import { NextResponse } from "next/server";
import qs from "qs";

const STRAPI_URL = "https://cms.agencialuxviajes.com/api";
const STRAPI_ORIGIN = "https://cms.agencialuxviajes.com";

interface StrapiImagen {
  formats?: {
    large?: { url?: string };
    medium?: { url?: string };
    small?: { url?: string };
    thumbnail?: { url?: string };
  };
  url?: string;
}

interface Direccion {
  id: number;
  documentId: string;
  ciudad: string;
  direccion: string;
  url: string;
  imagen?: StrapiImagen;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiContactoResponse {
  data: {
    id: number;
    documentId: string;
    heroTitulo?: string;
    heroSubtitulo?: string;
    heroImagen?: StrapiImagen;
    direcciones?: Direccion[];
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
 * Prioridad: small > medium > url (para imágenes de tarjetas)
 */
function getSmallImageUrl(imagen?: StrapiImagen): string {
  if (!imagen) return "";

  // Priorizar small para imágenes de direcciones
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
    // Construir query con populate para direcciones e imágenes
    const query = qs.stringify(
      {
        populate: {
          heroImagen: {
            populate: "*",
          },
          direcciones: {
            populate: {
              imagen: {
                populate: "*",
              },
            },
          },
        },
        "pagination[direcciones][pageSize]": 100,
      },
      { encodeValuesOnly: true },
    );

    // console.log("Query generada:", query);
    // console.log("URL completa:", `${STRAPI_URL}/contacto?${query}`);

    const response = await fetch(`${STRAPI_URL}/contacto?${query}`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // Revalidar cada hora
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Error en respuesta de Strapi (${response.status}):`,
        errorText,
      );
      return NextResponse.json(
        { error: "Error al obtener datos de contacto" },
        { status: response.status },
      );
    }

    const data: StrapiContactoResponse = await response.json();
    // console.log("Respuesta de Strapi:", JSON.stringify(data, null, 2));

    if (!data.data) {
      return NextResponse.json(
        { error: "No se encontraron datos de contacto" },
        { status: 404 },
      );
    }

    // Transformar la respuesta al formato esperado por el frontend
    const transformedData = {
      id: data.data.id,
      documentId: data.data.documentId,
      heroTitulo: data.data.heroTitulo || "",
      heroSubtitulo: data.data.heroSubtitulo || "",
      heroImagen: getImageUrl(data.data.heroImagen),
      direcciones: (data.data.direcciones || []).map((dir) => ({
        id: dir.id,
        documentId: dir.documentId,
        ciudad: dir.ciudad,
        direccion: dir.direccion,
        url: dir.url,
        imagen: getSmallImageUrl(dir.imagen),
        createdAt: dir.createdAt,
        updatedAt: dir.updatedAt,
        publishedAt: dir.publishedAt,
      })),
      createdAt: data.data.createdAt,
      updatedAt: data.data.updatedAt,
      publishedAt: data.data.publishedAt,
    };

    // console.log(
    //   "Datos transformados:",
    //   JSON.stringify(transformedData, null, 2),
    // );

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Error en /api/contacto:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 500 },
    );
  }
}
