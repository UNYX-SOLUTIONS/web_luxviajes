// hooks/usePurchaseDialog.ts
import { useState, useCallback } from "react";

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

export const usePurchaseDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentService, setCurrentService] = useState<ServiceData | null>(
    null
  );

  const openDialog = useCallback((service: ServiceData) => {
    setCurrentService(service);
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    if (!isLoading) {
      setIsOpen(false);
      // Pequeño delay para limpiar el servicio después del cierre
      setTimeout(() => setCurrentService(null), 300);
    }
  }, [isLoading]);

  const handlePay = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simular proceso de pago
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Aquí iría la lógica real de pago
      console.log("Pago procesado para:", currentService?.name);
      
      // Cerrar el diálogo después del pago exitoso
      setIsOpen(false);
      setCurrentService(null);
    } catch (error) {
      console.error("Error al procesar el pago:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentService]);

  return {
    isOpen,
    isLoading,
    currentService,
    openDialog,
    closeDialog,
    handlePay,
  };
};