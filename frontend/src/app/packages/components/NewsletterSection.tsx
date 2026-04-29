"use client";

import { AppointmentSource } from "@/components/common/AppointmentBase";
import { useState } from "react";



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

interface NewsletterSectionProps {
  titulo?: string;
  descripcion?: string;
}

export function NewsletterSection({
  titulo = "Únete a nuestra comunidad luxviajes VIP",
  descripcion = "Suscríbete a nuestro boletín para recibir ofertas exclusivas, consejos de viaje y las últimas novedades directamente en tu bandeja de entrada.",
}: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
      }, 5000);
      
    } catch (error) {
      console.error("Error al enviar suscripción:", error);
      setMessage({ type: "error", text: "Hubo un error al procesar tu suscripción. Por favor intenta nuevamente." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-primary-700 py-16 text-white">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h3
          className="text-4xl font-bold"
          dangerouslySetInnerHTML={{ __html: parseStyledText(titulo) }}
        />
        <p
          className="mx-auto mt-3 max-w-2xl text-white!"
          dangerouslySetInnerHTML={{ __html: parseStyledText(descripcion) }}
        />

        <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu correo electronico"
            disabled={isSubmitting}
            className="h-12 flex-1 rounded-full border border-white/20 bg-white px-5 text-sm text-neutral-800 placeholder:text-neutral-600 outline-none focus:border-white/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 rounded-full bg-primary-50 px-7 text-sm font-semibold text-primary-800 transition hover:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Enviando..." : "Suscribirme"}
          </button>
        </form>

        {/* Mensaje de feedback */}
        {message && (
          <div
            className={`mt-4 rounded-lg p-3 text-sm ${
              message.type === "success"
                ? "bg-green-500/20 text-green-200"
                : "bg-red-500/20 text-red-200"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </section>
  );
}