import { TarjetaServicio } from "@/types";
import { useEffect, useState } from "react";

interface UseServiciosReturn {
  servicios: TarjetaServicio[];
  loading: boolean;
  error: Error | null;
}

export function useServicios(): UseServiciosReturn {
  const [servicios, setServicios] = useState<TarjetaServicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchServicios = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/servicios");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: TarjetaServicio[] = await response.json();
        console.log("Servicios obtenidos:", result);

        if (isMounted) {
          setServicios(result);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching servicios:", err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
          setServicios([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchServicios();

    return () => {
      isMounted = false;
    };
  }, []);

  return { servicios, loading, error };
}
