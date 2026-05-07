import { useState, useEffect } from "react";
import { Paquete } from "@/types";

interface UsePaqueteDataResult {
  data: Paquete | null;
  loading: boolean;
  error: Error | null;
}

export function usePaqueteData(): UsePaqueteDataResult {
  const [data, setData] = useState<Paquete | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPaqueteData() {
      try {
        setLoading(true);
        const response = await fetch("/api/paquete");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result: Paquete = await response.json();
        // console.log("Data paquete:", result);

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Error al cargar datos de paquete"),
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPaqueteData();
  }, []);

  return { data, loading, error };
}
