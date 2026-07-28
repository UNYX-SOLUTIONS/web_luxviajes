import { useState, useEffect, useCallback } from "react";
import { BlogPost } from "@/types";

interface BlogData {
  posts: BlogPost[];
  heroTitulo?: string;
  heroSubtitulo?: string;
  heroImagen?: string;
}

interface UseBlogDataResult {
  data: BlogData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

let cachedData: BlogData | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 0;

export function useBlogData(): UseBlogDataResult {
  const [data, setData] = useState<BlogData | null>(cachedData);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState<Error | null>(null);

  const fetchBlogData = useCallback(async () => {
    const now = Date.now();
    if (cachedData && now - cacheTimestamp < CACHE_DURATION) {
      setData(cachedData);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/blog", {
        headers: {
          "Cache-Control": "no-cache",
        },
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
        if (response.status === 404) {
          throw new Error("The blog endpoint is not available");
        }
        if (response.status === 429) {
          throw new Error(
            "Too many requests. Please wait a moment and try again",
          );
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result: BlogData = await response.json();

      const validatedData: BlogData = {
        posts: Array.isArray(result.posts) ? result.posts : [],
        heroTitulo: result.heroTitulo,
        heroSubtitulo: result.heroSubtitulo,
        heroImagen: result.heroImagen,
      };

      cachedData = validatedData;
      cacheTimestamp = now;

      setData(validatedData);
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error("Unknown error occurred");
      setError(errorObj);
      console.error("Error fetching blog data:", errorObj);

      if (cachedData) {
        setData(cachedData);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogData();
  }, [fetchBlogData]);

  return { data, loading, error, refetch: fetchBlogData };
}