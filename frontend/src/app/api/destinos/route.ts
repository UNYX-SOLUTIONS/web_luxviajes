import { NextResponse } from "next/server";

const STRAPI_URL = "https://cms.agencialuxviajes.com/api";

interface DestinoSonadoResponse {
  id: number;
  documentId: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  disponibilidad: string;
  duracion: string;
  precio: string;
  descripcionDetallada: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiInicioResponse {
  data: {
    id: number;
    documentId: string;
    destino_sonados?: DestinoSonadoResponse[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export async function GET() {
  try {
    // Realizar petición a Strapi con populate solo de destinos
    const response = await fetch(
      `${STRAPI_URL}/inicio?populate=destino_sonados`,
      {
        next: {
          revalidate: 3600, // Revalidar cada hora
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch destinations from Strapi" },
        { status: response.status },
      );
    }

    const data: StrapiInicioResponse = await response.json();
    console.log("Datos de destinos desde Strapi:", data);

    // Retornar solo destinos
    const destinos = data.data.destino_sonados || [];

    return NextResponse.json(destinos, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error in /api/destinos:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
