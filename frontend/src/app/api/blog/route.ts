import { NextResponse } from "next/server";
import {
  getBlogPosts,
  getBlogPostBySlug,
  getBlogPage,
} from "@/services/strapi";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const post = await getBlogPostBySlug(slug);

      if (!post) {
        return NextResponse.json(
          {
            error: "Post not found",
            message: `No se encontró un post con el slug "${slug}"`,
          },
          { status: 404 },
        );
      }

      return NextResponse.json(post, {
        headers: { "Cache-Control": "no-store" },
      });
    }

    const posts = await getBlogPosts(50);

    const blogPage = await getBlogPage();

    return NextResponse.json(
      {
        posts,
        heroTitulo: blogPage?.heroTitulo,
        heroSubtitulo: blogPage?.heroSubtitulo,
        heroImagen: blogPage?.heroImagen,
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("Error in /api/blog:", error);

    const message =
      error instanceof Error ? error.message : "Error desconocido";

    if (message.includes("Authentication failed")) {
      return NextResponse.json(
        {
          error: "Authentication error",
          message:
            "No se pudo autenticar con el CMS de Strapi. Verifique el token de API.",
        },
        { status: 401 },
      );
    }

    if (message.includes("Access forbidden")) {
      return NextResponse.json(
        {
          error: "Access forbidden",
          message:
            "El token de API no tiene permisos para acceder a los contenidos de blog.",
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        error: "Error al obtener datos del blog",
        message,
        posts: [],
      },
      { status: 500 },
    );
  }
}