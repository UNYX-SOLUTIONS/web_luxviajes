'use client';

import { XMarkIcon, ChatBubbleLeftIcon, PhoneIcon, VideoCameraIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';

interface ContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber?: string;
  phoneNumber?: string;
  videoCallUrl?: string;
}

export function ContactDialog({
  isOpen,
  onClose,
  whatsappNumber = '593964220600',
  phoneNumber = '+593964220600',
  videoCallUrl = '/contact',
}: ContactDialogProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  // Deshabilitar scroll cuando el dialog está abierto y prevenir scroll jump
  useEffect(() => {
    if (isOpen) {
      // Calcular el ancho de la scrollbar
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Guardar estilos originales
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      
      // Aplicar nuevos estilos
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      
      // Cleanup
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const contactOptions = [
    {
      id: 'whatsapp',
      icon: ChatBubbleLeftIcon,
      title: 'WhatsApp',
      description: 'Mensaje instantáneo',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      action: () => {
        window.open(`https://wa.me/${whatsappNumber}`, '_blank');
        handleClose();
      },
    },
    {
      id: 'call',
      icon: PhoneIcon,
      title: 'Llamada',
      description: 'Habla directamente',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      action: () => {
        window.location.href = `tel:${phoneNumber}`;
        handleClose();
      },
    },
    {
      id: 'video',
      icon: VideoCameraIcon,
      title: 'Videollamada',
      description: 'Cara a cara',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      action: () => {
        window.location.href = videoCallUrl;
        handleClose();
      },
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[999] bg-black transition-opacity duration-200 ${
          isClosing ? 'opacity-0' : 'opacity-50'
        }`}
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <div
          className={`relative w-full max-w-md rounded-3xl bg-white shadow-2xl transition-all duration-200 ${
            isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition"
            aria-label="Cerrar"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {/* Header */}
          <div className="border-b border-neutral-200 px-6 pt-6 pb-4">
            <h4 className="text-2xl font-bold text-neutral-900">¿Cómo prefieres contactarnos?</h4>
            <p className="mt-2 text-sm text-neutral-600">
              Elige la opción que mejor se adapte a ti
            </p>
          </div>

          {/* Options */}
          <div className="p-6 space-y-3">
            {contactOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={option.action}
                  className={`w-full p-4 rounded-2xl border-2 border-transparent transition-all duration-200 ${option.bgColor} ${option.textColor} hover:border-current hover:shadow-md group`}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon Container */}
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${option.color} ${option.hoverColor} transition-all duration-200 text-white shadow-md group-hover:shadow-lg`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-left">
                      <h5 className="font-bold text-neutral-900">{option.title}</h5>
                      <p className="text-sm text-neutral-600">{option.description}</p>
                    </div>

                    {/* Arrow */}
                    <div className="text-neutral-400 group-hover:text-neutral-900 transition-colors">
                      <svg
                        className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
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
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="border-t border-neutral-200 px-6 py-4 text-center">
            <p className="text-xs text-neutral-500">
              Disponible 24/7 • Respuesta rápida garantizada
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
