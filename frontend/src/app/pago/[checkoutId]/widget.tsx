"use client";

import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    wpwlOptions?: WpwlOptions;
  }
}

interface WpwlOptions {
  style?: string;
  locale?: string;
  brandDetection?: boolean;
  onReady?: () => void;
  onBeforeSubmitCard?: () => boolean;
  onError?: (error: unknown) => void;
}

const SUPPORTED_BRANDS = "VISA MASTERCARD AMEX DINERS DISCOVER";
const WIDGET_TIMEOUT_MS = 20000;
const WIDGET_CHECK_INTERVAL_MS = 500;

function isValidCheckoutId(id: string): boolean {
  return /^[A-Za-z0-9]{20,60}$/.test(id);
}

function injectCustomFields(): void {
  const formCard = document.querySelector("form.wpwl-form-card");
  if (!formCard) return;

  const submitBtn = formCard.querySelector(".wpwl-button");
  if (!submitBtn) return;

  const wrapper = (label: string, innerHTML: string): HTMLDivElement => {
    const div = document.createElement("div");
    div.className = "wpwl-wrapper wpwl-wrapper-custom";
    div.innerHTML = `<label style="display:block;margin-bottom:4px;font-weight:500">${label}:</label>${innerHTML}`;
    return div;
  };

  submitBtn.parentNode!.insertBefore(
    wrapper(
      "Número de cuotas",
      `<select name="customParameters[SHOPPER_INSTALLMENTS]" class="wpwl-control">
        <option value="0">0 (Corriente)</option>
        <option value="3">3 cuotas</option>
        <option value="6">6 cuotas</option>
        <option value="9">9 cuotas</option>
        <option value="12">12 cuotas</option>
        <option value="18">18 cuotas</option>
        <option value="24">24 cuotas</option>
      </select>`
    ),
    submitBtn
  );

  submitBtn.parentNode!.insertBefore(
    wrapper(
      "Tipo de crédito",
      `<select name="customParameters[SHOPPER_TIPOCREDITO]" class="wpwl-control">
        <option value="00">Corriente</option>
        <option value="01">Diferido corriente</option>
        <option value="02">Diferido con interés</option>
        <option value="03">Diferido sin interés</option>
        <option value="07">Diferido con interés + Meses gracia</option>
        <option value="09">Diferido sin interés + Meses gracia</option>
        <option value="21">Diferido Plus</option>
        <option value="22">Duplica tu plazo</option>
      </select>`
    ),
    submitBtn
  );

  submitBtn.parentNode!.insertBefore(
    wrapper(
      "",
      `<label style="display:flex;align-items:center;gap:8px;cursor:pointer;margin-bottom:0">
        <input type="checkbox" name="createRegistration" value="true" />
        Guardar datos de tarjeta para futuras compras
      </label>`
    ),
    submitBtn
  );

  const logoDiv = document.createElement("div");
  logoDiv.style.textAlign = "center";
  logoDiv.style.marginTop = "16px";
  logoDiv.innerHTML =
    '<img src="https://www.datafast.com.ec/images/verified.png" style="max-width:300px;width:100%;display:block;margin:0 auto" alt="Powered by Datafast" loading="lazy" />';
  formCard.appendChild(logoDiv);
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-3 py-12">
      <svg
        className="h-8 w-8 animate-spin text-primary-700"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
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
      <p className="text-sm text-neutral-500">Cargando formulario de pago seguro...</p>
    </div>
  );
}

function ErrorDisplay({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="rounded-full bg-red-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <svg
          className="h-8 w-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <p className="text-red-700 font-medium">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 text-sm text-primary-700 hover:underline"
      >
        Reintentar
      </button>
    </div>
  );
}

interface Props {
  checkoutId: string;
}

export function DatafastPaymentWidget({ checkoutId }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const readyCalledRef = useRef(false);
  const mountedRef = useRef(true);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const handleError = useCallback(
    (msg: string) => {
      if (!mountedRef.current) return;
      clearTimers();
      setLoading(false);
      setError(msg);
    },
    [clearTimers]
  );

  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    readyCalledRef.current = false;
  }, []);

  const initWidget = useCallback(() => {
    if (!checkoutId || !mountedRef.current) return;

    if (!isValidCheckoutId(checkoutId)) {
      handleError("El identificador de pago no es válido.");
      return;
    }

    const form = document.getElementById("datafast-payment-form");
    if (!form) {
      handleError("No se encontró el formulario de pago.");
      return;
    }

    const alreadyLoaded = form.querySelector(".wpwl-form-card");
    if (alreadyLoaded) {
      setLoading(false);
      return;
    }

    clearTimers();
    readyCalledRef.current = false;

    if (scriptRef.current?.parentNode) {
      scriptRef.current.parentNode.removeChild(scriptRef.current);
      scriptRef.current = null;
    }

    window.wpwlOptions = {
      style: "card",
      locale: "es",
      brandDetection: true,
      onReady: () => {
        if (!mountedRef.current) return;
        clearTimers();
        readyCalledRef.current = true;
        setLoading(false);
        injectCustomFields();
      },
      onBeforeSubmitCard: () => {
        const cardholderInput = document.querySelector(
          ".wpwl-control-cardHolder"
        ) as HTMLInputElement | null;

        if (!cardholderInput || !cardholderInput.value.trim()) {
          cardholderInput?.classList.add("wpwl-has-error");

          const existingError = document.querySelector(".wpwl-hint-cardHolderError");
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
      onError: (err: unknown) => {
        console.error("[Datafast] Error del widget:", err);
        handleError("Error al cargar el formulario de pago. Intente nuevamente.");
      },
    };

    timeoutRef.current = setTimeout(() => {
      handleError(
        "Tiempo de espera agotado al cargar el formulario de pago. Verifica tu conexión e inténtalo de nuevo."
      );
    }, WIDGET_TIMEOUT_MS);

    pollRef.current = setInterval(() => {
      if (!mountedRef.current) return;
      const cardForm = form.querySelector(".wpwl-form-card");
      if (cardForm && !readyCalledRef.current) {
        clearTimers();
        readyCalledRef.current = true;
        setLoading(false);
        injectCustomFields();
      }
    }, WIDGET_CHECK_INTERVAL_MS);

    const script = document.createElement("script");
    script.src = `https://eu-test.oppwa.com/v1/paymentWidgets.js?checkoutId=${encodeURIComponent(checkoutId)}`;
    script.onload = () => {
      const errorEl = form.querySelector(".wpwl-hint-error");
      if (errorEl && !readyCalledRef.current) {
        handleError(
          "No se pudo inicializar el formulario de pago. Verifica los datos e inténtalo de nuevo."
        );
      }
    };
    script.onerror = () => {
      console.error("[Datafast] Error de red al cargar paymentWidgets.js");
      handleError("Error al cargar el formulario de pago. Intente nuevamente.");
    };

    form.appendChild(script);
    scriptRef.current = script;
  }, [checkoutId, handleError, clearTimers]);

  useEffect(() => {
    mountedRef.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    initWidget();

    return () => {
      mountedRef.current = false;
      clearTimers();
      if (scriptRef.current?.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, [initWidget, clearTimers]);

  return (
    <main className="min-h-screen bg-neutral-50 flex items-start justify-center pt-32 pb-16 px-4">
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
            data-brands={SUPPORTED_BRANDS}
            noValidate
          >
            {SUPPORTED_BRANDS}
          </form>

          {loading && !error && <LoadingSpinner />}

          {error && <ErrorDisplay message={error} onRetry={handleRetry} />}
        </div>

        <div className="mt-4 text-center text-xs text-neutral-400">
          <p>Tus datos están protegidos con encriptación SSL.</p>
          <p className="mt-1">Procesado por Datafast</p>
        </div>
      </div>
    </main>
  );
}
