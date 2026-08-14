import { useState, useCallback } from "react";
import { useDatafastPayment } from "./useDatafastPayment";
import { useAuth } from "@/lib/auth-context";

interface ServiceData {
  id: string | number;
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

  const { user } = useAuth();
  const { createCheckout, isLoading: datafastLoading } = useDatafastPayment();

  const generateMerchantCustomerId = useCallback((): string => {
    if (user?.id) {
      return `USER_${user.id}_${Date.now()}`;
    }
    return `GUEST_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  }, [user]);

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
    async (customerData: CustomerFormData, paymentOptions?: { creditType?: string; installments?: number; visaType?: string; appointmentDate?: string; receivePromotion?: boolean }) => {
      if (!currentService) {
        setError("No hay servicio seleccionado");
        return;
      }

      if (customerData.identificationDocId.length !== 10) {
        setError("La cédula debe tener 10 dígitos");
        return;
      }

      const creditType = paymentOptions?.creditType || "00";
      if (!["00", "02", "03"].includes(creditType)) {
        setError("Tipo de crédito no habilitado");
        return;
      }
      if (creditType !== "00") {
        if (currentService.price < 5) {
          setError("El monto mínimo para pagar en cuotas es $5.00");
          return;
        }
        if (!paymentOptions?.installments || paymentOptions.installments < 1) {
          setError("Selecciona el número de cuotas");
          return;
        }
      }

      setError(null);
      setIsLoading(true);

      try {
        const total = currentService.price;

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
            merchantCustomerId: generateMerchantCustomerId(),
            identificationDocId: customerData.identificationDocId,
            phone: customerData.phone,
            ...(customerData.middleName ? { middleName: customerData.middleName } : {}),
          },
          billing: {
            street1: "Av. Principal",
            country: "EC",
          },
          creditType: paymentOptions?.creditType,
          installments: paymentOptions?.installments,
          visaType: paymentOptions?.visaType ?? currentService.name,
          appointmentDate: paymentOptions?.appointmentDate,
          receivePromotion: paymentOptions?.receivePromotion ?? false,
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
