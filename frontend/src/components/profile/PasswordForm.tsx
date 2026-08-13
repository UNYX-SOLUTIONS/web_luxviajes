"use client";

import React, { useState } from "react";
import { LockClosedIcon, EyeIcon, EyeSlashIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface PasswordFormProps {
  onSave: (currentPassword: string, newPassword: string) => Promise<void>;
  isSaving: boolean;
  onCancel: () => void;
}

export function PasswordForm({ onSave, isSaving, onCancel }: PasswordFormProps) {
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [formData, setFormData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleShow = (field: keyof typeof show) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.currentPassword) e.currentPassword = "Requerida";
    if (!formData.newPassword) e.newPassword = "Requerida";
    else if (formData.newPassword.length < 8) e.newPassword = "Mínimo 8 caracteres";
    else if (!/[A-Z]/.test(formData.newPassword)) e.newPassword = "Debe tener una mayúscula";
    else if (!/[0-9]/.test(formData.newPassword)) e.newPassword = "Debe tener un número";

    if (!formData.confirmPassword) e.confirmPassword = "Requerido";
    else if (formData.newPassword !== formData.confirmPassword) e.confirmPassword = "No coinciden";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave(formData.currentPassword, formData.newPassword);
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setShow({ current: false, new: false, confirm: false });
  };

  const passwordInput = (
    name: keyof typeof formData,
    label: string,
    placeholder: string,
    field: keyof typeof show
  ) => (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1.5">{label}</label>
      <div className="relative">
        <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
        <input
          type={show[field] ? "text" : "password"}
          name={name}
          value={formData[name]}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, [name]: e.target.value }));
            setErrors((prev) => ({ ...prev, [name]: "" }));
          }}
          disabled={isSaving}
          placeholder={placeholder}
          className={`w-full pl-10 pr-12 py-2.5 border rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 ${
            errors[name]
              ? "border-red-300 focus:ring-red-200"
              : "border-neutral-300 focus:ring-primary-200 focus:border-primary-500"
          }`}
        />
        <button
          type="button"
          onClick={() => toggleShow(field)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
        >
          {show[field] ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
        </button>
      </div>
      {errors[name] && (
        <p className="mt-1 text-red-500 text-xs flex items-center gap-1">
          <XCircleIcon className="h-3.5 w-3.5" />{errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Seguridad</h3>
      {passwordInput("currentPassword", "Contraseña actual", "Ingresa tu contraseña", "current")}
      {passwordInput("newPassword", "Nueva contraseña", "Mínimo 8 caracteres", "new")}
      {passwordInput("confirmPassword", "Confirmar contraseña", "Repite tu contraseña", "confirm")}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 bg-primary-700 hover:bg-primary-800 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Actualizando..." : "Cambiar contraseña"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="px-4 py-2.5 border border-neutral-300 text-neutral-600 font-semibold rounded-xl hover:bg-neutral-50 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
