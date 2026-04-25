import { getHome } from "@/services/strapi";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const homeData = await getHome();

    if (!homeData) {
      return NextResponse.json(
        { error: "Failed to fetch home data" },
        { status: 500 },
      );
    }

    return NextResponse.json(homeData, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error in /api/home:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
