import { NextResponse } from "next/server";
import qs from "qs";
import { BlogPost } from "@/types";

const STRAPI_URL = "http://localhost:1337/api";
const STRAPI_ORIGIN = "http://localhost:1337";
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || "";

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (STRAPI_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;
  }
  return headers;
}

interface StrapiImagen {
  url?: string;
  formats?: {
    large?: { url?: string };
    medium?: { url?: string };
    small?: { url?: string };
    thumbnail?: { url?: string };
  };
}

interface StrapiBlogPost {
  id: number;
  documentId: string;
  titulo: string;
  slug: string;
  resumen?: string;
  contenido?: string;
  imagen?: StrapiImagen;
  autor?: string;
  fecha?: string;
  tiempoLectura?: string;
  categoria?: string;
  etiquetas?: string;
  destacado?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiBlogPageResponse {
  data: {
    id: number;
    documentId: string;
    heroTitulo: string;
    heroSubtitulo: string;
    heroImagen?: StrapiImagen;
    blog_posts: StrapiBlogPost[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  meta: Record<string, unknown>;
}

function getImageUrl(imagen?: StrapiImagen): string | undefined {
  if (!imagen) return undefined;

  const url =
    imagen.formats?.large?.url ||
    imagen.formats?.medium?.url ||
    imagen.formats?.small?.url ||
    imagen.formats?.thumbnail?.url ||
    imagen.url;

  return url ? `${STRAPI_ORIGIN}${url}` : undefined;
}

function mapBlogPost(post: StrapiBlogPost): BlogPost {
  const authorName = post.autor ?? "Luxviajes";
  return {
    id: post.id,
    documentId: post.documentId,
    title: post.titulo,
    slug: post.slug,
    excerpt: post.resumen ?? "",
    content: post.contenido ?? "",
    image: post.imagen ? getImageUrl(post.imagen) : undefined,
    author: authorName,
    authorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=500088&color=fff`,
    date: post.fecha ?? "",
    readTime: post.tiempoLectura ?? "5 min",
    category: post.categoria ?? "General",
    tags: post.etiquetas
      ? post.etiquetas.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
    featured: post.destacado ?? false,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const query = qs.stringify(
        {
          filters: { slug: { $eq: slug } },
          populate: { imagen: { populate: "*" } },
          pagination: { pageSize: 1 },
        },
        { encodeValuesOnly: true },
      );

      const response = await fetch(`${STRAPI_URL}/blog-posts?${query}`, {
        headers: getHeaders(),
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Strapi responded with status: ${response.status}`);
      }

      const json = await response.json();
      const posts = (json.data ?? []).map(mapBlogPost);

      if (posts.length === 0) {
        return NextResponse.json(
          {
            error: "Post not found",
            message: `No se encontró un post con el slug "${slug}"`,
          },
          { status: 404 },
        );
      }

      return NextResponse.json(posts[0], {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    }

    const query = qs.stringify(
      {
        populate: {
          heroImagen: { populate: "*" },
          blog_posts: {
            populate: {
              imagen: { populate: "*" },
            },
            sort: "fecha:desc",
          },
        },
      },
      { encodeValuesOnly: true },
    );

    const response = await fetch(`${STRAPI_URL}/blog?${query}`, {
      headers: getHeaders(),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Strapi responded with status: ${response.status}`);
    }

    const strapiData: StrapiBlogPageResponse = await response.json();

    const posts = (strapiData.data.blog_posts || []).map(mapBlogPost);

    return NextResponse.json(
      {
        posts,
        heroTitulo: strapiData.data.heroTitulo,
        heroSubtitulo: strapiData.data.heroSubtitulo,
        heroImagen: getImageUrl(strapiData.data.heroImagen),
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
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
