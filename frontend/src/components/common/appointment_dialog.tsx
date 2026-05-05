'use client';

import { XMarkIcon } from '@heroicons/react/24/solid';
import { AppointmentBase, AppointmentSource } from './AppointmentBase';

interface AppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppointmentDialog({ isOpen, onClose }: AppointmentDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 p-4 rounded-lg">
      <div className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl flex flex-col max-h-[90vh] z-1000 overflow-hidden">
        {/* Header */}
        <div className="shrink-0 border-b border-neutral-200 bg-white px-8 py-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-neutral-900">Agenda tu cita con nosotros</h2>
          <button
            onClick={onClose}
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

          <AppointmentBase 
            onSuccess={onClose} 
            onCancel={onClose} 
            isDialogMode={true} 
            showUrgencia={false}
            appointmentSource={AppointmentSource.CALENDAR}
          />
        </div>
      </div>
    </div>
  );
}