"use client";

import { useMemo, useState } from "react";

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

const BASE_TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

export function getAvailableTimeSlots(
  date: Date | null,
  bookedSlots: Record<string, string[]>,
): TimeSlot[] {
  if (!date) return [];
  const now = new Date();
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isToday = normalized.getTime() === today.getTime();
  const dateKey = date.toISOString().split("T")[0];
  const bookedForDate = bookedSlots[dateKey] || [];
  return BASE_TIME_SLOTS.map((time) => {
    let available = !bookedForDate.includes(time);
    if (isToday && available) {
      const [hours, minutes] = time.split(":").map(Number);
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);
      const diffMinutes =
        (slotTime.getTime() - now.getTime()) / 1000 / 60;
      available = diffMinutes > 30;
    }
    return {
      id: `${date.toISOString()}-${time}`,
      time,
      available,
    };
  });
}

interface AppointmentCalendarProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  isDialogMode?: boolean;
}

export function AppointmentCalendar({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  isDialogMode = false,
}: AppointmentCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i),
      );
    }
    return days;
  }, [currentMonth]);

  const monthName = currentMonth.toLocaleString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const timeSlots = useMemo(
    () => getAvailableTimeSlots(selectedDate, {}),
    [selectedDate],
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div
        className={`bg-neutral-50 p-6 rounded-2xl shadow-md h-fit ${isDialogMode ? "" : "max-h-125"}`}
      >
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1,
                  ),
                )
              }
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
            <h3 className="text-2xl! font-semibold text-neutral-900 capitalize">
              {monthName}
            </h3>
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                  ),
                )
              }
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
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((date, index) => (
              <button
                key={index}
                onClick={() => date && onDateSelect(date)}
                disabled={!date || isDateDisabled(date)}
                className={`p-2 rounded-lg text-sm font-medium transition ${!date ? "invisible" : ""} ${date && isDateDisabled(date) ? "text-neutral-300 cursor-not-allowed" : ""} ${selectedDate && date && date.toDateString() === selectedDate.toDateString() ? "bg-primary-600 text-white" : date && !isDateDisabled(date) ? "bg-neutral-200 hover:bg-primary-200 text-neutral-900" : ""}`}
              >
                {date?.getDate()}
              </button>
            ))}
          </div>
        </div>
        {selectedDate && (
          <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
            <p className="text-sm! text-neutral-700">
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

      <div
        className={`flex flex-col h-fit ${isDialogMode ? "" : "max-h-125"}`}
      >
        <div
          className={`mb-8 flex flex-col flex-1 ${isDialogMode ? "" : "overflow-hidden"}`}
        >
          <h3 className="text-2xl! font-semibold text-neutral-900 mb-4 shrink-0">
            Selecciona una hora
          </h3>
          {selectedDate ? (
            <div
              className={`space-y-3 pr-2 ${isDialogMode ? "max-h-64 overflow-y-auto" : "overflow-y-auto"}`}
            >
              {timeSlots.length > 0 ? (
                timeSlots.map((slot) => {
                  const isToday =
                    selectedDate &&
                    new Date(selectedDate).toDateString() ===
                      new Date().toDateString();
                  const now = new Date();
                  const [hours, minutes] = slot.time.split(":").map(Number);
                  const slotTime = new Date();
                  slotTime.setHours(hours, minutes, 0, 0);
                  const minutesUntilSlot = Math.round(
                    (slotTime.getTime() - now.getTime()) / 1000 / 60,
                  );
                  return (
                    <button
                      key={slot.id}
                      onClick={() =>
                        slot.available && onTimeSelect(slot.time)
                      }
                      disabled={!slot.available}
                      className={`w-full p-4 rounded-lg font-medium transition text-left ${selectedTime === slot.time ? "bg-primary-600 text-white shadow-lg" : slot.available ? "bg-neutral-100 text-neutral-900 hover:bg-neutral-200" : "bg-neutral-100 text-neutral-400 cursor-not-allowed opacity-50"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{slot.time}</span>
                        {!slot.available && (
                          <span className="text-xs">
                            {isToday &&
                            minutesUntilSlot <= 30 &&
                            minutesUntilSlot > 0
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
      </div>
    </div>
  );
}
