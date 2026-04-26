'use client';

import { XMarkIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import { useRedSocial } from '@/hooks';

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

interface AppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppointmentDialog({ isOpen, onClose }: AppointmentDialogProps) {
  const { data: redes } = useRedSocial();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    promociones: false,
  });

  const timeSlots: TimeSlot[] = [
    { id: '1', time: '09:00', available: true },
    { id: '2', time: '10:00', available: true },
    { id: '3', time: '11:00', available: false },
    { id: '4', time: '12:00', available: true },
    { id: '5', time: '14:00', available: true },
    { id: '6', time: '15:00', available: true },
    { id: '7', time: '16:00', available: false },
    { id: '8', time: '17:00', available: true },
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
  const monthName = currentMonth.toLocaleString('es-ES', {
    month: 'long',
    year: 'numeric',
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
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = () => {
    const { nombre, apellido, telefono, correo } = formData;
    if (!nombre || !apellido || !telefono || !correo) {
      alert('Por favor completa todos los campos');
      return;
    }

    const formattedDate = selectedDate!.toLocaleDateString('es-ES');
    const whatsappMessage = `Hola, me gustaría agendar una cita para el ${formattedDate} a las ${selectedTime}\n\nDatos:\nNombre: ${nombre} ${apellido}\nTeléfono: ${telefono}\nCorreo: ${correo}\nRecibir promociones: ${formData.promociones ? 'Sí' : 'No'}`;
    const whatsappNumber = redes?.whatsapp?.replace(/[^0-9]/g, '') || "593964220600";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    setShowModal(false);
    handleClose();
  };

  // Controlar scroll del body cuando el dialog está abierto
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      return () => {
        document.body.style.overflow = 'unset';
        document.body.style.paddingRight = 'unset';
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    setSelectedDate(null);
    setSelectedTime(null);
    setShowModal(false);
    setFormData({
      nombre: '',
      apellido: '',
      telefono: '',
      correo: '',
      promociones: false,
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Dialog */}
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
        <div className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl flex flex-col max-h-[90vh] z-[1000] overflow-hidden">
          {/* Header */}
          <div className="shrink-0 border-b border-neutral-200 bg-white px-8 py-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-neutral-900">Agenda tu cita con nosotros</h2>
            <button
              onClick={handleClose}
              className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-8">
            <p className="text-lg text-neutral-700 mb-8">
              Selecciona la fecha y hora que mejor se adapte a tu disponibilidad
            </p>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Calendar */}
              <div className="bg-neutral-50 p-6 rounded-2xl shadow-md h-fit">
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
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'].map(
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
                          ${!date ? 'invisible' : ''}
                          ${date && isDateDisabled(date) ? 'text-neutral-300 cursor-not-allowed' : ''}
                          ${
                            selectedDate &&
                            date &&
                            date.toDateString() === selectedDate.toDateString()
                              ? 'bg-primary-600 text-white'
                              : date && !isDateDisabled(date)
                                ? 'bg-neutral-200 hover:bg-primary-200 text-neutral-900'
                                : ''
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
                      Fecha seleccionada:{' '}
                      <span className="font-semibold text-primary-900">
                        {selectedDate.toLocaleDateString('es-ES', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Time Selection */}
              <div className="flex flex-col h-fit">
                <div className="mb-8 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex-shrink-0">
                    Selecciona una hora
                  </h3>

                  {selectedDate ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
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
                                ? 'bg-primary-600 text-white shadow-lg'
                                : slot.available
                                  ? 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                                  : 'bg-neutral-100 text-neutral-400 cursor-not-allowed opacity-50'
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
                <div className="bg-primary-50 p-6 rounded-2xl border border-primary-200 flex-shrink-0 mt-4">
                  <button
                    onClick={handleOpenModal}
                    disabled={!selectedDate || !selectedTime}
                    className={`
                      w-full py-3 rounded-lg font-semibold transition
                      ${
                        selectedDate && selectedTime
                          ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg'
                          : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                      }
                    `}
                  >
                    Agendar Cita
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[1001]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                Completa tu información
              </h3>
              <p className="text-neutral-600">
                Para confirmar tu cita, por favor completa los siguientes datos
              </p>
            </div>

            {/* Resumen de cita */}
            <div className="bg-primary-50 p-4 rounded-lg border border-primary-200 mb-6">
              <p className="text-sm text-neutral-600 mb-2">
                Resumen de tu cita:
              </p>
              <p className="font-semibold text-neutral-900">
                {selectedDate?.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}{' '}
                a las {selectedTime}
              </p>
            </div>

            {/* Formulario */}
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

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 px-4 border border-neutral-300 rounded-lg text-neutral-700 font-medium hover:bg-neutral-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
              >
                Confirmar Cita
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
