import { NextResponse } from "next/server";

const STRAPI_URL = "https://cms.agencialuxviajes.com/admin/api";

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
    tarjetasServicio?: TarjetaServicioResponse[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export async function GET() {
  try {
    // Realizar petición a Strapi con populate solo de servicios
    const response = await fetch(
      `${STRAPI_URL}/inicio?populate=tarjetasServicio`,
      {
        next: {
          revalidate: 0, // Revalidar cada hora
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch services from Strapi" },
        { status: response.status },
      );
    }

    const data: StrapiInicioResponse = await response.json();
    // console.log("Datos de servicios desde Strapi:", data);

    // Retornar solo servicios
    const servicios = data.data.tarjetasServicio || [];

    return NextResponse.json(servicios, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error in /api/servicios:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
