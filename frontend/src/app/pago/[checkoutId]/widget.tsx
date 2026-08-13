"use client";

import Link from "next/link";
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

const DATAFAST_BASE_URL =
  process.env.NEXT_PUBLIC_DATAFAST_BASE_URL ||
  (process.env.NEXT_PUBLIC_NODE_ENV === "production"
    ? "https://eu-prod.oppwa.com"
    : "https://eu-test.oppwa.com");
const SUPPORTED_BRANDS = "VISA MASTERCARD AMEX DINERS DISCOVER";
const WIDGET_TIMEOUT_MS = 20000;
const WIDGET_POLL_MS = 300;

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------

function injectCustomFields(): void {
  const formCard =
    document.querySelector("form.wpwl-form-card") ||
    document.querySelector("form.paymentWidgets > div");

  if (!formCard) return;

  if (formCard.querySelector('[data-verified-logo]')) return;

  const logoDiv = document.createElement("div");
  logoDiv.setAttribute("data-verified-logo", "true");
  logoDiv.style.textAlign = "center";
  logoDiv.style.marginTop = "16px";
  logoDiv.innerHTML =
    '<img src="https://www.datafast.com.ec/images/verified.png" style="max-width:300px;width:100%;display:block;margin:0 auto" alt="Powered by Datafast" loading="lazy" />';

  // Insertar antes del botón de pago (requisito de certificación Datafast)
  const payButton =
    formCard.querySelector(".wpwl-button") ||
    formCard.querySelector("button[type=submit]");
  if (payButton && payButton.parentNode) {
    payButton.parentNode.insertBefore(logoDiv, payButton);
  } else {
    formCard.appendChild(logoDiv);
  }
}

/** Detecta si Datafast inyectó su propio error HTML dentro del form */
function hasDatafastError(form: HTMLElement): boolean {
  const text = (form.textContent ?? "").toLowerCase();
  return (
    text.includes("payment cannot be completed") ||
    text.includes("please contact support") ||
    text.includes("is invalid") ||
    text.includes("checkoutid")
  );
}

/** Vuelve a dejar el form limpio (solo las marcas de texto) */
function resetFormContent(form: HTMLElement): void {
  while (form.firstChild) {
    form.removeChild(form.firstChild);
  }
  form.appendChild(document.createTextNode(` ${SUPPORTED_BRANDS} `));
}

// ---------------------------------------------------------------------------
// Sub‑componentes
// ---------------------------------------------------------------------------

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
      <p className="text-sm text-neutral-500">
        Cargando formulario de pago seguro…
      </p>
    </div>
  );
}

function ErrorDisplay({ isExpired }: { isExpired: boolean }) {
  return (
    <div className="text-center py-10">
      {/* Icono */}
      <div className="rounded-full bg-amber-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <svg
          className="h-8 w-8 text-amber-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {isExpired ? (
            /* Reloj */
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          ) : (
            /* Triángulo */
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          )}
        </svg>
      </div>

      {/* Mensaje */}
      <h3 className="text-lg font-semibold text-neutral-800 mb-2">
        {isExpired
          ? "La sesión de pago ha expirado"
          : "No se pudo cargar el formulario"}
      </h3>
      <p className="text-sm text-neutral-500 max-w-xs mx-auto mb-6">
        {isExpired
          ? "El enlace de pago ya no es válido. Por favor inicia un nuevo pago desde la página de Visas."
          : "Ocurrió un error al comunicarse con el proveedor de pago. Verifica tu conexión e inténtalo nuevamente."}
      </p>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/visas"
          className="inline-flex items-center justify-center rounded-full bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-800"
        >
          Volver a Visas
        </Link>
        {!isExpired && (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-6 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

interface Props {
  checkoutId: string;
  creditType?: string;
  installments?: number;
}

export function DatafastPaymentWidget({
  checkoutId,
  creditType,
  installments,
}: Props) {
  const [phase, setPhase] = useState<"loading" | "ready" | "expired" | "error">(
    "loading",
  );

  const planLabel =
    creditType && creditType !== "00"
      ? `Diferido ${creditType === "02" ? "con interés" : "sin interés"}`
      : null;

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

  const bail = useCallback(
    (next: "expired" | "error") => {
      if (!mountedRef.current) return;
      clearTimers();

      const form = document.getElementById("datafast-payment-form");
      if (form && hasDatafastError(form)) {
        resetFormContent(form);
      }

      setPhase(next);
    },
    [clearTimers],
  );

  const initWidget = useCallback(() => {
    if (!checkoutId || !mountedRef.current) return;

    const form = document.getElementById("datafast-payment-form");
    if (!form) {
      bail("error");
      return;
    }

    if (form.querySelector(".wpwl-form-card")) {
      setPhase("ready");
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
        setPhase("ready");
        injectCustomFields();
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
        bail("error");
      },
    };

    timeoutRef.current = setTimeout(() => {
      bail("error");
    }, WIDGET_TIMEOUT_MS);

    pollRef.current = setInterval(() => {
      if (!mountedRef.current) return;

      const currentForm = document.getElementById("datafast-payment-form");
      if (!currentForm) return;

      if (hasDatafastError(currentForm)) {
        bail("expired");
        return;
      }

      const cardForm =
        currentForm.querySelector(".wpwl-form-card") ||
        currentForm.querySelector(".wpwl-control");

      if (cardForm && !readyCalledRef.current) {
        clearTimers();
        readyCalledRef.current = true;
        setPhase("ready");
        injectCustomFields();
      }
    }, WIDGET_POLL_MS);

    const script = document.createElement("script");
    script.src = `${DATAFAST_BASE_URL}/v1/paymentWidgets.js?checkoutId=${encodeURIComponent(checkoutId)}`;
    script.onerror = () => {
      bail("error");
    };

    form.appendChild(script);
    scriptRef.current = script;
  }, [checkoutId, bail, clearTimers]);

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
    <main className="min-h-screen bg-neutral-50 flex items-start! justify-center! pt-32! md:pt-40! pb-16! px-4!">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">Pago Seguro</h1>
          <p className="text-neutral-600 mt-2">
            Completa los datos de tu tarjeta para finalizar
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-neutral-200 p-6">
          {planLabel && (
            <div className="mb-4 rounded-lg bg-primary-50 px-4 py-3 text-sm text-primary-800 ring-1 ring-primary-200">
              <p className="font-semibold">
                Plan seleccionado: {planLabel}
                {installments ? ` - ${installments} cuotas` : ""}
              </p>
              <p className="text-xs mt-1 text-primary-600">
                Los pagos en cuotas solo aplican a tarjetas de crédito. Si pagas
                con débito, la transacción será rechazada.
              </p>
            </div>
          )}

          {/* El form siempre se renderiza pero se oculta con CSS si hay error */}
          <form
            id="datafast-payment-form"
            className="paymentWidgets"
            noValidate
            style={{ display: phase === "loading" || phase === "ready" ? undefined : "none" }}
          >
            {SUPPORTED_BRANDS}
          </form>

          {phase === "loading" && <LoadingSpinner />}

          {phase !== "loading" && phase !== "ready" && (
            <ErrorDisplay isExpired={phase === "expired"} />
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
