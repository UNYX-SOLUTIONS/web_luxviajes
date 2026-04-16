import { Banner, Home, HomeStats, RedSocial } from "@/types";

const BASE_URL = "http://localhost:1337/api/";

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
  Banner: Array<Omit<Banner, "image"> & { image?: string }>;
  Redes: RedSocial[];
  Stats: HomeStats;
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

function mapHomeDataToHome(homeData: HomeData): Home {
  const banners: Banner[] = (homeData.Banner ?? []).map((banner) => ({
    ...banner,
    image: banner.image ?? "",
  }));

  return {
    id: homeData.id,
    documentId: homeData.documentId,
    createdAt: homeData.createdAt,
    updatedAt: homeData.updatedAt,
    publishedAt: homeData.publishedAt,
    banners,
    redes: homeData.Redes ?? [],
    stats: homeData.Stats ?? null,
  };
}

export async function getHome(): Promise<Home | null> {
  if (!homeCachePromise) {
    homeCachePromise = getHomeData().then((homeData) => {
      if (!homeData) return null;
      return mapHomeDataToHome(homeData);
    });
  }

  return homeCachePromise;
}

export function clearHomeCache(): void {
  homeCachePromise = null;
}
