"use client";

import { useState, useEffect, useRef } from "react";
import {
  AppointmentBase,
  AppointmentSource,
  AppointmentBaseRef,
} from "../common/AppointmentBase";

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

/**
 * Agrega asteriscos a la frase de la asesoría para que sea pintada por parseStyledText
 */
function formatUrgencyText(text: string): string {
  if (!text) return "";
  // Si ya tiene asteriscos, no hacer nada
  if (text.includes("*")) return text;

  // Buscar la frase "Agenda una asesoría en vivo" (o variaciones con/sin acento o saltos de línea)
  const regex = /(agenda una asesor[ií]a\s*(?:<br\s*\/?>)?\s*en vivo)/gi;
  return text.replace(regex, "*$1*");
}

export function AppointmentSection({
  citaTitulo,
  citaSubtitulo,
  citaUrgencia,
}: AppointmentSectionProps = {}) {
  const appointmentRef = useRef<AppointmentBaseRef>(null);

  return (
    <section id="Agendar-Cita" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-primary-900"
            dangerouslySetInnerHTML={{
              __html: parseStyledText(
                citaTitulo ||
                  "Selecciona el día y la hora en la que tu asesora se contactará contigo para despejarte todas tus dudas",
              ),
            }}
          />
          <p
            className="text-sm sm:text-base md:text-lg text-neutral-700 max-w-4xl mx-auto px-2"
            dangerouslySetInnerHTML={{
              __html: parseStyledText(
                citaSubtitulo || "Selecciona el dia y la hora",
              ),
            }}
          />
        </div>

        <AppointmentBase
          ref={appointmentRef}
          isDialogMode={false}
          appointmentSource={AppointmentSource.CALENDAR}
        />

        <div className="my-8 sm:my-12 text-center">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-primary-900"
            dangerouslySetInnerHTML={{
              __html: parseStyledText("Te contactamos en menos de 10 minutos"), // __html: parseStyledText(citaTitulo || "Agendar Cita"),
            }}
          />
          <p
            className="text-sm sm:text-base md:text-lg text-neutral-700 max-w-4xl mx-auto px-2 mb-8"
            dangerouslySetInnerHTML={{
              __html: parseStyledText(
                "¿No puedes visitarnos en oficinas? En menos de 10 minutos podemos estar contigo en videollamada organizando tu viaje soñado. Programa tu reunión ahora mismo!!",
              ),
            }}
          />

          <div className="w-full max-w-md bg-neutral-50 p-6 rounded-2xl border border-neutral-200 flex items-center justify-center mx-auto">
            <button
              onClick={() => appointmentRef.current?.openUrgencyModal()}
              className="w-full py-3 rounded-lg border border-primary-600 text-neutral-900 font-semibold hover:bg-primary-50 transition"
              dangerouslySetInnerHTML={{
                __html: parseStyledText(
                  formatUrgencyText(
                    citaUrgencia ||
                      "¿No quieres esperar? Agenda una asesoría<br />en vivo y en 10 minutos te contactamos",
                  ),
                ),
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
