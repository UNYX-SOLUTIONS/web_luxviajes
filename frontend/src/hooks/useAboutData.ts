import { useState, useEffect } from "react";
import { About } from "@/types";

interface UseAboutDataResult {
  data: About | null;
  loading: boolean;
  error: Error | null;
}

export function useAboutData(): UseAboutDataResult {
  const [data, setData] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAboutData() {
      try {
        setLoading(true);
        const response = await fetch("/api/nosotros");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result: About = await response.json();
        console.log("Data ", result);

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Error al cargar datos de nosotros"),
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAboutData();
  }, []);

  return { data, loading, error };
}
