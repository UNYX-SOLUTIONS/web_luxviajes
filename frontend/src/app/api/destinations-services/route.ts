import { NextResponse } from "next/server";

const STRAPI_URL = "https://cms.agencialuxviajes.com/admin/api";

interface TopDestinosMesResponse {
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

interface TarjetaServicioResponse {
  id: number;
  documentId: string;
  titulo: string;
  subtitulo: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiInicioResponse {
  data: {
    id: number;
    documentId: string;
    topDestinosMes?: TopDestinosMesResponse[];
    tarjetasServicio?: TarjetaServicioResponse[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export async function GET() {
  try {
    // Realizar petición a Strapi con populate solo de destinos y servicios
    const response = await fetch(
      `${STRAPI_URL}/inicio?populate[topDestinosMes]=*&populate[tarjetasServicio]=*`,
      {
        next: {
          revalidate: 0, // Revalidar cada hora
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch destinations and services from Strapi" },
        { status: response.status },
      );
    }

    const data: StrapiInicioResponse = await response.json();
    // console.log("Datos de destinos y servicios desde Strapi:", data);

    // Transformar y retornar solo destinos y servicios
    const transformedData = {
      destinos: data.data.topDestinosMes || [],
      servicios: data.data.tarjetasServicio || [],
    };

    return NextResponse.json(transformedData, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error in /api/destinations-services:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
