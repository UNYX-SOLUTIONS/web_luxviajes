// hooks/useBlogData.ts
import { useState, useEffect } from "react";

export interface ApiPost {
  documentId?: string;
  id?: string;
  titulo: string;
  slug: string;
  resumen?: string;
  excerpt?: string;
  contenido?: string;
  content?: string;
  imagen?: string;
  image?: string;
  autor?: string;
  author?: string;
  avatar?: string;
  fecha?: string;
  date?: string;
  tiempoLectura?: string;
  readTime?: string;
  categoria?: string;
  category?: string;
  etiquetas?: string[];
  tags?: string[];
  destacado?: boolean;
  featured?: boolean;
}

interface BlogData {
  posts: ApiPost[];
  heroTitulo?: string;
  heroSubtitulo?: string;
  heroImagen?: string;
}

interface UseBlogDataResult {
  data: BlogData | null;
  loading: boolean;
  error: Error | null;
}

export function useBlogData(): UseBlogDataResult {
  const [data, setData] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchBlogData() {
      try {
        setLoading(true);
        const response = await fetch("/api/blog");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        console.error("Error fetching blog data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogData();
  }, []);

  return { data, loading, error };
}