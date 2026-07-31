"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  CalendarIcon,
  GlobeAltIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { useHelpData } from "@/hooks";

interface ServiceItem {
  id: string | number;
  name: string;
  type: string;
  price: number;
  validity?: string;
  processing?: string;
  includes?: string[];
}

export interface CustomerFormData {
  givenName: string;
  surname: string;
  email: string;
  phone: string;
  identificationDocId: string;
}

interface PurchaseSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceItem;
  onPay: (customerData: CustomerFormData) => void;
  isLoading?: boolean;
  currency?: string;
  taxRate?: number;
  error?: string | null;
}

export const PurchaseSummaryDialog: React.FC<PurchaseSummaryDialogProps> = ({
  isOpen,
  onClose,
  service,
  onPay,
  isLoading = false,
  currency = "$",
  taxRate = 0.15,
  error = null,
}) => {
  const { data: helpData } = useHelpData();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<CustomerFormData>({
    givenName: "",
    surname: "",
    email: "",
    phone: "",
    identificationDocId: "",
  });

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof CustomerFormData, string>>
  >({});

  const formatPrice = (price: number) => {
    return `${currency} ${price.toFixed(2)}`;
  };

  const tax = service.price * taxRate;
  const total = service.price + tax;

  const handleInputChange = (field: keyof CustomerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof CustomerFormData, string>> = {};

    if (!formData.givenName.trim()) errors.givenName = "Requerido";
    if (!formData.surname.trim()) errors.surname = "Requerido";
    if (!formData.email.trim() || !formData.email.includes("@"))
      errors.email = "Email inválido";
    if (!formData.phone.trim()) errors.phone = "Requerido";
    if (
      !formData.identificationDocId.trim() ||
      formData.identificationDocId.length !== 10
    )
      errors.identificationDocId = "Cédula debe tener 10 dígitos";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayClick = () => {
    if (!validateForm()) return;
    onPay(formData);
  };

  const handleClose = () => {
    if (!isLoading) {
      setShowForm(false);
      setFormErrors({});
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
                <div className="relative border-b border-neutral-200 bg-white px-6 py-5">
                  <button
                    onClick={handleClose}
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
                      {showForm ? "Tus Datos" : "Resumen de tu Solicitud"}
                    </Dialog.Title>
                  </div>
                </div>

                <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
                  {!showForm ? (
                    <>
                      {/* Service Card */}
                      <div className="rounded-2xl bg-primary-50/50 p-4 ring-1 ring-primary-200/50">
                        <div className="flex items-start gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-100">
                            <GlobeAltIcon className="h-7 w-7 text-primary-700" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-bold text-neutral-900">
                              {service.name}
                            </h4>
                            <p className="text-sm text-neutral-600">
                              {service.type}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium text-neutral-500">
                              Precio
                            </span>
                            <p className="text-lg font-bold text-primary-700">
                              {formatPrice(service.price)}
                            </p>
                          </div>
                        </div>

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

                      {service.includes && service.includes.length > 0 && (
                        <div className="mt-5">
                          <h5 className="text-sm font-semibold text-neutral-900 mb-3">
                            Lo que incluye el servicio:
                          </h5>
                          <div className="space-y-2">
                            {service.includes.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-2.5"
                              >
                                <CheckBadgeIcon className="h-4 w-4 shrink-0 text-accent-green mt-0.5" />
                                <span className="text-sm text-neutral-700">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-6 rounded-2xl bg-neutral-50 p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-600">Subtotal</span>
                            <span className="font-medium text-neutral-900">
                              {formatPrice(service.price)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-600">
                              IVA ({Math.round(taxRate * 100)}%)
                            </span>
                            <span className="font-medium text-neutral-900">
                              {formatPrice(tax)}
                            </span>
                          </div>
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
                      <div className="mt-6 flex flex-row items-center justify-center gap-2 px-2">
                        {/* Un checkbox obligatoio si no no puede avanzar */}
                        <input
                          type="checkbox"
                          id="terms"
                          name="terms"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="h-4 w-4 rounded border-neutral-300 text-primary-700 focus:ring-primary-500 accent-primary-700"
                        />
                        <label
                          htmlFor="terms"
                          className="text-xs text-neutral-600"
                        >
                          <p className="mt-3 text-justify">
                            Confirmo que he leído los{" "}
                            <a
                              href={helpData?.pdfPoliticasViaje || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="text-primary-700 hover:underline"
                            >
                              términos y condiciones
                            </a>
                            ,{" "}
                            <a
                              href={helpData?.pdfPoliticasVisas || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="text-primary-700 hover:underline"
                            >
                              políticas de privacidad{" "}
                            </a>
                            y{" "}
                            <a
                              href="/refund"
                              className="text-primary-700 hover:underline"
                            >
                              políticas de visas
                            </a>
                            .
                          </p>
                        </label>
                      </div>

                      {error && (
                        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                          {error}
                        </div>
                      )}

                      <div className="mt-6">
                        <button
                          onClick={() => setShowForm(true)}
                          disabled={isLoading || !termsAccepted}
                          className="flex w-full items-center justify-center gap-3 rounded-full bg-primary-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-700/25 transition-all hover:bg-primary-800 hover:shadow-primary-700/35 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                        >
                          <CreditCardIcon className="h-5 w-5" />
                          Pagar {formatPrice(total)}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Customer Form */}
                      <p className="text-sm text-neutral-600 mb-5">
                        Ingresa tus datos para continuar con el pago seguro
                      </p>

                      <div className="space-y-4">
                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 mb-1">
                            <UserIcon className="h-3.5 w-3.5" /> Nombre
                          </label>
                          <input
                            type="text"
                            value={formData.givenName}
                            onChange={(e) =>
                              handleInputChange("givenName", e.target.value)
                            }
                            className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-primary-400 disabled:opacity-50"
                            placeholder="Tu nombre"
                            disabled={isLoading}
                          />
                          {formErrors.givenName && (
                            <p className="text-xs text-red-600 mt-1">
                              {formErrors.givenName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 mb-1">
                            <UserIcon className="h-3.5 w-3.5" /> Apellido
                          </label>
                          <input
                            type="text"
                            value={formData.surname}
                            onChange={(e) =>
                              handleInputChange("surname", e.target.value)
                            }
                            className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-primary-400 disabled:opacity-50"
                            placeholder="Tu apellido"
                            disabled={isLoading}
                          />
                          {formErrors.surname && (
                            <p className="text-xs text-red-600 mt-1">
                              {formErrors.surname}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 mb-1">
                            <EnvelopeIcon className="h-3.5 w-3.5" /> Email
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-primary-400 disabled:opacity-50"
                            placeholder="tu@email.com"
                            disabled={isLoading}
                          />
                          {formErrors.email && (
                            <p className="text-xs text-red-600 mt-1">
                              {formErrors.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 mb-1">
                            <PhoneIcon className="h-3.5 w-3.5" /> Teléfono
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-primary-400 disabled:opacity-50"
                            placeholder="0991234567"
                            disabled={isLoading}
                          />
                          {formErrors.phone && (
                            <p className="text-xs text-red-600 mt-1">
                              {formErrors.phone}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 mb-1">
                            <IdentificationIcon className="h-3.5 w-3.5" />{" "}
                            Cédula
                          </label>
                          <input
                            type="text"
                            value={formData.identificationDocId}
                            onChange={(e) =>
                              handleInputChange(
                                "identificationDocId",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-primary-400 disabled:opacity-50"
                            placeholder="10 dígitos"
                            maxLength={10}
                            disabled={isLoading}
                          />
                          {formErrors.identificationDocId && (
                            <p className="text-xs text-red-600 mt-1">
                              {formErrors.identificationDocId}
                            </p>
                          )}
                        </div>
                      </div>

                      {error && (
                        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                          {error}
                        </div>
                      )}

                      <div className="mt-6 flex gap-3">
                        <button
                          onClick={() => setShowForm(false)}
                          disabled={isLoading}
                          className="flex-1 rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
                        >
                          Volver
                        </button>
                        <button
                          onClick={handlePayClick}
                          disabled={isLoading}
                          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-700/25 transition-all hover:bg-primary-800 hover:shadow-primary-700/35 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                        >
                          {isLoading ? (
                            <>
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
                      </div>
                    </>
                  )}
                </div>

                {!showForm && (
                  <div className="border-t border-neutral-200 bg-neutral-50/50 px-6! py-5!">
                    <div className="my-1 flex items-center justify-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-accent-green" />
                      <span className="text-xs text-neutral-500">
                        Pago 100% seguro. Tus datos están protegidos.
                      </span>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
