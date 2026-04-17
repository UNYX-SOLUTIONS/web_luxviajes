"use client";

import { useEffect, useState } from "react";

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
  servicio: string;
  mensaje: string;
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
  source: "web";
}

const APPOINTMENT_WEBHOOK_URL =
  "https://flow.agencialuxviajes.com/webhook-test/de1e3a16-857f-48ec-a863-3eaf2aed41cc";

export function AppointmentSection() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    servicio: "",
    mensaje: "",
    promociones: false,
  });

  const timeSlots: TimeSlot[] = [
    { id: "1", time: "09:00", available: true },
    { id: "2", time: "10:00", available: true },
    { id: "3", time: "11:00", available: false },
    { id: "4", time: "12:00", available: true },
    { id: "5", time: "14:00", available: true },
    { id: "6", time: "15:00", available: true },
    { id: "7", time: "16:00", available: false },
    { id: "8", time: "17:00", available: true },
  ];

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
    setSelectedTime(time);
  };

  const handleOpenModal = () => {
    if (selectedDate && selectedTime) {
      setShowModal(true);
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
    return `${day}/${month}/${year} ${time}`;
  };

  const handleSubmit = async () => {
    const { nombre, apellido, telefono, correo, servicio, mensaje } = formData;
    if (!nombre || !apellido || !telefono || !correo || !servicio || !mensaje) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert("Selecciona fecha y hora para la cita");
      return;
    }

    if (!APPOINTMENT_WEBHOOK_URL) {
      alert("Falta configurar NEXT_PUBLIC_APPOINTMENT_WEBHOOK_URL");
      return;
    }

    const payload: AppointmentWebhookPayload = {
      name: nombre,
      lastName: apellido,
      email: correo,
      phone: telefono,
      service: servicio,
      appointment_date: formatAppointmentDate(selectedDate, selectedTime),
      message: mensaje,
      receivePromotion: formData.promociones,
      source: "web",
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
        throw new Error(`Webhook respondio con estado ${response.status}`);
      }

      alert("Cita enviada correctamente");
      setShowModal(false);
      setFormData({
        nombre: "",
        apellido: "",
        telefono: "",
        correo: "",
        servicio: "",
        mensaje: "",
        promociones: false,
      });
    } catch (error) {
      console.error("Error al enviar cita al webhook:", error);
      alert("No se pudo enviar la cita. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-900">
            Agenda tu cita con nosotros
          </h2>
          <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
            Selecciona la fecha y hora que mejor se adapte a tu disponibilidad
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Calendar */}
          <div className="bg-neutral-50 p-6 rounded-2xl shadow-md h-fit max-h-125">
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
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sab"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-semibold text-neutral-600"
                    >
                      {day}
                    </div>
                  ),
                )}
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
          <div className="flex flex-col h-fit max-h-125">
            <div className="mb-8 flex flex-col flex-1 overflow-hidden">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 shrink-0">
                Selecciona una hora
              </h3>

              {selectedDate ? (
                <div className="space-y-3 overflow-y-auto pr-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() =>
                        slot.available && handleTimeSelect(slot.time)
                      }
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
                          <span className="text-xs">No disponible</span>
                        )}
                      </div>
                    </button>
                  ))}
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
            <div className="bg-primary-50 p-6 rounded-2xl border border-primary-200 shrink-0">
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
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full flex flex-col max-h-[70vh]">
            {/* Header - fijo */}
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

            {/* Resumen de cita - fijo */}
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

            {/* Formulario - scrolleable */}
            <div className="overflow-y-auto flex-1 px-6 mt-4">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="Tu apellido"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="+593 9 8822 0600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Correo
                  </label>
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Servicio
                  </label>
                  <input
                    type="text"
                    name="servicio"
                    value={formData.servicio}
                    onChange={handleFormChange}
                    maxLength={20}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="Asesoría de visa"
                  />
                  <p className="text-xs text-neutral-400 text-right mt-1">
                    {formData.servicio.length}/20
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleFormChange}
                    maxLength={100}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 min-h-24"
                    placeholder="Quiero información para aplicar con mi familia"
                  />
                  <p className="text-xs text-neutral-400 text-right mt-1">
                    {formData.mensaje.length}/100
                  </p>
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

            {/* Botones - fijos abajo */}
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
    </section>
  );
}
