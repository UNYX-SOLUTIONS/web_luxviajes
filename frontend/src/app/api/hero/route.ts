import { NextResponse } from "next/server";
import { getHeroSection } from "@/services/strapi";

export async function GET() {
  try {
    const hero = await getHeroSection();

    if (!hero) {
      return NextResponse.json(
        { error: "Hero section not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(hero, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error in /api/hero:", error);

    if (
      error instanceof Error &&
      error.message.includes("Authentication failed")
    ) {
      return NextResponse.json(
        {
          error: "Authentication error",
          message:
            "No se pudo autenticar con el CMS de Strapi. Verifique el token de API.",
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}