import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreateCheckoutRequest {
  amount: number;
  service: {
    id: string | number;
    name: string;
    type: string;
    validity?: string;
    processing?: string;
  };
  customer: {
    givenName: string;
    middleName?: string;
    surname: string;
    email: string;
    merchantCustomerId: string;
    identificationDocId: string;
    phone: string;
  };
  billing: {
    street1: string;
    country: string;
  };
}

interface CreateCheckoutResponse {
  success: boolean;
  data?: {
    checkoutId: string;
    transactionId: string;
    merchantTransactionId: string;
  };
  error?: string;
}

export function useDatafastPayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const createCheckout = async (data: CreateCheckoutRequest): Promise<CreateCheckoutResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      let clientIp = "127.0.0.1";
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        clientIp = ipData.ip || "127.0.0.1";
      } catch {
        // usar localhost si falla
      }

      const taxRate = 0.15;
      const ROUND = (n: number) => Math.round(n * 100) / 100;

      const baseImp = ROUND(data.amount / (1 + taxRate));
      const iva = ROUND(data.amount - baseImp);

      const payload = {
        amount: ROUND(data.amount),
        customer: {
          ...data.customer,
          ip: clientIp,
          identificationDocType: "IDCARD",
        },
        billing: data.billing,
        taxes: {
          base0: 0,
          baseImp,
          iva,
        },
        items: [
          {
            name: data.service.name,
            description: data.service.type,
            price: baseImp,
            quantity: 1,
          },
        ],
      };

      const response = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.errors?.[0]?.constraints || "Error al crear el checkout");
      }

      if (result.success && result.data?.checkoutId) {
        router.push(`/pago/${result.data.checkoutId}`);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { createCheckout, isLoading, error };
}
