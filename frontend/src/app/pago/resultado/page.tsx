"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getPaymentStatus } from "@/services/payments";

const ERROR_MESSAGES: Record<string, string> = {
  "800.100.151": "Tarjeta inválida. Verifica el número.",
  "800.100.152": "Transacción rechazada por el banco.",
  "800.100.155": "Fondos insuficientes.",
  "800.100.157": "Fecha de expiración incorrecta.",
  "800.100.159": "Tarjeta reportada como robada.",
  "800.100.165": "Tarjeta reportada como perdida.",
  "800.100.168": "Tarjeta restringida.",
  "800.100.170": "Transacción no permitida.",
  "800.100.174": "Monto inválido.",
  "100.400.147": "Transacción rechazada por regla antifraude.",
  "900.100.100": "Error de comunicación con el banco. Reintenta.",
};

type Status = "loading" | "success" | "failed" | "pending" | "error";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resourcePath = searchParams.get("resourcePath");

  const isValidResourcePath = resourcePath && resourcePath.length >= 5;

  const [status, setStatus] = useState<Status>(() => {
    if (!isValidResourcePath) return "error";
    return "loading";
  });
  const [message, setMessage] = useState(() => {
    if (!isValidResourcePath) return "No se recibió información de la transacción.";
    return "";
  });
  const [details, setDetails] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    if (!isValidResourcePath) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      setStatus("error");
      setMessage("Tiempo de espera agotado. El servidor no respondió a tiempo.");
    }, 25000);

    let mounted = true;

    async function check() {
      try {
        const result = await getPaymentStatus(resourcePath!);

        if (!mounted) return;
        clearTimeout(timeoutId);

        if (!result.success || !result.data) {
          setStatus("error");
          setMessage(result.error || "No se pudo verificar el estado.");
          return;
        }

        const code = result.data.result?.code || "";

        if (code === "000.000.000" || code === "000.100.110" || code === "000.100.112") {
          setStatus("success");
          setMessage("Tu solicitud ha sido registrada exitosamente.");
        } else if (code.startsWith("000.200.")) {
          setStatus("pending");
          setMessage("El pago está siendo procesado. No cierres esta página.");
        } else {
          setStatus("failed");
          setMessage(ERROR_MESSAGES[code] || result.data.result?.description || "El pago no pudo ser completado.");
        }

        setDetails({
          "Monto": result.data.amount ? `$ ${result.data.amount}` : undefined,
          "Moneda": result.data.currency,
          "Código": code,
          "Autorización": result.data.resultDetails?.AuthCode,
          "Banco": result.data.resultDetails?.clearingInstituteName,
          "Terminación tarjeta": result.data.resultDetails?.LastFourDigits
            ? `****${result.data.resultDetails.LastFourDigits}`
            : undefined,
        });
      } catch {
        if (!mounted) return;
        clearTimeout(timeoutId);
        setStatus("error");
        setMessage("Error de conexión al verificar el pago. Verifica tu conexión a internet.");
      }
    }

    check();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [resourcePath, isValidResourcePath]);

  return (
    <main className="min-h-screen! bg-neutral-50 flex items-center justify-center pt-50! pb-30! px-4!">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-neutral-200 p-8 text-center">
          {status === "loading" && (
            <>
              <div className="flex justify-center mb-6">
                <svg className="h-16 w-16 animate-spin text-primary-700" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-neutral-900">Verificando pago</h1>
              <p className="text-neutral-600 mt-2">{message || "Consultando estado de la transacción..."}</p>
            </>
          )}

          {status === "pending" && (
            <>
              <div className="flex justify-center mb-6">
                <svg className="h-16 w-16 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-xl! font-bold text-neutral-900">Pago en Procesamiento</h1>
              <p className="text-neutral-600 mt-2">{message}</p>
              <p className="text-xs! text-neutral-400 mt-4">Puedes cerrar esta página. Te notificaremos por email cuando se complete.</p>
              <Link href="/visas" className="mt-6! inline-flex items-center justify-center rounded-full bg-primary-700 px-6! py-3! text-sm font-semibold text-white hover:bg-primary-800">
                Volver a Visas
              </Link>
            </>
          )}

          {status === "success" && (
            <>
              <div className="rounded-full bg-green-100 w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl! font-bold text-neutral-900">¡Pago Exitoso!</h1>
              <p className="text-neutral-600 mt-2">{message}</p>
              <Link href="/visas" className="mt-6! inline-flex items-center justify-center rounded-full bg-primary-700 px-6! py-3! text-sm font-semibold text-white hover:bg-primary-800">
                Volver a Visas
              </Link>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="rounded-full bg-red-100 w-20 h-20 flex items-center! justify-center! mx-auto mb-6">
                <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl! font-bold text-neutral-900">Pago Rechazado</h1>
              <p className="text-neutral-600 mt-2">{message}</p>
              <div className="mt-6! flex flex-col gap-3 ">
                <button
                  onClick={() => router.back()}
                  className="inline-flex items-center! justify-center! rounded-full bg-primary-700 px-6! py-3! text-sm font-semibold text-white hover:bg-primary-800"
                >
                  Intentar con otra tarjeta
                </button>
                <Link href="/visas" className="text-sm! text-neutral-500 hover:underline">
                  Volver a Visas
                </Link>
              </div>
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
              <div className="mt-6 flex flex-col gap-3">
                {resourcePath && (
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center justify-center rounded-full bg-primary-700 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-800"
                  >
                    Reintentar
                  </button>
                )}
                <Link href="/visas" className="text-sm text-neutral-500 hover:underline">
                  Volver a Visas
                </Link>
              </div>
            </>
          )}

          {Object.keys(details).length > 0 && (
            <div className="mt-6 border-t border-neutral-200 pt-4 text-left">
              <h3 className="text-sm! font-semibold text-neutral-700 mb-3">Detalles de la transacción</h3>
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
            <svg className="h-10 w-10 animate-spin text-primary-700 mx-auto" viewBox="0 0 24 24" fill="none">
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
