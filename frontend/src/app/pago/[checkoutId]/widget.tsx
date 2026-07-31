"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    wpwlOptions?: {
      style?: string;
      locale?: string;
      onReady?: () => void;
      onBeforeSubmitCard?: () => boolean;
      onError?: (error: unknown) => void;
      brandDetection?: boolean;
    };
  }
}

interface Props {
  checkoutId: string;
}

export function DatafastPaymentWidget({ checkoutId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!checkoutId) return;

    let scriptElement: HTMLScriptElement | null = null;

    window.wpwlOptions = {
      style: "card",
      locale: "es",
      brandDetection: true,
      onReady: () => {
        setLoading(false);

        const formCard = document.querySelector("form.wpwl-form-card");
        if (!formCard) return;

        const submitBtn = formCard.querySelector(".wpwl-button");

        const installmentsHtml = document.createElement("div");
        installmentsHtml.className = "wpwl-wrapper wpwl-wrapper-custom";
        installmentsHtml.innerHTML = `
          <label style="display:block;margin-bottom:4px;font-weight:500">Número de cuotas:</label>
          <select name="customParameters[SHOPPER_INSTALLMENTS]" class="wpwl-control">
            <option value="0">0 (Corriente)</option>
            <option value="3">3 cuotas</option>
            <option value="6">6 cuotas</option>
            <option value="9">9 cuotas</option>
            <option value="12">12 cuotas</option>
            <option value="18">18 cuotas</option>
            <option value="24">24 cuotas</option>
          </select>
        `;

        const creditTypeHtml = document.createElement("div");
        creditTypeHtml.className = "wpwl-wrapper wpwl-wrapper-custom";
        creditTypeHtml.innerHTML = `
          <label style="display:block;margin-bottom:4px;font-weight:500">Tipo de crédito:</label>
          <select name="customParameters[SHOPPER_TIPOCREDITO]" class="wpwl-control">
            <option value="00">Corriente</option>
            <option value="01">Diferido corriente</option>
            <option value="02">Diferido con interés</option>
            <option value="03">Diferido sin interés</option>
            <option value="07">Diferido con interés + Meses gracia</option>
            <option value="09">Diferido sin interés + Meses gracia</option>
            <option value="21">Diferido Plus</option>
            <option value="22">Duplica tu plazo</option>
          </select>
        `;

        const tokenHtml = document.createElement("div");
        tokenHtml.className = "wpwl-wrapper wpwl-wrapper-custom";
        tokenHtml.innerHTML = `
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
            <input type="checkbox" name="createRegistration" value="true" />
            Guardar datos de tarjeta para futuras compras
          </label>
        `;

        const logoHtml = document.createElement("div");
        logoHtml.style.textAlign = "center";
        logoHtml.style.marginTop = "16px";
        logoHtml.innerHTML =
          '<img src="https://www.datafast.com.ec/images/verified.png" style="max-width:300px;width:100%;display:block;margin:0 auto" alt="Powered by Datafast" />';

        if (submitBtn) {
          submitBtn.parentNode!.insertBefore(installmentsHtml, submitBtn);
          submitBtn.parentNode!.insertBefore(creditTypeHtml, submitBtn);
          submitBtn.parentNode!.insertBefore(tokenHtml, submitBtn);
          submitBtn.parentNode!.insertBefore(logoHtml, submitBtn.nextSibling);
        }
      },
      onBeforeSubmitCard: () => {
        const cardholderInput = document.querySelector(
          ".wpwl-control-cardHolder",
        ) as HTMLInputElement | null;
        if (!cardholderInput || !cardholderInput.value.trim()) {
          cardholderInput?.classList.add("wpwl-has-error");
          const existingError = document.querySelector(
            ".wpwl-hint-cardHolderError",
          );
          if (!existingError && cardholderInput?.parentNode) {
            const errorDiv = document.createElement("div");
            errorDiv.className = "wpwl-hint wpwl-hint-cardHolderError";
            errorDiv.textContent = "Campo requerido";
            cardholderInput.parentNode.appendChild(errorDiv);
          }
          return false;
        }
        return true;
      },
      onError: () => {
        setError("Error al cargar el formulario de pago. Intente nuevamente.");
      },
    };

    scriptElement = document.createElement("script");
    scriptElement.src = `https://eu-test.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
    scriptElement.async = true;

    const form = document.getElementById("datafast-payment-form");
    if (form) {
      form.innerHTML = "";
      form.appendChild(scriptElement);
    }

    scriptElement.onerror = () => {
      setLoading(false);
      setError("Error al cargar el formulario de pago. Intente nuevamente.");
    };

    return () => {
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
      delete window.wpwlOptions;
    };
  }, [checkoutId]);

  return (
    <main className="min-h-screen! bg-neutral-50 flex items-start justify-center pt-50! pb-30! px-4!">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">Pago Seguro</h1>
          <p className="text-neutral-600 mt-2">
            Completa los datos de tu tarjeta para finalizar
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-neutral-200 p-6">
          <form
            id="datafast-payment-form"
            action="/pago/resultado"
            className="wpwl-form"
            data-brand="VISA MASTER DINERS DISCOVER"
          />

          {loading && !error && (
            <div className="flex flex-col items-center gap-3 py-12">
              <svg
                className="h-8 w-8 animate-spin text-primary-700"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <p className="text-sm text-neutral-500">
                Cargando formulario de pago seguro...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="rounded-full bg-red-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p className="text-red-700 font-medium">{error}</p>
              <button
                onClick={() => router.back()}
                className="mt-4 text-sm text-primary-700 hover:underline"
              >
                Volver atrás
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-xs text-neutral-400">
          <p>Tus datos están protegidos con encriptación SSL.</p>
          <p className="mt-1">Procesado por Datafast</p>
        </div>
      </div>
    </main>
  );
}
