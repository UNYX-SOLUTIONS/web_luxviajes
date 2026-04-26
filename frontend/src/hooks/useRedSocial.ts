import { useState, useEffect } from "react";
import type { RedSocial } from "@/types";

interface UseRedSocialResult {
  data: RedSocial | null;
  loading: boolean;
  error: string | null;
}

export function useRedSocial(): UseRedSocialResult {
  const [data, setData] = useState<RedSocial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRedSocial = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/red-social");

        if (!response.ok) {
          throw new Error("Failed to fetch red-social data");
        }

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        console.error("Error fetching red-social:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRedSocial();
  }, []);

  return { data, loading, error };
}
