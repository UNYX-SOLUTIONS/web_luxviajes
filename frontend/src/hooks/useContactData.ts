import { useState, useEffect } from "react";
import { Contact } from "@/types";

interface UseContactDataResult {
  data: Contact | null;
  loading: boolean;
  error: Error | null;
}

export function useContactData(): UseContactDataResult {
  const [data, setData] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchContactData() {
      try {
        setLoading(true);
        const response = await fetch("/api/contacto");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result: Contact = await response.json();
        console.log("Contact Data:", result);

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Error al cargar datos de contacto"),
        );
      } finally {
        setLoading(false);
      }
    }

    fetchContactData();
  }, []);

  return { data, loading, error };
}
