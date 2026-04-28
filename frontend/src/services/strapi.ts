import { Banner, Home, StatCard, RedSocial } from "@/types";

// Usar la URL de Strapi desde variables de entorno
const STRAPI_URL = "https://cms.agencialuxviajes.com";
const BASE_URL = `${STRAPI_URL}/api`;
const CMS_ORIGIN = new URL(STRAPI_URL).origin;

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

interface StrapiImage {
  url?: string;
  formats?: {
    large?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    small?: StrapiImageFormat;
    thumbnail?: StrapiImageFormat;
  };
}

interface BannerWithImageData extends Omit<Banner, "image"> {
  image?: StrapiImage | string | null;
}

interface HomeBannerData {
  id: number;
  Banner: BannerWithImageData[];
}

let homeCachePromise: Promise<Home | null> | null = null;

export async function getStrapiData<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(`${BASE_URL}${url}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function getHomeData(): Promise<HomeData | null> {
  const res = await getStrapiData<StrapiResponse<HomeData>>("home?populate=*");
  return res?.data ?? null;
}

export async function getHomeBannerData(): Promise<HomeBannerData | null> {
  const res = await getStrapiData<StrapiResponse<HomeBannerData>>(
    "home?populate[Banner][populate]=image",
  );
  return res?.data ?? null;
}

export async function getBanners(): Promise<Banner[]> {
  const bannerData = await getHomeBannerData();
  return mapBannerDataToBanners(bannerData);
}

function getBannerImageUrl(image?: StrapiImage | string | null): string {
  if (!image) return "";
  if (typeof image === "string") {
    return image.startsWith("http") ? image : `${CMS_ORIGIN}${image}`;
  }

  const imageUrl =
    image.formats?.large?.url ??
    image.formats?.medium?.url ??
    image.formats?.small?.url ??
    image.formats?.thumbnail?.url ??
    image.url ??
    "";

  if (!imageUrl) return "";
  return imageUrl.startsWith("http") ? imageUrl : `${CMS_ORIGIN}${imageUrl}`;
}

function mapBannerDataToBanners(bannerData: HomeBannerData | null): Banner[] {
  return (bannerData?.Banner ?? []).map((banner) => ({
    ...banner,
    image: getBannerImageUrl(banner.image),
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
          mapBannerDataToBanners(homeBannerData),
        );
      },
    );
  }

  return homeCachePromise;
}

export function clearHomeCache(): void {
  homeCachePromise = null;
}
