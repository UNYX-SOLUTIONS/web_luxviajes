import { useState, useEffect } from "react";
import { Servicio } from "@/types";

interface UseServicioDataResult {
  data: Servicio | null;
  loading: boolean;
  error: Error | null;
}

export function useServicioData(): UseServicioDataResult {
  const [data, setData] = useState<Servicio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchServicioData() {
      try {
        setLoading(true);
        const response = await fetch("/api/servicio");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result: Servicio = await response.json();
        console.log("Data servicio:", result);

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Error al cargar datos de servicio"),
        );
      } finally {
        setLoading(false);
      }
    }

    fetchServicioData();
  }, []);

  return { data, loading, error };
}
