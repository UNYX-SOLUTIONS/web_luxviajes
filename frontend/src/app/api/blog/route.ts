import { NextResponse } from "next/server";
import qs from "qs";

const STRAPI_URL = "https://cms.agencialuxviajes.com/api";
const STRAPI_ORIGIN = "https://cms.agencialuxviajes.com";

interface StrapiImagen {
  formats?: {
    large?: { url?: string };
    medium?: { url?: string };
    small?: { url?: string };
    thumbnail?: { url?: string };
  };
  url?: string;
}

interface StrapiPost {
  id: number;
  documentId: string;
  titulo: string;
  slug: string;
  resumen?: string;
  contenido?: string;
  autor?: string;
  avatar?: string;
  fecha?: string;
  tiempoLectura?: string;
  categoria?: string;
  etiquetas?: string[];
  destacado?: boolean;
  imagen?: StrapiImagen;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiBlogPageResponse {
  data: {
    id: number;
    documentId: string;
    heroTitulo?: string;
    heroSubtitulo?: string;
    heroImagen?: StrapiImagen;
    posts?: StrapiPost[];
  };
}

interface StrapiPostsListResponse {
  data: StrapiPost[];
}

function getImageUrl(imagen?: StrapiImagen): string {
  if (!imagen) return "";

  const url =
    imagen.formats?.large?.url ??
    imagen.formats?.medium?.url ??
    imagen.formats?.small?.url ??
    imagen.formats?.thumbnail?.url ??
    imagen.url ??
    "";

  if (!url) return "";
  return url.startsWith("http") ? url : `${STRAPI_ORIGIN}${url}`;
}

export async function GET() {
  try {
    // Intentar obtener la página del blog (si existe como single type)
    let heroTitulo: string | undefined;
    let heroSubtitulo: string | undefined;
    let heroImagen: string | undefined;

    try {
      const blogPageQuery = qs.stringify(
        { populate: { heroImagen: { populate: "*" } } },
        { encodeValuesOnly: true },
      );
      const blogPageRes = await fetch(`${STRAPI_URL}/blog?${blogPageQuery}`, {
        next: { revalidate: 60 },
      });
      if (blogPageRes.ok) {
        const blogPageData: StrapiBlogPageResponse = await blogPageRes.json();
        heroTitulo = blogPageData.data?.heroTitulo;
        heroSubtitulo = blogPageData.data?.heroSubtitulo;
        heroImagen = getImageUrl(blogPageData.data?.heroImagen);
      }
    } catch {
      // El single type no existe, continuamos con sólo los posts
    }

    // Obtener los posts (collection type)
    const postsQuery = qs.stringify(
      {
        populate: { imagen: { populate: "*" } },
        sort: ["fecha:desc", "createdAt:desc"],
        pagination: { pageSize: 50 },
      },
      { encodeValuesOnly: true },
    );

    const postsRes = await fetch(`${STRAPI_URL}/blog-posts?${postsQuery}`, {
      next: { revalidate: 60 },
    });

    // Si la colección aún no existe en Strapi (404) o hay otro error,
    // devolvemos posts vacío para que el frontend no se rompa.
    if (!postsRes.ok) {
      console.warn(
        `[api/blog] Strapi respondió con ${postsRes.status}. ¿La colección "blog-posts" existe en el CMS?`,
      );
      return NextResponse.json(
        { posts: [], heroTitulo, heroSubtitulo, heroImagen },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    const postsData: StrapiPostsListResponse = await postsRes.json();

    const posts = (postsData.data || []).map((post) => ({
      id: post.id,
      documentId: post.documentId,
      titulo: post.titulo,
      slug: post.slug,
      resumen: post.resumen ?? "",
      contenido: post.contenido ?? "",
      autor: post.autor ?? "Luxviajes",
      avatar: post.avatar ?? "",
      fecha: post.fecha ?? post.createdAt,
      tiempoLectura: post.tiempoLectura ?? "5 min",
      categoria: post.categoria ?? "General",
      etiquetas: post.etiquetas ?? [],
      destacado: post.destacado ?? false,
      imagen: getImageUrl(post.imagen),
    }));

    return NextResponse.json(
      { posts, heroTitulo, heroSubtitulo, heroImagen },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("Error al obtener datos del blog desde Strapi:", error);
    return NextResponse.json(
      { error: "Error al obtener datos del blog", posts: [] },
      { status: 500 },
    );
  }
}
