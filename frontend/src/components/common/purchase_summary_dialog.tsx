// components/common/PurchaseSummaryDialog.tsx

"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  CalendarIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

// Interfaz para el servicio
interface ServiceItem {
  id: string | number;
  name: string;
  type: string;
  price: number;
  validity?: string;
  processing?: string;
  includes?: string[];
}

// Props del componente
interface PurchaseSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceItem;
  onPay: () => void; // Preparado para futura integración con Datafast
  isLoading?: boolean;
  currency?: string;
  taxRate?: number; // IVA configurable
}

export const PurchaseSummaryDialog: React.FC<PurchaseSummaryDialogProps> = ({
  isOpen,
  onClose,
  service,
  onPay,
  isLoading = false,
  currency = "$", // Por defecto dólar
  taxRate = 0.15, // 15% por defecto
}) => {
  // Formateador de precios
  const formatPrice = (price: number) => {
    return `${currency} ${price.toFixed(2)}`;
  };

  // Cálculos financieros
  const tax = service.price * taxRate;
  const total = service.price + tax;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay con blur */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        {/* Panel del diálogo */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
                {/* HEADER */}
                <div className="relative border-b border-neutral-200 bg-white px-6 py-5">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute right-4 top-4 rounded-full bg-neutral-100 p-2 transition hover:bg-neutral-200 disabled:opacity-50"
                    aria-label="Cerrar diálogo"
                  >
                    <XMarkIcon className="h-5 w-5 text-neutral-700" />
                  </button>

                  <div className="flex items-center gap-3 pr-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
                      <ShoppingBagIcon className="h-6 w-6 text-primary-700" />
                    </div>
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-bold text-neutral-900"
                    >
                      Resumen de tu Solicitud
                    </Dialog.Title>
                  </div>
                </div>

                {/* CONTENIDO */}
                <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
                  {/* Tarjeta del Servicio */}
                  <div className="rounded-2xl bg-primary-50/50 p-4 ring-1 ring-primary-200/50">
                    <div className="flex items-start gap-4">
                      {/* Icono */}
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-100">
                        <GlobeAltIcon className="h-7 w-7 text-primary-700" />
                      </div>

                      {/* Info del servicio */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold text-neutral-900">
                          {service.name}
                        </h4>
                        <p className="text-sm text-neutral-600">
                          {service.type}
                        </p>
                      </div>

                      {/* Precio */}
                      <div className="text-right">
                        <span className="text-sm font-medium text-neutral-500">
                          Precio
                        </span>
                        <p className="text-lg font-bold text-primary-700">
                          {formatPrice(service.price)}
                        </p>
                      </div>
                    </div>

                    {/* Detalles adicionales */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {service.validity && (
                        <div className="rounded-lg bg-white/80 p-2.5">
                          <p className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                            <CalendarIcon className="h-3.5 w-3.5" />
                            Validez
                          </p>
                          <p className="text-sm font-semibold text-neutral-900">
                            {service.validity}
                          </p>
                        </div>
                      )}
                      {service.processing && (
                        <div className="rounded-lg bg-white/80 p-2.5">
                          <p className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                            <DocumentTextIcon className="h-3.5 w-3.5" />
                            Procesamiento
                          </p>
                          <p className="text-sm font-semibold text-neutral-900">
                            {service.processing}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lista de Incluye */}
                  {service.includes && service.includes.length > 0 && (
                    <div className="mt-5">
                      <h5 className="text-sm font-semibold text-neutral-900 mb-3">
                        Lo que incluye el servicio:
                      </h5>
                      <div className="space-y-2">
                        {service.includes.map((item, index) => (
                          <div key={index} className="flex items-start gap-2.5">
                            <CheckBadgeIcon className="h-4 w-4 shrink-0 text-accent-green mt-0.5" />
                            <span className="text-sm text-neutral-700">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resumen de Precios */}
                  <div className="mt-6 rounded-2xl bg-neutral-50 p-4">
                    <div className="space-y-2">
                      {/* Subtotal */}
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Subtotal</span>
                        <span className="font-medium text-neutral-900">
                          {formatPrice(service.price)}
                        </span>
                      </div>

                      {/* IVA */}
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">
                          IVA ({Math.round(taxRate * 100)}%)
                        </span>
                        <span className="font-medium text-neutral-900">
                          {formatPrice(tax)}
                        </span>
                      </div>

                      {/* Total */}
                      <div className="border-t border-neutral-200 pt-2 mt-2">
                        <div className="flex justify-between text-base font-bold">
                          <span className="text-neutral-900">Total</span>
                          <span className="text-primary-700">
                            {formatPrice(total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mensaje de seguridad */}
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-accent-green" />
                    <span className="text-xs text-neutral-500">
                      Pago 100% seguro. Tus datos están protegidos.
                    </span>
                  </div>
                </div>

                {/* FOOTER - Botón de pago */}
                <div className="border-t border-neutral-200 bg-neutral-50/50 px-6 py-5">
                  <button
                    onClick={onPay}
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-primary-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-700/25 transition-all hover:bg-primary-800 hover:shadow-primary-700/35 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <>
                        {/* Spinner de carga */}
                        <svg
                          className="h-5 w-5 animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CreditCardIcon className="h-5 w-5" />
                        Pagar {formatPrice(total)}
                      </>
                    )}
                  </button>

                  {/* Términos y condiciones */}
                  <p className="mt-3 text-center text-xs text-neutral-400">
                    Al hacer clic en pagar, aceptas nuestros{" "}
                    <a
                      href="/terms"
                      className="text-primary-700 hover:underline"
                    >
                      términos y condiciones
                    </a>
                  </p>

                  {/* Badge de integración futura */}
                  <div className="mt-2 flex justify-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-medium text-neutral-500">
                      <CreditCardIcon className="h-3 w-3" />
                      Próximamente Datafast
                    </span>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
