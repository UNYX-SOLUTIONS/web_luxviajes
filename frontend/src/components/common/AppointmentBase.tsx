"use client";

import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { UrgencyFormModal } from "./UrgencyFormModal";
import {
  AppointmentCalendar,
  getAvailableTimeSlots,
} from "./AppointmentCalendar";

// Enum para los tipos de origen de la cita
export enum AppointmentSource {
  CALENDAR = "calendar",
  VIDEOLLAMADA = "videocall",
  URGENCY = "urgency",
  MAIL_MARKETING = "mailMarketing",
  CONTACT_FORM = "contactForm",
  BOUGHT = "bought",
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

export const APPOINTMENT_WEBHOOK_URL =
  "https://flow.agencialuxviajes.com/webhook/de1e3a16-857f-48ec-a863-3eaf2aed41cc";

export interface AppointmentBaseRef {
  openUrgencyModal: () => void;
}

interface AppointmentBaseProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isDialogMode?: boolean;
  appointmentSource?: AppointmentSource;
  selectionOnly?: boolean;
  onSelect?: (date: Date, time: string) => void;
}

function parseStyledText(text: string): string {
  if (!text) return "";
  let parsed = text.replace(
    /\*([^*]+)\*/g,
    '<span class="text-primary-600">$1</span>',
  );
  parsed = parsed.replace(/<br\s*\/?>/gi, "<br />");
  parsed = parsed.replace(/\n/g, "<br />");
  return parsed;
}

// Función para obtener la fecha local en formato ISO con offset (2026-05-05T09:00:00-05:00)
export function getLocalISOStringFromDate(date: Date, time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const dateWithTime = new Date(date);
  dateWithTime.setHours(hours, minutes, 0, 0);

  const offset = -dateWithTime.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offset) / 60);
  const offsetMinutes = Math.abs(offset) % 60;
  const offsetSign = offset >= 0 ? "+" : "-";

  const year = dateWithTime.getFullYear();
  const month = String(dateWithTime.getMonth() + 1).padStart(2, "0");
  const day = String(dateWithTime.getDate()).padStart(2, "0");
  const hourStr = String(dateWithTime.getHours()).padStart(2, "0");
  const minuteStr = String(dateWithTime.getMinutes()).padStart(2, "0");
  const secondStr = String(dateWithTime.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hourStr}:${minuteStr}:${secondStr}${offsetSign}${String(offsetHours).padStart(2, "0")}:${String(offsetMinutes).padStart(2, "0")}`;
}

export const AppointmentBase = forwardRef<
  AppointmentBaseRef,
  AppointmentBaseProps
>(
  (
    {
      onSuccess,
      onCancel,
      isDialogMode = false,
      appointmentSource = AppointmentSource.CALENDAR,
      selectionOnly = false,
      onSelect,
    },
    ref,
  ) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showUrgencyModal, setShowUrgencyModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
      nombre: "",
      apellido: "",
      telefono: "",
      correo: "",
      promociones: false,
    });

    // Exponer la función para abrir el modal de urgencia
    useImperativeHandle(ref, () => ({
      openUrgencyModal: () => {
        setShowUrgencyModal(true);
      },
    }));

    const handleDateSelect = (date: Date) => {
      setSelectedDate(date);
      setSelectedTime(null);
    };

    const handleTimeSelect = (time: string) => {
      if (selectedDate) {
        const slots = getAvailableTimeSlots(selectedDate, {});
        const slot = slots.find((s) => s.time === time);
        if (slot?.available) {
          setSelectedTime(time);
        }
      }
    };

    const handleOpenModal = () => {
      if (selectedDate && selectedTime) {
        if (selectionOnly) {
          onSelect?.(selectedDate, selectedTime);
          return;
        }
        const slots = getAvailableTimeSlots(selectedDate, {});
        const slot = slots.find((s) => s.time === selectedTime);
        if (slot?.available) {
          setShowModal(true);
        } else {
          alert(
            "Este horario ya no está disponible. Por favor selecciona otro.",
          );
          setSelectedTime(null);
        }
      }
    };

    const handleCloseModal = () => {
      setShowModal(false);
    };

    const handleCloseUrgencyModal = () => {
      setShowUrgencyModal(false);
    };

    useEffect(() => {
      if (showModal) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      return () => {
        document.body.style.overflow = "";
      };
    }, [showModal]);

    const handleFormChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      const { name, value } = e.target;
      const nextValue =
        e.target instanceof HTMLInputElement && e.target.type === "checkbox"
          ? e.target.checked
          : value;
      setFormData((prev) => ({ ...prev, [name]: nextValue }));
    };

    const handleSubmit = async () => {
      const { nombre, apellido, telefono, correo, promociones } = formData;
      if (!nombre || !apellido || !telefono || !correo) {
        alert("Por favor completa los campos obligatorios");
        return;
      }

      if (!selectedDate || !selectedTime) {
        alert("Selecciona fecha y hora para la cita");
        return;
      }

      const slots = getAvailableTimeSlots(selectedDate, {});
      const selectedSlot = slots.find((s) => s.time === selectedTime);
      if (!selectedSlot?.available) {
        alert(
          "Lo sentimos, este horario ya no está disponible. Por favor selecciona otro.",
        );
        setSelectedTime(null);
        setShowModal(false);
        return;
      }

      let currentSource = appointmentSource;
      if (isDialogMode) {
        currentSource = AppointmentSource.CALENDAR;
      }

      // Usar el mismo formato ISO para appointment_date
      const isoDateString = getLocalISOStringFromDate(
        selectedDate,
        selectedTime,
      );

      const payload: AppointmentWebhookPayload = {
        name: nombre,
        lastName: apellido,
        email: correo,
        phone: telefono,
        appointment_date: isoDateString, // Ahora usa el formato ISO
        receivePromotion: promociones,
        source: currentSource,
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
          throw new Error(
            `Webhook respondió con estado ${response.status}: ${errorText}`,
          );
        }
        alert("Cita procesada correctamente");
        setShowModal(false);
        if (onSuccess) onSuccess();
        setFormData({
          nombre: "",
          apellido: "",
          telefono: "",
          correo: "",
          promociones: false,
        });
        setSelectedDate(null);
        setSelectedTime(null);
      } catch (error) {
        console.error("Error al enviar cita al webhook:", error);
        alert(
          "Hubo un error al procesar tu solicitud. Por favor intenta nuevamente.",
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <>
        <AppointmentCalendar
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onDateSelect={handleDateSelect}
          onTimeSelect={handleTimeSelect}
          isDialogMode={isDialogMode}
        />

        <div className="bg-primary-50 p-6 rounded-2xl border border-primary-200 shrink-0 mt-4">
          <button
            onClick={handleOpenModal}
            disabled={!selectedDate || !selectedTime}
            className={`w-full py-3 rounded-lg font-semibold transition ${selectedDate && selectedTime ? "bg-primary-600 hover:bg-primary-700 text-white shadow-lg" : "bg-neutral-300 text-neutral-500 cursor-not-allowed"}`}
            >
              {selectionOnly ? "Confirmar cita" : "Agendar Cita"}
            </button>
        </div>

        {/* Modal para cita normal con calendario */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-1001">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full flex flex-col max-h-[90vh]">
              <div className="px-6 pt-6 shrink-0 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl! font-bold text-neutral-900 mb-2">
                    Completa tu información
                  </h3>
                  <p className="text-neutral-600">
                    Para confirmar tu cita, por favor completa los siguientes
                    datos
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
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

              <div className="mx-6 mt-4 shrink-0 bg-primary-50 p-4 rounded-lg border border-primary-200">
                <p className="text-sm! text-neutral-600 mb-2">
                  Resumen de tu cita:
                </p>
                <p className="font-semibold text-neutral-900">
                  {selectedDate?.toLocaleDateString("es-ES", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}{" "}
                  a las {selectedTime}
                </p>
              </div>

              <div className="overflow-y-auto flex-1 px-6 mt-4">
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm! font-medium text-neutral-700 mb-2">
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
                    <label className="block text-sm! font-medium text-neutral-700 mb-2">
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
                    <label className="block text-sm! font-medium text-neutral-700 mb-2">
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
                    <label className="block text-sm! font-medium text-neutral-700 mb-2">
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
                      className="ml-3 text-sm! text-neutral-700"
                    >
                      Deseo recibir promociones y descuentos en mi correo
                    </label>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 shrink-0 border-t border-neutral-100 flex gap-3">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 py-2 px-4 border border-neutral-300 rounded-lg text-neutral-700 font-medium hover:bg-neutral-50 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Enviando..." : "Confirmar Cita"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de urgencia reutilizable */}
        <UrgencyFormModal
          isOpen={showUrgencyModal}
          onClose={handleCloseUrgencyModal}
          onSuccess={onSuccess}
          appointmentSource={AppointmentSource.URGENCY}
        />
      </>
    );
  },
);

AppointmentBase.displayName = "AppointmentBase";
