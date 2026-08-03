import {
  Banner,
  BlogPost,
  BlogPageData,
  ContentBlock,
  HeroSection,
  Home,
  StatCard,
  StrapiImage,
  RedSocial,
} from "@/types";
import { env } from "@/lib/env";

const STRAPI_URL = env.strapiApiUrl;
const BASE_URL = `${STRAPI_URL}`;
const CMS_ORIGIN = new URL(STRAPI_URL).origin;

const STRAPI_TOKEN = env.strapiApiToken;

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (STRAPI_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;
  }
  return headers;
}

interface StrapiResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

interface HomeData {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  Redes: RedSocial[];
  clientesFrecuentes?: string;
  experiencia?: string;
  destinos?: string;
  valoracion?: string;
}

interface StrapiImageFormat {
  url?: string;
}

interface HomeBannerData {
  id: number;
  Banner: Banner[];
}

interface BannerWithImageData extends Omit<Banner, "image"> {
  image?: StrapiImage | string | null;
}

let homeCachePromise: Promise<Home | null> | null = null;

async function strapiFetch<T>(
  url: string,
  init?: RequestInit,
): Promise<T | null> {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      cache: "no-store",
      headers: {
        ...getAuthHeaders(),
        ...init?.headers,
      },
      ...init,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          "Authentication failed: Invalid or expired Strapi token",
        );
      }
      if (response.status === 403) {
        throw new Error(
          "Access forbidden: Check Strapi API token permissions",
        );
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (
      error instanceof TypeError &&
      error.message === "Failed to fetch"
    ) {
      console.error("Strapi is unreachable. Check STRAPI_URL configuration.");
    } else {
      console.error("Error fetching from Strapi:", error);
    }
    return null;
  }
}

function getImageUrl(image?: StrapiImage | string | null): string {
  if (!image) return "";
  if (typeof image === "string") {
    return image.startsWith("http") ? image : `${CMS_ORIGIN}${image}`;
  }

  const url =
    image.formats?.large?.url ??
    image.formats?.medium?.url ??
    image.formats?.small?.url ??
    image.formats?.thumbnail?.url ??
    image.url ??
    "";

  if (!url) return "";
  return url.startsWith("http") ? url : `${CMS_ORIGIN}${url}`;
}

export async function getStrapiData<T>(url: string): Promise<T | null> {
  return strapiFetch<T>(url);
}

export async function getHomeData(): Promise<HomeData | null> {
  const res = await strapiFetch<StrapiResponse<HomeData>>("home?populate=*");
  return res?.data ?? null;
}

export async function getHomeBannerData(): Promise<HomeBannerData | null> {
  const res = await strapiFetch<StrapiResponse<HomeBannerData>>(
    "home?populate[Banner][populate]=image",
  );
  return res?.data ?? null;
}

export async function getBanners(): Promise<Banner[]> {
  const bannerData = await getHomeBannerData();
  return (bannerData?.Banner ?? []).map((banner) => ({
    ...banner,
    image: getImageUrl(banner.image),
  }));
}

function transformStats(homeData: HomeData): StatCard[] {
  return [
    {
      label: "Clientes Frecuentes",
      value: homeData.clientesFrecuentes || "10M+",
    },
    {
      label: "Años de experiencia",
      value: homeData.experiencia || "07+",
    },
    {
      label: "Destinos",
      value: homeData.destinos || "1K",
    },
    {
      label: "Valoración",
      value: homeData.valoracion || "5.0",
    },
  ];
}

function mapHomeDataToHome(homeData: HomeData, banners: Banner[]): Home {
  return {
    id: homeData.id,
    documentId: homeData.documentId,
    createdAt: homeData.createdAt,
    updatedAt: homeData.updatedAt,
    publishedAt: homeData.publishedAt,
    banners,
    redes: homeData.Redes?.[0],
    stats: transformStats(homeData),
  };
}

export async function getHome(): Promise<Home | null> {
  if (!homeCachePromise) {
    homeCachePromise = Promise.all([getHomeData(), getHomeBannerData()]).then(
      ([homeData, homeBannerData]) => {
        if (!homeData) return null;
        return mapHomeDataToHome(
          homeData,
          (homeBannerData?.Banner ?? []).map((b) => ({
            ...b,
            image: getImageUrl(b.image),
          })),
        );
      },
    );
  }

  return homeCachePromise;
}

export function clearHomeCache(): void {
  homeCachePromise = null;
}

// ─── Blog Functions ──────────────────────────────────────

interface StrapiBlogPost {
  id: number;
  documentId: string;
  titulo: string;
  slug: string;
  resumen?: string;
  contenido?: string;
  imagen?: StrapiImage | string | null;
  autor?: string;
  fecha?: string;
  tiempoLectura?: string;
  categoria?: string;
  etiquetas?: string[];
  destacado?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

function mapStrapiPostToBlogPost(post: StrapiBlogPost): BlogPost {
  const authorName = post.autor ?? "Luxviajes";
  return {
    id: post.id,
    documentId: post.documentId,
    title: post.titulo,
    slug: post.slug,
    excerpt: post.resumen ?? "",
    content: (post.contenido as unknown as ContentBlock[]) ?? [],
    image: post.imagen ? getImageUrl(post.imagen as StrapiImage) : "",
    author: authorName,
    authorAvatar: `https://ui-avatars.com/api/?name=${authorName.replace(" ", "+")}&background=500088&color=fff`,
    date: post.fecha ?? "",
    readTime: post.tiempoLectura ?? "5 min",
    category: post.categoria ?? "General",
    tags: post.etiquetas ?? [],
    featured: post.destacado ?? false,
  };
}

export async function getBlogPosts(
  limit = 50,
): Promise<BlogPost[]> {
  const query = `blog-posts?populate[imagen][populate]=*&sort[fecha]=desc&pagination[pageSize]=${Math.min(limit, 100)}`;
  const res = await strapiFetch<StrapiResponse<StrapiBlogPost[]>>(query);
  if (!res?.data) return [];

  return res.data.map(mapStrapiPostToBlogPost);
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  const query = `blog-posts?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[imagen][populate]=*&pagination[pageSize]=1`;
  const res = await strapiFetch<StrapiResponse<StrapiBlogPost[]>>(query);
  if (!res?.data?.[0]) return null;

  return mapStrapiPostToBlogPost(res.data[0]);
}

export async function getBlogPage(): Promise<BlogPageData | null> {
  const query = `blog?populate[heroImagen][populate]=*`;
  const res = await strapiFetch<StrapiResponse<BlogPageData>>(query);
  if (!res?.data) return null;

  const data = res.data;
  return {
    ...data,
    heroImagen: data.heroImagen
      ? getImageUrl(data.heroImagen as unknown as StrapiImage)
      : undefined,
  };
}

// ─── Hero Section Functions ──────────────────────────────

export async function getHeroSection(): Promise<HeroSection | null> {
  const blogPage = await getBlogPage();

  if (!blogPage) return null;

  return {
    heroTitulo: blogPage.heroTitulo ?? "",
    heroSubtitulo: blogPage.heroSubtitulo ?? "",
    heroImagen: blogPage.heroImagen,
  };
}