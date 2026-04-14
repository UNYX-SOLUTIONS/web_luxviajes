'use client';

import { useState } from 'react';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export function AppointmentSection() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthName = currentMonth.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
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

  const handleBookAppointment = () => {
    if (selectedDate && selectedTime) {
      const formattedDate = selectedDate.toLocaleDateString('es-ES');
      const whatsappMessage = `Hola, me gustaría agendar una cita para el ${formattedDate} a las ${selectedTime}`;
      const whatsappUrl = `https://wa.me/593984220600?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');
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
          <div className="bg-neutral-50 p-6 rounded-2xl shadow-md">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-neutral-200 rounded-lg transition"
                  aria-label="Mes anterior"
                >
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-lg font-semibold text-neutral-900 capitalize">{monthName}</h3>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-neutral-200 rounded-lg transition"
                  aria-label="Mes siguiente"
                >
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Days of week */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'].map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-neutral-600">
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
          <div>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Selecciona una hora</h3>

              {selectedDate ? (
                <div className="space-y-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => slot.available && handleTimeSelect(slot.time)}
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
                        {!slot.available && <span className="text-xs">No disponible</span>}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-neutral-100 rounded-lg text-center">
                  <p className="text-neutral-600">Selecciona una fecha para ver horarios disponibles</p>
                </div>
              )}
            </div>

            {/* Booking Summary */}
            <div className="bg-primary-50 p-6 rounded-2xl border border-primary-200">
              <h4 className="font-semibold text-neutral-900 mb-4">Resumen de tu cita</h4>
              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-sm text-neutral-600">Fecha</p>
                  <p className="font-semibold text-neutral-900">
                    {selectedDate
                      ? selectedDate.toLocaleDateString('es-ES', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        })
                      : 'No seleccionada'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Hora</p>
                  <p className="font-semibold text-neutral-900">
                    {selectedTime || 'No seleccionada'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleBookAppointment}
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
                Agendar por WhatsApp
              </button>
              <p className="text-xs text-neutral-600 mt-3 text-center">
                Serás redirigido a WhatsApp para confirmar tu cita
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
