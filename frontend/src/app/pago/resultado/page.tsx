"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getPaymentStatus } from "@/services/payments";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resourcePath = searchParams.get("resourcePath");

  const [status, setStatus] = useState<"loading" | "success" | "failed" | "error">("loading");
  const [message, setMessage] = useState("");
  const [details, setDetails] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    if (!resourcePath) {
      setStatus("error");
      setMessage("No se recibió información de la transacción.");
      return;
    }

    let cancelled = false;

    async function fetchStatus() {
      try {
        const result = await getPaymentStatus(resourcePath!);

        if (cancelled) return;

        if (!result.success || !result.data) {
          setStatus("error");
          setMessage(result.error || "No se pudo verificar el estado de la transacción.");
          return;
        }

        const code = result.data.result.code;

        if (code === "000.000.000" || code === "000.100.110" || code.startsWith("000.000.")) {
          setStatus("success");
          setMessage("¡Pago exitoso! Tu solicitud ha sido registrada.");
        } else if (code.startsWith("000.200.")) {
          setStatus("loading");
          setMessage("Tu pago está siendo procesado. Te notificaremos cuando se complete.");
        } else {
          setStatus("failed");
          setMessage(result.data.result.description || "El pago no pudo ser completado.");
        }

        setDetails({
          "Monto": result.data.amount ? `$ ${result.data.amount}` : undefined,
          "Moneda": result.data.currency,
          "Tipo de pago": result.data.paymentType,
          "Código de autorización": result.data.resultDetails?.AuthCode,
          "Banco": result.data.resultDetails?.clearingInstituteName,
          "Terminación tarjeta": result.data.resultDetails?.LastFourDigits
            ? `****${result.data.resultDetails.LastFourDigits}`
            : undefined,
        });
      } catch {
        if (!cancelled) {
          setStatus("error");
          setMessage("Error de conexión al verificar el pago.");
        }
      }
    }

    fetchStatus();
    return () => { cancelled = true; };
  }, [resourcePath]);

  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-neutral-200 p-8 text-center">
          {status === "loading" && (
            <>
              <div className="flex justify-center mb-6">
                <svg className="h-16 w-16 animate-spin text-primary-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-neutral-900">Verificando pago</h1>
              <p className="text-neutral-600 mt-2">{message || "Consultando estado de la transacción..."}</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="rounded-full bg-green-100 w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-neutral-900">¡Pago Exitoso!</h1>
              <p className="text-neutral-600 mt-2">{message}</p>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="rounded-full bg-red-100 w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-neutral-900">Pago Rechazado</h1>
              <p className="text-neutral-600 mt-2">{message}</p>
              <button
                onClick={() => router.back()}
                className="mt-6 inline-flex rounded-full bg-primary-700 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-800"
              >
                Intentar de nuevo
              </button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="rounded-full bg-amber-100 w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="h-10 w-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-neutral-900">Algo salió mal</h1>
              <p className="text-neutral-600 mt-2">{message}</p>
            </>
          )}

          {Object.keys(details).length > 0 && (
            <div className="mt-6 border-t border-neutral-200 pt-4 text-left">
              <h3 className="text-sm font-semibold text-neutral-700 mb-3">Detalles de la transacción</h3>
              <dl className="space-y-2">
                {Object.entries(details).map(([key, value]) =>
                  value ? (
                    <div key={key} className="flex justify-between text-sm">
                      <dt className="text-neutral-500">{key}</dt>
                      <dd className="font-medium text-neutral-900">{value}</dd>
                    </div>
                  ) : null
                )}
              </dl>
            </div>
          )}

          {(status === "success" || status === "error") && (
            <div className="mt-6">
              <Link
                href="/visas"
                className="text-sm text-primary-700 hover:underline"
              >
                ← Volver a Visas
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function DatafastResultPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="text-center">
            <svg className="h-10 w-10 animate-spin text-primary-700 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-neutral-600 mt-4">Cargando...</p>
          </div>
        </main>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
