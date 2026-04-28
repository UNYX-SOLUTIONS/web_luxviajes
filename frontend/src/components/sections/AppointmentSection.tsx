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
  source: string;
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
        />
      </div>
    </section>
  );
}
