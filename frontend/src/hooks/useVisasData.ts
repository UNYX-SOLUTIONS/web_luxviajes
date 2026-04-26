import { useState, useEffect } from "react";
import { VisasPage } from "@/types";

interface UseVisasDataResult {
  data: VisasPage | null;
  loading: boolean;
  error: Error | null;
}

export function useVisasData(): UseVisasDataResult {
  const [data, setData] = useState<VisasPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchVisasData() {
      try {
        setLoading(true);
        const response = await fetch("/api/visa");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result: VisasPage = await response.json();
        console.log("Data visas page:", result);

        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        console.error("Error fetching visas:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchVisasData();
  }, []);

  return { data, loading, error };
}
