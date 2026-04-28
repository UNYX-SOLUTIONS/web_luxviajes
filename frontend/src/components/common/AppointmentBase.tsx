"use client";

import { useState, useEffect, useMemo } from "react";
import { useRedSocial } from "@/hooks";

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
  servicio?: string;
  mensaje?: string;
  promociones: boolean;
}

interface AppointmentWebhookPayload {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  appointment_date: string;
  message: string;
  receivePromotion: boolean;
  source: string;
}

const APPOINTMENT_WEBHOOK_URL =
  "https://flow.agencialuxviajes.com/webhook/de1e3a16-857f-48ec-a863-3eaf2aed41cc";

interface AppointmentBaseProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  showUrgencia?: boolean;
  citaUrgencia?: string;
  isDialogMode?: boolean;
}

/**
 * Parsea texto con formato markdown-like:
 * - *texto* se convierte en <span className="text-primary-600">texto</span>
 * - Soporta saltos de línea
 */
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

export function AppointmentBase({
  onSuccess,
  showUrgencia = false,
  citaUrgencia,
  isDialogMode = false,
}: AppointmentBaseProps) {
  const { data: redes } = useRedSocial();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    servicio: "",
    mensaje: "",
    promociones: false,
  });

  // Función para obtener horarios ya reservados desde el backend
  const fetchBookedSlots = async (date: Date) => {
    try {
      const dateKey = date.toISOString().split('T')[0];
      
      // Si ya tenemos los horarios en caché, no los solicitamos de nuevo
      if (bookedSlots[dateKey]) return;
      
      // Aquí deberías reemplazar con tu endpoint real
      // const response = await fetch(`/api/appointments/booked?date=${dateKey}`);
      // const data = await response.json();
      
      // Simulamos una respuesta del backend (reemplazar con llamada real)
      const mockBookedSlots: Record<string, string[]> = {
        // Ejemplo de horarios ya reservados para fechas específicas
        // "2024-12-15": ["10:00", "14:30"],
        // "2024-12-16": ["11:00", "15:30"],
      };
      
      setBookedSlots(prev => ({
        ...prev,
        [dateKey]: mockBookedSlots[dateKey] || []
      }));
    } catch (error) {
      console.error("Error al obtener horarios reservados:", error);
      setBookedSlots(prev => ({
        ...prev,
        [date.toISOString().split('T')[0]]: []
      }));
    }
  };

  // Función para generar horarios dinámicamente basados en la fecha seleccionada
  const getAvailableTimeSlots = useMemo(() => {
    return (date: Date | null): TimeSlot[] => {
      if (!date) return [];

      const now = new Date();
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const isToday = selectedDate.getTime() === today.getTime();
      const dateKey = date.toISOString().split('T')[0];
      const bookedForDate = bookedSlots[dateKey] || [];
      
      // Horarios base (puedes ajustar según necesidades del negocio)
      const baseSlots = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
        "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
      ];
      
      return baseSlots.map((time) => {
        // Verificar si el horario ya está reservado
        let available = !bookedForDate.includes(time);
        
        // Aplicar regla de 30 minutos de anticipación SOLO para hoy
        if (isToday && available) {
          const [hours, minutes] = time.split(":").map(Number);
          const slotTime = new Date();
          slotTime.setHours(hours, minutes, 0, 0);
          
          // Calcular diferencia en minutos
          const diffMinutes = (slotTime.getTime() - now.getTime()) / 1000 / 60;
          
          // Solo disponible si falta más de 30 minutos
          available = diffMinutes > 30;
        }
        
        return {
          id: `${date.toISOString()}-${time}`,
          time,
          available,
        };
      });
    };
  }, [bookedSlots]);

  // Efecto para consultar disponibilidad cuando cambia la fecha
  useEffect(() => {
    if (selectedDate) {
      // Resetear hora seleccionada al cambiar fecha
      setSelectedTime(null);
      // Consultar horarios reservados para la fecha seleccionada
      fetchBookedSlots(selectedDate);
    }
  }, [selectedDate]);

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i),
      );
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthName = currentMonth.toLocaleString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateSelect = (date: Date) => {
    if (!isDateDisabled(date)) {
      setSelectedDate(date);
      setSelectedTime(null);
    }
  };

  const handleTimeSelect = (time: string) => {
    // Validar nuevamente disponibilidad antes de seleccionar
    if (selectedDate) {
      const slots = getAvailableTimeSlots(selectedDate);
      const slot = slots.find(s => s.time === time);
      if (slot?.available) {
        setSelectedTime(time);
      }
    }
  };

  const handleOpenModal = () => {
    if (selectedDate && selectedTime) {
      // Validar disponibilidad nuevamente antes de abrir el modal
      const slots = getAvailableTimeSlots(selectedDate);
      const slot = slots.find(s => s.time === selectedTime);
      if (slot?.available) {
        setShowModal(true);
      } else {
        alert("Este horario ya no está disponible. Por favor selecciona otro.");
        setSelectedTime(null);
      }
    }
  };

  const handleCloseModal = () => setShowModal(false);

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
    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const formatAppointmentDate = (date: Date, time: string) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day} ${time}`;
  };

  const handleSubmit = async () => {
    const { nombre, apellido, telefono, correo, servicio, mensaje } = formData;
    if (!nombre || !apellido || !telefono || !correo) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert("Selecciona fecha y hora para la cita");
      return;
    }

    // Validar disponibilidad final antes de enviar
    const slots = getAvailableTimeSlots(selectedDate);
    const selectedSlot = slots.find(s => s.time === selectedTime);
    if (!selectedSlot?.available) {
      alert("Lo sentimos, este horario ya no está disponible. Por favor selecciona otro.");
      setSelectedTime(null);
      setShowModal(false);
      return;
    }

    const formattedDate = selectedDate.toLocaleDateString("es-ES");
    const whatsappMessage = `Hola, me gustaría agendar una cita para el ${formattedDate} a las ${selectedTime}\n\nDatos:\nNombre: ${nombre} ${apellido}\nTeléfono: ${telefono}\nCorreo: ${correo}${servicio ? `\nServicio: ${servicio}` : ""}${mensaje ? `\nMensaje: ${mensaje}` : ""}\nRecibir promociones: ${formData.promociones ? "Sí" : "No"}`;
    const whatsappNumber =
      redes?.whatsapp?.replace(/[^0-9]/g, "") || "593964220600";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    // Intentar Webhook si es el caso
    if (!isDialogMode && APPOINTMENT_WEBHOOK_URL) {
      const payload: AppointmentWebhookPayload = {
        name: nombre,
        lastName: apellido,
        email: correo,
        phone: telefono,
        service: servicio || "Cita General",
        appointment_date: formatAppointmentDate(selectedDate, selectedTime),
        message: mensaje || "Agendado desde la web",
        receivePromotion: formData.promociones,
        source: "calendar",
      };

      try {
        setIsSubmitting(true);
        const response = await fetch(APPOINTMENT_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Webhook respondió con estado ${response.status}`);
        }
      } catch (error) {
        console.error("Error al enviar cita al webhook:", error);
      } finally {
        setIsSubmitting(false);
      }
    }

    // Abrir WhatsApp
    window.open(whatsappUrl, "_blank");

    alert("Cita procesada correctamente");
    setShowModal(false);
    if (onSuccess) onSuccess();

    // Reset form
    setFormData({
      nombre: "",
      apellido: "",
      telefono: "",
      correo: "",
      servicio: "",
      mensaje: "",
      promociones: false,
    });
    setSelectedDate(null);
    setSelectedTime(null);
  };

  // Generar horarios dinámicos basados en la fecha seleccionada
  const timeSlots = useMemo(() => {
    return getAvailableTimeSlots(selectedDate);
  }, [selectedDate, getAvailableTimeSlots]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Calendar */}
        <div
          className={`bg-neutral-50 p-6 rounded-2xl shadow-md h-fit ${isDialogMode ? "" : "max-h-125"}`}
        >
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-neutral-200 rounded-lg transition"
                aria-label="Mes anterior"
              >
                <svg
                  className="w-5 h-5 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h3 className="text-lg font-semibold text-neutral-900 capitalize">
                {monthName}
              </h3>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-neutral-200 rounded-lg transition"
                aria-label="Mes siguiente"
              >
                <svg
                  className="w-5 h-5 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sab"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-neutral-600"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((date, index) => (
                <button
                  key={index}
                  onClick={() => date && handleDateSelect(date)}
                  disabled={!date || isDateDisabled(date)}
                  className={`
                    p-2 rounded-lg text-sm font-medium transition
                    ${!date ? "invisible" : ""}
                    ${date && isDateDisabled(date) ? "text-neutral-300 cursor-not-allowed" : ""}
                    ${
                      selectedDate &&
                      date &&
                      date.toDateString() === selectedDate.toDateString()
                        ? "bg-primary-600 text-white"
                        : date && !isDateDisabled(date)
                          ? "bg-neutral-200 hover:bg-primary-200 text-neutral-900"
                          : ""
                    }
                  `}
                >
                  {date?.getDate()}
                </button>
              ))}
            </div>
          </div>

          {selectedDate && (
            <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
              <p className="text-sm text-neutral-700">
                Fecha seleccionada:{" "}
                <span className="font-semibold text-primary-900">
                  {selectedDate.toLocaleDateString("es-ES", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Time Selection */}
        <div
          className={`flex flex-col h-fit ${isDialogMode ? "" : "max-h-125"}`}
        >
          <div
            className={`mb-8 flex flex-col flex-1 ${isDialogMode ? "" : "overflow-hidden"}`}
          >
            <h3 className="text-lg font-semibold text-neutral-900 mb-4 shrink-0">
              Selecciona una hora
            </h3>

            {selectedDate ? (
              <div
                className={`space-y-3 pr-2 ${isDialogMode ? "max-h-64 overflow-y-auto" : "overflow-y-auto"}`}
              >
                {timeSlots.length > 0 ? (
                  timeSlots.map((slot) => {
                    const isToday = selectedDate && new Date(selectedDate).toDateString() === new Date().toDateString();
                    const [hours, minutes] = slot.time.split(":").map(Number);
                    const slotTime = new Date();
                    slotTime.setHours(hours, minutes, 0, 0);
                    const now = new Date();
                    const minutesUntilSlot = Math.round((slotTime.getTime() - now.getTime()) / 1000 / 60);
                    
                    return (
                      <button
                        key={slot.id}
                        onClick={() => slot.available && handleTimeSelect(slot.time)}
                        disabled={!slot.available}
                        className={`
                          w-full p-4 rounded-lg font-medium transition text-left
                          ${
                            selectedTime === slot.time
                              ? "bg-primary-600 text-white shadow-lg"
                              : slot.available
                                ? "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
                                : "bg-neutral-100 text-neutral-400 cursor-not-allowed opacity-50"
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span>{slot.time}</span>
                          {!slot.available && (
                            <span className="text-xs">
                              {isToday && minutesUntilSlot <= 30 && minutesUntilSlot > 0 
                                ? `Ya no disponible (en ${minutesUntilSlot} min)` 
                                : "No disponible"}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-6 bg-neutral-100 rounded-lg text-center">
                    <p className="text-neutral-600">Cargando horarios...</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 bg-neutral-100 rounded-lg text-center">
                <p className="text-neutral-600">
                  Selecciona una fecha para ver horarios disponibles
                </p>
              </div>
            )}
          </div>

          {/* Booking Summary */}
          <div className="bg-primary-50 p-6 rounded-2xl border border-primary-200 shrink-0 mt-4">
            <button
              onClick={handleOpenModal}
              disabled={!selectedDate || !selectedTime}
              className={`
                w-full py-3 rounded-lg font-semibold transition
                ${
                  selectedDate && selectedTime
                    ? "bg-primary-600 hover:bg-primary-700 text-white shadow-lg"
                    : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                }
              `}
            >
              Agendar Cita
            </button>
          </div>

          {showUrgencia && (
            <div className="mt-4 bg-neutral-50 p-6 rounded-2xl border border-neutral-200 shrink-0">
              <button
                onClick={() => setShowModal(true)}
                className="w-full py-3 rounded-lg border border-primary-600 text-primary-600 font-semibold hover:bg-primary-50 transition"
                dangerouslySetInnerHTML={{
                  __html: parseStyledText(
                    citaUrgencia ||
                      "¿No quieres esperar? Agenda una asesoría<br />en vivo y en 10 minutos te contactamos",
                  ),
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-1001">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full flex flex-col max-h-[90vh]">
            <div className="px-6 pt-6 shrink-0 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">
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
              <p className="text-sm text-neutral-600 mb-2">
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
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Servicio (opcional)
                  </label>
                  <input
                    type="text"
                    name="servicio"
                    value={formData.servicio}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="¿Qué servicio te interesa?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Mensaje (opcional)
                  </label>
                  <textarea
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="¿Alguna pregunta o comentario?"
                    rows={3}
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
    </>
  );
}