"use client";

import React, { useState, useEffect } from "react";
import { UserIcon, PhoneIcon, EnvelopeIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface ProfileFormProps {
  nombre: string;
  telefono: string;
  email: string;
  onSave: (fields: { nombre: string; telefono: string }) => Promise<void>;
  isSaving: boolean;
}

export function ProfileForm({ nombre, telefono, email, onSave, isSaving }: ProfileFormProps) {
  const [formData, setFormData] = useState({ nombre, telefono });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData({ nombre, telefono });
  }, [nombre, telefono]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.nombre.trim()) {
      e.nombre = "El nombre es requerido";
    } else if (formData.nombre.trim().length < 2) {
      e.nombre = "Mínimo 2 caracteres";
    } else if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(formData.nombre)) {
      e.nombre = "Solo letras y espacios";
    }

    if (formData.telefono && !/^[0-9+]+$/.test(formData.telefono)) {
      e.telefono = "Solo números y (+)";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave({ nombre: formData.nombre.trim(), telefono: formData.telefono.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          Nombre completo
        </label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, nombre: e.target.value }));
              setErrors((prev) => ({ ...prev, nombre: "" }));
            }}
            disabled={isSaving}
            className={`w-full pl-10 pr-4 py-2.5 border rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 ${
              errors.nombre
                ? "border-red-300 focus:ring-red-200"
                : "border-neutral-300 focus:ring-primary-200 focus:border-primary-500"
            }`}
            placeholder="Tu nombre completo"
          />
        </div>
        {errors.nombre && (
          <p className="mt-1 text-red-500 text-xs flex items-center gap-1">
            <XCircleIcon className="h-3.5 w-3.5" />{errors.nombre}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          Teléfono
        </label>
        <div className="relative">
          <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <input
            type="tel"
            value={formData.telefono}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, telefono: e.target.value }));
              setErrors((prev) => ({ ...prev, telefono: "" }));
            }}
            disabled={isSaving}
            className={`w-full pl-10 pr-4 py-2.5 border rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 ${
              errors.telefono
                ? "border-red-300 focus:ring-red-200"
                : "border-neutral-300 focus:ring-primary-200 focus:border-primary-500"
            }`}
            placeholder="0999123456"
          />
        </div>
        {errors.telefono && (
          <p className="mt-1 text-red-500 text-xs flex items-center gap-1">
            <XCircleIcon className="h-3.5 w-3.5" />{errors.telefono}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          Correo electrónico
        </label>
        <div className="relative">
          <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <input
            type="email"
            value={email}
            disabled
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-xl bg-neutral-50 text-neutral-500 cursor-not-allowed"
          />
        </div>
        <p className="mt-1 text-xs text-neutral-500">
          El email no puede ser cambiado.
        </p>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Guardando...
          </span>
        ) : (
          "Guardar cambios"
        )}
      </button>
    </form>
  );
}
