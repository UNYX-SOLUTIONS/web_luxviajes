import { NextResponse } from "next/server";

const STRAPI_URL = "https://cms.agencialuxviajes.com/api";
const STRAPI_ORIGIN = "https://cms.agencialuxviajes.com";

interface Banner {
  id: number;
  titulo: string;
  subtitulo: string;
  imagen?: {
    formats?: {
      large?: {
        url?: string;
      };
    };
    url?: string;
  };
}

interface StrapiInitioResponse {
  data: {
    id: number;
    documentId: string;
    banners?: Banner[];
    clientesFrecuentes?: string;
    experiencia?: string;
    destinos?: string;
    valoracion?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    [key: string]: unknown;
  };
}

interface StatCardData {
  label: string;
  value: string;
}

function transformBanners(banners: Banner[]) {
  return banners.map((banner) => {
    let imageUrl = "";
    if (banner.imagen?.formats?.large?.url) {
      imageUrl = banner.imagen.formats.large.url.startsWith("http")
        ? banner.imagen.formats.large.url
        : `${STRAPI_ORIGIN}${banner.imagen.formats.large.url}`;
    }
    return {
      id: banner.id,
      title: banner.titulo,
      subtitle: banner.subtitulo,
      image: imageUrl,
    };
  });
}

function transformStats(data: StrapiInitioResponse["data"]): StatCardData[] {
  return [
    {
      label: "Clientes Frecuentes",
      value: data.clientesFrecuentes || "10M+",
    },
    {
      label: "Años de experiencia",
      value: data.experiencia || "07+",
    },
    {
      label: "Destinos",
      value: data.destinos || "1K",
    },
    {
      label: "Valoración",
      value: data.valoracion || "5.0",
    },
  ];
}

export async function GET() {
  try {
    const response = await fetch(
      `${STRAPI_URL}/inicio?populate[banners][populate]=*`,
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch inicio data from Strapi" },
        { status: response.status },
      );
    }

    const data: StrapiInitioResponse = await response.json();
    console.log("Datos de /inicio desde Strapi:", data);

    // Transformar los datos
    const transformedData = {
      ...data.data,
      banners: transformBanners(data.data.banners || []),
      stats: transformStats(data.data),
    };

    return NextResponse.json(transformedData, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error in /api/inicio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
