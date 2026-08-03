import { NextResponse } from "next/server";
import qs from "qs";

interface StrapiFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path?: string | null;
  width: number;
  height: number;
  size: number;
  url: string;
}

const STRAPI_URL = "http://localhost:1337/api";
const STRAPI_ORIGIN = "http://localhost:1337";

interface StrapiPDF {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  formats?: Record<string, StrapiFormat> | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string | null;
  provider: string;
  provider_metadata?: unknown | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface PreguntaFrecuente {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiAyudaResponse {
  data: {
    id: number;
    documentId: string;
    pdfPoliticasVisas?: StrapiPDF;
    pdfPoliticasViaje?: StrapiPDF;
    pdfPoliticasPrivacidad?: StrapiPDF;
    pdfPoliticasUsoWeb?: StrapiPDF;
    preguntas_frecuentas?: PreguntaFrecuente[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

/**
 * Extrae la URL completa de un PDF de Strapi
 */
function getPdfUrl(pdf?: StrapiPDF): string {
  if (!pdf?.url) return "";
  return `${STRAPI_ORIGIN}${pdf.url}`;
}

export async function GET() {
  try {
    // Construir query con populate para los PDFs y preguntas frecuentes
    const query = qs.stringify(
      {
        populate: {
          pdfPoliticasVisas: {
            populate: "*",
          },
          pdfPoliticasViaje: {
            populate: "*",
          },
          pdfPoliticasPrivacidad: {
            populate: "*",
          },
          pdfPoliticasUsoWeb: {
            populate: "*",
          },
          preguntas_frecuentas: {
            populate: "*",
          },
        },
      },
      { encodeValuesOnly: true },
    );

    // console.log("Query generada:", query);
    // console.log("URL completa:", `${STRAPI_URL}/ayuda?${query}`);

    const response = await fetch(`${STRAPI_URL}/ayuda?${query}`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 }, // Revalidar cada hora
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Error en respuesta de Strapi (${response.status}):`,
        errorText,
      );
      return NextResponse.json(
        { error: "Error al obtener datos de ayuda" },
        { status: response.status },
      );
    }

    const data: StrapiAyudaResponse = await response.json();
    // console.log("Respuesta de Strapi:", JSON.stringify(data, null, 2));

    if (!data.data) {
      return NextResponse.json(
        { error: "No se encontraron datos de ayuda" },
        { status: 404 },
      );
    }

    // Transformar la respuesta al formato esperado por el frontend
    const transformedData = {
      id: data.data.id,
      documentId: data.data.documentId,
      pdfPoliticasVisas: getPdfUrl(data.data.pdfPoliticasVisas),
      pdfPoliticasViaje: getPdfUrl(data.data.pdfPoliticasViaje),
      pdfPoliticasPrivacidad: getPdfUrl(data.data.pdfPoliticasPrivacidad),
      pdfPoliticasUsoWeb: getPdfUrl(data.data.pdfPoliticasUsoWeb),
      preguntasFrecuentes: (data.data.preguntas_frecuentas || []).map(
        (pregunta) => ({
          id: pregunta.id,
          documentId: pregunta.documentId,
          titulo: pregunta.titulo,
          descripcion: pregunta.descripcion,
          createdAt: pregunta.createdAt,
          updatedAt: pregunta.updatedAt,
          publishedAt: pregunta.publishedAt,
        }),
      ),
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
    console.error("Error en /api/ayuda:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 500 },
    );
  }
}
