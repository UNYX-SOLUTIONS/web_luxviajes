import { TopDestinosMes } from "@/types";
import { useEffect, useState } from "react";

interface UseDestinosReturn {
  destinos: TopDestinosMes[];
  loading: boolean;
  error: Error | null;
}

export function useDestinos(): UseDestinosReturn {
  const [destinos, setDestinos] = useState<TopDestinosMes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDestinos = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/destinos");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: TopDestinosMes[] = await response.json();
        // console.log("Destinos obtenidos:", result);

        if (isMounted) {
          setDestinos(result);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching destinos:", err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
          setDestinos([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDestinos();

    return () => {
      isMounted = false;
    };
  }, []);

  return { destinos, loading, error };
}
