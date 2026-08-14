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
  creditType?: string;
  installments?: number;
  visaType?: string;
  appointmentDate?: string;
  preferredLocation?: string;
  receivePromotion?: boolean;
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
      let clientIp = "";
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        clientIp = ipData.ip || "";
      } catch {
        // si falla, el backend usa req.ip como respaldo
      }

      const taxRate = 0.15;
      const ROUND = (n: number) => Math.round(n * 100) / 100;

      const baseImp = ROUND(data.amount / (1 + taxRate));
      const iva = ROUND(data.amount - baseImp);

      const payload: Record<string, unknown> = {
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

      if (data.creditType !== undefined) payload.creditType = data.creditType;
      if (data.installments !== undefined) payload.installments = data.installments;
      if (data.visaType !== undefined) payload.visaType = data.visaType;
      if (data.appointmentDate !== undefined) payload.appointmentDate = data.appointmentDate;
      if (data.preferredLocation !== undefined) payload.preferredLocation = data.preferredLocation;
      if (data.receivePromotion !== undefined) payload.receivePromotion = data.receivePromotion;

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
        const query = new URLSearchParams();
        if (data.creditType) query.set("creditType", data.creditType);
        if (data.installments) query.set("installments", String(data.installments));
        const qs = query.toString();
        router.push(`/pago/${result.data.checkoutId}${qs ? `?${qs}` : ""}`);
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
