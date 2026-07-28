import { NextResponse } from "next/server";
import qs from "qs";

const STRAPI_URL = "http://localhost:1337/api";
const STRAPI_ORIGIN = "http://localhost:1337";

interface Banner {
  id: number;
  titulo: string;
  subtitulo: string;
  imagen?: {
    formats?: {
      large?: {
        url?: string;
      };
      medium?: {
        url?: string;
      };
      small?: {
        url?: string;
      };
    };
    url?: string;
  };
}

interface TopDestinosMes {
  id: number;
  documentId: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  disponibilidad: string;
  duracion: string;
  precio: string;
  descripcionDetallada: string;
  imagen?: {
    formats?: {
      large?: { url?: string };
      medium?: { url?: string };
      small?: { url?: string };
    };
    url?: string;
  };
  pdf?: {
    url?: string;
    name?: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface TarjetaServicio {
  id: number;
  documentId: string;
  titulo: string;
  subtitulo: string;
  imagen?: {
    formats?: {
      large?: { url?: string };
      medium?: { url?: string };
      small?: { url?: string };
    };
    url?: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiInitioResponse {
  data: {
    id: number;
    documentId: string;
    banners?: Banner[];
    topDestinosMes?: TopDestinosMes[];
    tarjetasServicio?: TarjetaServicio[];
    clientesFrecuentes?: string;
    experiencia?: string;
    destinos?: string;
    valoracion?: string;
    serviciosTitulo?: string;
    serviciosDescripcion?: string;
    citaTitulo?: string;
    citaSubtitulo?: string;
    citaUrgencia?: string;
    llamadaTitulo?: string;
    llamadaSubtitulo?: string;
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
    if (!imageUrl && banner.imagen?.formats?.medium?.url) {
      imageUrl = banner.imagen.formats.medium.url.startsWith("http")
        ? banner.imagen.formats.medium.url
        : `${STRAPI_ORIGIN}${banner.imagen.formats.medium.url}`;
    }
    if (!imageUrl && banner.imagen?.formats?.small?.url) {
      imageUrl = banner.imagen.formats.small.url.startsWith("http")
        ? banner.imagen.formats.small.url
        : `${STRAPI_ORIGIN}${banner.imagen.formats.small.url}`;
    }
    if (!imageUrl && banner.imagen?.url) {
      imageUrl = banner.imagen.url.startsWith("http")
        ? banner.imagen.url
        : `${STRAPI_ORIGIN}${banner.imagen.url}`;
    }
    return {
      id: banner.id,
      title: banner.titulo,
      subtitle: banner.subtitulo,
      image: imageUrl,
    };
  });
}

function getImageUrl(
  imagen?: TopDestinosMes["imagen"] | TarjetaServicio["imagen"],
): string {
  if (!imagen) return "";

  const url =
    imagen.formats?.large?.url ||
    imagen.formats?.medium?.url ||
    imagen.formats?.small?.url ||
    imagen.url ||
    "";

  if (!url) return "";
  return url.startsWith("http") ? url : `${STRAPI_ORIGIN}${url}`;
}

function getPdfUrl(pdf?: TopDestinosMes["pdf"]): string {
  if (!pdf?.url) return "";
  return pdf.url.startsWith("http") ? pdf.url : `${STRAPI_ORIGIN}${pdf.url}`;
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
    // Construir query con populate anidado para incluir campos media (imagen, pdf)
    // populate=* solo pobla 1 nivel, necesitamos poblar explícitamente los campos media
    // dentro de cada relación (nivel 2)
    const query = qs.stringify(
      {
        populate: {
          banners: {
            populate: ["imagen"], // Poblar imagen dentro de banners
          },
          topDestinosMes: {
            populate: ["imagen", "pdf"], // Poblar imagen y pdf dentro de destinos
          },
          tarjetasServicio: {
            populate: ["imagen"], // Poblar imagen dentro de servicios
          },
        },
      },
      { encodeValuesOnly: true },
    );

    const response = await fetch(`${STRAPI_URL}/inicio?${query}`);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch inicio data from Strapi" },
        { status: response.status },
      );
    }

    const data: StrapiInitioResponse = await response.json();
    // console.log(
    //   "Datos de /inicio desde Strapi:",
    //   JSON.stringify(data, null, 2),
    // );

    // Transformar destinos agregando URLs completas de imágenes y PDFs
    const destinosTransformados = (data.data.topDestinosMes || []).map(
      (destino) => ({
        ...destino,
        imagen: getImageUrl(destino.imagen),
        pdf: getPdfUrl(destino.pdf),
      }),
    );

    // Transformar servicios agregando URLs completas de imágenes
    const serviciosTransformados = (data.data.tarjetasServicio || []).map(
      (servicio) => ({
        ...servicio,
        imagen: getImageUrl(servicio.imagen),
      }),
    );

    // Transformar los datos
    const transformedData = {
      ...data.data,
      banners: transformBanners(data.data.banners || []),
      stats: transformStats(data.data),
      destinos: destinosTransformados,
      servicios: serviciosTransformados,
      serviciosTitulo: data.data.serviciosTitulo,
      serviciosDescripcion: data.data.serviciosDescripcion,
      citaTitulo: data.data.citaTitulo,
      citaSubtitulo: data.data.citaSubtitulo,
      citaUrgencia: data.data.citaUrgencia,
      llamadaTitulo: data.data.llamadaTitulo,
      llamadaSubtitulo: data.data.llamadaSubtitulo,
    };

    return NextResponse.json(transformedData, {
      headers: {
        "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
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
