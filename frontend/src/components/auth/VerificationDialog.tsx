"use client";

import React, { useState, useEffect, useRef } from "react";
import { XCircleIcon, CheckCircleIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

interface VerificationDialogProps {
  email: string;
  onVerified: (user: { id: string; nombre: string; email: string }) => void;
  onCancel: () => void;
}

export function VerificationDialog({ email, onVerified, onCancel }: VerificationDialogProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleInput = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = code.split("");
    newCode[index] = value;
    const joined = newCode.join("");
    setCode(joined);
    setError(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted);
      pasted.split("").forEach((d, i) => {
        if (inputRefs.current[i]) {
          inputRefs.current[i]!.value = d;
        }
      });
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError("Ingresa el código de 6 dígitos completo");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Código inválido");
        return;
      }

      setSuccess(true);
      setTimeout(() => onVerified(data.user), 800);
    } catch {
      setError("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setError(null);
    setCode("");
    inputRefs.current.forEach((ref) => { if (ref) ref.value = ""; });
    inputRefs.current[0]?.focus();

    try {
      const res = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      setTimeLeft(900);
    } catch {
      setError("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
          <h3 className="text-xl font-bold text-neutral-900 mt-4">¡Verificado!</h3>
          <p className="text-neutral-500 mt-2 text-sm">Cuenta creada exitosamente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-3">
            <EnvelopeIcon className="h-7 w-7 text-primary-700" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Verifica tu email</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Enviamos un código de 6 dígitos a <strong>{email}</strong>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2">
            <XCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-center gap-2 mb-4" onPaste={handlePaste}>
          {Array.from({ length: 6 }).map((_, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              disabled={isLoading}
              value={code[i] || ""}
              onChange={(e) => handleInput(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-11 h-14 text-center text-xl font-bold border-2 border-neutral-300 rounded-xl focus:border-primary-500 focus:outline-none disabled:opacity-50"
            />
          ))}
        </div>

        <div className="text-center mb-6">
          <p className="text-xs text-neutral-500">
            {timeLeft > 0 ? (
              <>El código expira en <span className="font-semibold text-primary-700">{formatTime(timeLeft)}</span></>
            ) : (
              <span className="text-red-500">El código ha expirado</span>
            )}
          </p>
        </div>

        <button
          onClick={handleVerify}
          disabled={isLoading || code.length !== 6}
          className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed mb-3"
        >
          {isLoading ? "Verificando..." : "Verificar código"}
        </button>

        <div className="flex justify-between text-xs">
          <button
            onClick={handleResend}
            disabled={isLoading}
            className="text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
          >
            Reenviar código
          </button>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="text-neutral-500 hover:text-neutral-700 disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
