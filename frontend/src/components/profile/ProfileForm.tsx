"use client";

import React, { useState, useEffect } from "react";
import { UserIcon, PhoneIcon, EnvelopeIcon, IdentificationIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface ProfileFormProps {
  primerNombre: string;
  apellido: string;
  telefono: string;
  cedula: string;
  direccion: string;
  pais: string;
  email: string;
  onSave: (fields: Record<string, string>) => Promise<void>;
  isSaving: boolean;
}

export function ProfileForm({ primerNombre, apellido, telefono, cedula, direccion, pais, email, onSave, isSaving }: ProfileFormProps) {
  const [formData, setFormData] = useState({ primerNombre, apellido, telefono, cedula, direccion, pais });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData({ primerNombre, apellido, telefono, cedula, direccion, pais });
  }, [primerNombre, apellido, telefono, cedula, direccion, pais]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.primerNombre.trim()) { e.primerNombre = "Requerido"; }
    else if (formData.primerNombre.trim().length < 2) { e.primerNombre = "Mínimo 2 caracteres"; }
    else if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(formData.primerNombre)) { e.primerNombre = "Solo letras y espacios"; }
    if (!formData.apellido.trim()) { e.apellido = "Requerido"; }
    else if (formData.apellido.trim().length < 2) { e.apellido = "Mínimo 2 caracteres"; }
    else if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(formData.apellido)) { e.apellido = "Solo letras y espacios"; }
    if (formData.telefono && !/^[0-9+]+$/.test(formData.telefono)) { e.telefono = "Solo números y (+)"; }
    if (formData.cedula && !/^\d{10}$/.test(formData.cedula)) { e.cedula = "10 dígitos numéricos"; }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave({
      primerNombre: formData.primerNombre.trim(),
      apellido: formData.apellido.trim(),
      telefono: formData.telefono.trim(),
      cedula: formData.cedula.trim(),
      direccion: formData.direccion.trim(),
      pais: formData.pais,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Nombre</label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input type="text" value={formData.primerNombre} onChange={(e) => { setFormData((prev) => ({ ...prev, primerNombre: e.target.value })); setErrors((prev) => ({ ...prev, primerNombre: "" })); }} disabled={isSaving} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 ${errors.primerNombre ? "border-red-300 focus:ring-red-200" : "border-neutral-300 focus:ring-primary-200 focus:border-primary-500"}`} placeholder="Ej: Juan" />
          </div>
          {errors.primerNombre && (<p className="mt-1 text-red-500 text-xs flex items-center gap-1"><XCircleIcon className="h-3.5 w-3.5" />{errors.primerNombre}</p>)}
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Apellido</label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input type="text" value={formData.apellido} onChange={(e) => { setFormData((prev) => ({ ...prev, apellido: e.target.value })); setErrors((prev) => ({ ...prev, apellido: "" })); }} disabled={isSaving} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 ${errors.apellido ? "border-red-300 focus:ring-red-200" : "border-neutral-300 focus:ring-primary-200 focus:border-primary-500"}`} placeholder="Ej: Pérez" />
          </div>
          {errors.apellido && (<p className="mt-1 text-red-500 text-xs flex items-center gap-1"><XCircleIcon className="h-3.5 w-3.5" />{errors.apellido}</p>)}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Cédula</label>
        <div className="relative">
          <IdentificationIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <input type="text" value={formData.cedula} onChange={(e) => { setFormData((prev) => ({ ...prev, cedula: e.target.value })); setErrors((prev) => ({ ...prev, cedula: "" })); }} disabled={isSaving} maxLength={10} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 ${errors.cedula ? "border-red-300 focus:ring-red-200" : "border-neutral-300 focus:ring-primary-200 focus:border-primary-500"}`} placeholder="10 dígitos" />
        </div>
        {errors.cedula && (<p className="mt-1 text-red-500 text-xs flex items-center gap-1"><XCircleIcon className="h-3.5 w-3.5" />{errors.cedula}</p>)}
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Dirección</label>
          <input type="text" value={formData.direccion} onChange={(e) => setFormData((prev) => ({ ...prev, direccion: e.target.value }))} disabled={isSaving} className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors duration-200" placeholder="Calle y ciudad" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">País</label>
          <select value={formData.pais} onChange={(e) => setFormData((prev) => ({ ...prev, pais: e.target.value }))} disabled={isSaving} className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors duration-200">
            <option value="EC">Ecuador</option>
            <option value="CL">Chile</option>
            <option value="US">Estados Unidos</option>
            <option value="AR">Argentina</option>
            <option value="CO">Colombia</option>
            <option value="PE">Perú</option>
            <option value="MX">México</option>
          </select>
        </div>
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
