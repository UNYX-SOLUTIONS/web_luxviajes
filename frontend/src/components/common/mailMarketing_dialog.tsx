"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AppointmentSource } from "./AppointmentBase";

interface NewsletterSubscriptionPayload {
  email: string;
  source: AppointmentSource;
}

const NEWSLETTER_WEBHOOK_URL =
  "https://flow.agencialuxviajes.com/webhook/de1e3a16-857f-48ec-a863-3eaf2aed41cc";

function parseStyledText(text: string): string {
  let parsed = text.replace(
    /\*([^*]+)\*/g,
    '<span class="text-primary-300">$1</span>',
  );
  parsed = parsed.replace(/<br\s*\/?>/gi, "<br />");
  parsed = parsed.replace(/\n/g, "<br />");
  return parsed;
}

interface MailMarketingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  titulo?: string;
  descripcion?: string;
}

export function MailMarketingDialog({
  isOpen,
  onClose,
  titulo = "Únete a nuestra comunidad luxviajes VIP",
  descripcion = "Suscríbete a nuestro boletín para recibir ofertas exclusivas, consejos de viaje y las últimas novedades directamente en tu bandeja de entrada.",
}: MailMarketingDialogProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [shouldShowDialog, setShouldShowDialog] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sincronizar el estado interno con la prop isOpen
  useEffect(() => {
    if (isOpen) {
      setShouldShowDialog(true);
      // Triggerear animación con un pequeño delay para que CSS lo capte
      setTimeout(() => setIsAnimating(true), 10);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShouldShowDialog(false);
      onClose();
    }, 300); // Duración de la animación de cierre
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar email
    if (!email || !email.includes("@") || !email.includes(".")) {
      setMessage({ type: "error", text: "Por favor ingresa un correo electrónico válido" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const payload: NewsletterSubscriptionPayload = {
        email: email,
        source: AppointmentSource.MAIL_MARKETING,
      };

      const response = await fetch(NEWSLETTER_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook respondió con estado ${response.status}`);
      }

      // Éxito
      setMessage({ type: "success", text: "¡Gracias por suscribirte! Revisa tu correo para confirmar la suscripción." });
      setEmail(""); // Limpiar el campo
      
      setTimeout(() => {
        setMessage(null);
        handleClose();
      }, 3000);
      
    } catch (error) {
      console.error("Error al enviar suscripción:", error);
      setMessage({ type: "error", text: "Hubo un error al procesar tu suscripción. Por favor intenta nuevamente." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!shouldShowDialog) return null;

  return (
    <>
      {/* Backdrop con fade */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Dialog con fade y scale suave */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none transition-all duration-300 ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div
          className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-r from-primary-600 to-primary-800 shadow-2xl overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute right-6 top-6 z-10 rounded-full bg-white/20 p-2 hover:bg-white/30 transition backdrop-blur-sm"
            aria-label="Cerrar diálogo"
          >
            <XMarkIcon className="h-6 w-6 text-white!" />
          </button>

          {/* Content */}
          <div className="px-8 py-12 text-center text-white! sm:px-12 sm:py-16">
          <h3
            className="text-3xl sm:text-4xl font-bold"
            dangerouslySetInnerHTML={{ __html: parseStyledText(titulo) }}
          />
          <p
            className="mx-auto mt-4 max-w-xl text-white/95! text-sm sm:text-base"
            dangerouslySetInnerHTML={{ __html: parseStyledText(descripcion) }}
          />

          <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu correo electronico"
              disabled={isSubmitting}
              className="h-12 flex-1 rounded-full border border-white/20 bg-white px-5 text-sm text-neutral-800 placeholder:text-neutral-600 outline-none focus:border-white/50 focus:bg-white/95 disabled:opacity-50 transition"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 rounded-full bg-primary-50! px-8 text-sm font-semibold text-primary-800 transition hover:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isSubmitting ? "Enviando..." : "Suscribirme"}
            </button>
          </form>

          {/* Mensaje de feedback */}
          {message && (
              <div
                className={`mt-6 rounded-lg p-4 text-sm font-medium ${
                  message.type === "success"
                    ? "bg-green-500/20 text-green-100 border border-green-400/30"
                    : "bg-red-500/20 text-red-100 border border-red-400/30"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
    );
}
