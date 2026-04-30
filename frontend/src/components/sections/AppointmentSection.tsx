"use client";

import { useState, useEffect } from "react";
import { AppointmentBase, AppointmentSource } from "../common/AppointmentBase";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface FormData {
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  promociones: boolean;
}

interface AppointmentWebhookPayload {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  appointment_date: string;
  receivePromotion: boolean;
  source: AppointmentSource;
}

const APPOINTMENT_WEBHOOK_URL =
  "https://flow.agencialuxviajes.com/webhook/de1e3a16-857f-48ec-a863-3eaf2aed41cc";

interface AppointmentSectionProps {
  citaTitulo?: string;
  citaSubtitulo?: string;
  citaUrgencia?: string;
}

/**
 * Parsea texto con formato markdown-like:
 * - *texto* se convierte en <span className="text-primary-600">texto</span>
 * - Soporta saltos de línea
 */
function parseStyledText(text: string): string {
  if (!text) return "";

  // Reemplazar *texto* con span coloreado
  let parsed = text.replace(
    /\*([^*]+)\*/g,
    '<span class="text-primary-600">$1</span>',
  );

  // Convertir <br> y <br/> a <br /> válido
  parsed = parsed.replace(/<br\s*\/?>/gi, "<br />");

  // Convertir \n en <br />
  parsed = parsed.replace(/\n/g, "<br />");

  return parsed;
}

export function AppointmentSection({
  citaTitulo,
  citaSubtitulo,
  citaUrgencia,
}: AppointmentSectionProps = {}) {
  // Este componente ahora solo es un wrapper, no necesita su propia lógica de estado
  // porque AppointmentBase ya maneja todo internamente

  return (
    <section id="Agendar-Cita" className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4 text-primary-900"
            dangerouslySetInnerHTML={{
              __html: parseStyledText(citaTitulo || "Agendar Cita"),
            }}
          />
          <p
            className="text-lg text-neutral-700 max-w-2xl mx-auto"
            dangerouslySetInnerHTML={{
              __html: parseStyledText(
                citaSubtitulo ||
                  "Selecciona la fecha y hora que mejor se adapte a tu disponibilidad",
              ),
            }}
          />
        </div>

        <AppointmentBase
          showUrgencia={true}
          citaUrgencia={citaUrgencia}
          isDialogMode={false}
          appointmentSource={AppointmentSource.CALENDAR}
        />
      </div>
    </section>
  );
}