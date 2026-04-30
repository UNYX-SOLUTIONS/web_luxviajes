"use client";

import { useState } from "react";
import { AppointmentSource, APPOINTMENT_WEBHOOK_URL } from "./AppointmentBase";

interface UrgencyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  appointmentSource?: AppointmentSource;
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

// Función para obtener la fecha local en formato ISO con offset (2026-05-05T09:00:00-05:00)
function getLocalISOString(): string {
  const now = new Date();
  const offset = -now.getTimezoneOffset(); // offset en minutos
  const offsetHours = Math.floor(Math.abs(offset) / 60);
  const offsetMinutes = Math.abs(offset) % 60;
  const offsetSign = offset >= 0 ? "+" : "-";
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${String(offsetHours).padStart(2, "0")}:${String(offsetMinutes).padStart(2, "0")}`;
}

export function UrgencyFormModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  appointmentSource = AppointmentSource.URGENCY 
}: UrgencyFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    promociones: false,
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nextValue = e.target.type === "checkbox"
      ? e.target.checked
      : value;
    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const handleSubmit = async () => {
    const { nombre, apellido, telefono, correo, promociones } = formData;
    if (!nombre || !apellido || !telefono || !correo) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

    const payload: AppointmentWebhookPayload = {
      name: nombre,
      lastName: apellido,
      email: correo,
      phone: telefono,
      appointment_date: getLocalISOString(),
      receivePromotion: promociones,
      source: appointmentSource,
    };

    try {
      setIsSubmitting(true);
      const response = await fetch(APPOINTMENT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Webhook respondió con estado ${response.status}: ${errorText}`);
      }
      
      alert("Solicitud de asesoría enviada correctamente");
      setFormData({
        nombre: "",
        apellido: "",
        telefono: "",
        correo: "",
        promociones: false,
      });
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al enviar cita al webhook:", error);
      alert("Hubo un error al procesar tu solicitud. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[1001]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full flex flex-col max-h-[90vh]">
        <div className="px-6 pt-6 shrink-0 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">
              Solicitar Asesoría en Vivo
            </h3>
            <p className="text-neutral-600">
              Déjanos tus datos y en 10 minutos te contactamos para una asesoría personalizada
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
            aria-label="Cerrar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 mt-4">
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="Tu nombre"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Apellido *
              </label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="Tu apellido"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="+593 9 8822 0600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Correo *
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="tu@email.com"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="promociones"
                name="promociones"
                checked={formData.promociones}
                onChange={handleFormChange}
                className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-600"
              />
              <label
                htmlFor="promociones"
                className="ml-3 text-sm text-neutral-700"
              >
                Deseo recibir promociones y descuentos en mi correo
              </label>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 shrink-0 border-t border-neutral-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-neutral-300 rounded-lg text-neutral-700 font-medium hover:bg-neutral-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Enviando..." : "Solicitar Asesoría"}
          </button>
        </div>
      </div>
    </div>
  );
}