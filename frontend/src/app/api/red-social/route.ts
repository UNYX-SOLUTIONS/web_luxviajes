import { NextResponse } from "next/server";

const STRAPI_URL = "http://localhost:1337/api";

interface StrapiRedSocialResponse {
  data: {
    id: number;
    documentId: string;
    llamada: string;
    whatsapp: string;
    instagram: string;
    facebook: string;
    tiktok: string;
    youtube: string;
    email_trabajos: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  meta: Record<string, unknown>;
}

export async function GET() {
  try {
    const response = await fetch(`${STRAPI_URL}/red-social`);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch red-social data from Strapi" },
        { status: response.status },
      );
    }

    const data: StrapiRedSocialResponse = await response.json();
    // console.log(
    //   "Datos de /red-social desde Strapi:",
    //   JSON.stringify(data, null, 2),
    // );

    // Retornar solo el data sin el wrapper
    return NextResponse.json(data.data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error in /api/red-social:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
