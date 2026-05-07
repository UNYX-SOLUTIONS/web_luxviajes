import { TopDestinosMes, TarjetaServicio } from "@/types";
import { useEffect, useState } from "react";

interface DestinationsServicesData {
  destinos: TopDestinosMes[];
  servicios: TarjetaServicio[];
}

interface UseDestinationsServicesReturn {
  destinos: TopDestinosMes[];
  servicios: TarjetaServicio[];
  loading: boolean;
  error: Error | null;
}

export function useDestinationsServices(): UseDestinationsServicesReturn {
  const [destinos, setDestinos] = useState<TopDestinosMes[]>([]);
  const [servicios, setServicios] = useState<TarjetaServicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/destinations-services");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: DestinationsServicesData = await response.json();
        // console.log("Destinos y servicios obtenidos:", result);

        if (isMounted) {
          setDestinos(result.destinos || []);
          setServicios(result.servicios || []);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching destinations and services:", err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
          setDestinos([]);
          setServicios([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { destinos, servicios, loading, error };
}
