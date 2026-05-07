import { useState, useEffect } from "react";
import { Help } from "@/types";

interface UseHelpDataResult {
  data: Help | null;
  loading: boolean;
  error: Error | null;
}

export function useHelpData(): UseHelpDataResult {
  const [data, setData] = useState<Help | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchHelpData() {
      try {
        setLoading(true);
        const response = await fetch("/api/ayuda");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result: Help = await response.json();
        // console.log("Help Data:", result);

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Error al cargar datos de ayuda"),
        );
      } finally {
        setLoading(false);
      }
    }

    fetchHelpData();
  }, []);

  return { data, loading, error };
}
