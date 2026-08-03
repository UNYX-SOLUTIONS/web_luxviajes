import { useState, useCallback } from "react";
import { useDatafastPayment } from "./useDatafastPayment";

interface ServiceData {
  id: number;
  documentId: string;
  name: string;
  type: string;
  price: number;
  validity?: string;
  processing?: string;
  includes?: string[];
}

export interface CustomerFormData {
  givenName: string;
  middleName?: string;
  surname: string;
  email: string;
  phone: string;
  identificationDocId: string;
}

export const usePurchaseDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentService, setCurrentService] = useState<ServiceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { createCheckout, isLoading: datafastLoading } = useDatafastPayment();

  const openDialog = useCallback((service: ServiceData) => {
    setCurrentService(service);
    setError(null);
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    if (!isLoading && !datafastLoading) {
      setIsOpen(false);
      setError(null);
      setTimeout(() => setCurrentService(null), 300);
    }
  }, [isLoading, datafastLoading]);

  const handlePay = useCallback(
    async (customerData: CustomerFormData) => {
      if (!currentService) {
        setError("No hay servicio seleccionado");
        return;
      }

      if (customerData.identificationDocId.length !== 10) {
        setError("La cédula debe tener 10 dígitos");
        return;
      }

      setError(null);
      setIsLoading(true);

      try {
        const total = currentService.price * 1.15;

        const result = await createCheckout({
          amount: total,
          service: {
            id: currentService.id,
            name: currentService.name,
            type: currentService.type,
            validity: currentService.validity,
            processing: currentService.processing,
          },
          customer: {
            givenName: customerData.givenName,
            surname: customerData.surname,
            email: customerData.email,
            merchantCustomerId: `CUST_${Date.now()}`,
            identificationDocId: customerData.identificationDocId,
            phone: customerData.phone,
            ...(customerData.middleName ? { middleName: customerData.middleName } : {}),
          },
          billing: {
            street1: "Av. Principal",
            country: "EC",
          },
        });

        if (!result.success) {
          setError(result.error || "Error al procesar el pago");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error al procesar el pago";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [currentService, createCheckout]
  );

  return {
    isOpen,
    isLoading: isLoading || datafastLoading,
    currentService,
    error,
    openDialog,
    closeDialog,
    handlePay,
    clearError: () => setError(null),
  };
};
