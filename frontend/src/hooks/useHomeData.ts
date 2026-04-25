import { Home } from "@/types";
import { useEffect, useState } from "react";

interface UseHomeDataReturn {
  data: Home | null;
  loading: boolean;
  error: Error | null;
}

export function useHomeData(): UseHomeDataReturn {
  const [data, setData] = useState<Home | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchHomeData = async () => {
      try {
        console.log("ENTRANDO:...");
        setLoading(true);
        const response = await fetch("/api/inicio");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Respuesta de /api/inicio:", result);

        // Extraer los datos si vienen envueltos en { data: { ... } }
        const homeData: Home = result.data || result;

        if (isMounted) {
          setData(homeData);
          setError(null);
        }
      } catch (err) {
        console.log(err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
          setData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}
