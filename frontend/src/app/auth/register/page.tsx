"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  EnvelopeIcon,
  UserIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth, type User } from "@/lib/auth-context";
import { useHelpData } from "@/hooks";
import { VerificationDialog } from "@/components/auth/VerificationDialog";
import { getSafeRedirect, preserveRedirectParam } from "@/utils/redirect";

interface PasswordStrength {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

function RegisterForm() {
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get("redirect"), "/");
  const { register, updateUser, isLoading, error, clearError } = useAuth();
  const { data: helpData } = useHelpData();

  const [showVerification, setShowVerification] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");

  const [formData, setFormData] = useState({
    primerNombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [validationErrors, setValidationErrors] = useState<{
    primerNombre?: string;
    apellido?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    acceptTerms?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    if (name === "password") {
      validatePasswordStrength(value as string);
    }

    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validatePasswordStrength = (password: string) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const getPasswordStrengthScore = () => {
    const score = Object.values(passwordStrength).filter(Boolean).length;
    if (score <= 2)
      return { text: "Débil", color: "text-red-500", bg: "bg-red-100" };
    if (score <= 3)
      return { text: "Media", color: "text-yellow-500", bg: "bg-yellow-100" };
    if (score <= 4)
      return { text: "Buena", color: "text-blue-500", bg: "bg-blue-100" };
    return { text: "Fuerte", color: "text-green-500", bg: "bg-green-100" };
  };

  const validateForm = () => {
    const errors: typeof validationErrors = {};

    if (!formData.primerNombre.trim()) {
      errors.primerNombre = "El nombre es requerido";
    } else if (formData.primerNombre.trim().length < 2) {
      errors.primerNombre = "Mínimo 2 caracteres";
    } else if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(formData.primerNombre)) {
      errors.primerNombre = "Solo letras y espacios";
    }

    if (!formData.apellido.trim()) {
      errors.apellido = "El apellido es requerido";
    } else if (formData.apellido.trim().length < 2) {
      errors.apellido = "Mínimo 2 caracteres";
    } else if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(formData.apellido)) {
      errors.apellido = "Solo letras y espacios";
    }

    if (!formData.email) {
      errors.email = "Email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email no válido";
    }

    if (!formData.password) {
      errors.password = "Contraseña es requerida";
    } else if (formData.password.length < 8) {
      errors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirmar contraseña es requerido";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!formData.acceptTerms) {
      errors.acceptTerms = "Debes aceptar los términos y condiciones";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await register(
        formData.email,
        formData.primerNombre,
        formData.apellido,
        formData.password,
        formData.confirmPassword,
      );
      setVerifyEmail(result.email);
      setShowVerification(true);
    } catch (err) {
      // Register error
    }
  };

  const handleVerified = (verifiedUser: {
    id: string;
    nombre?: string;
    email: string;
  }) => {
    const user: User = {
      id: verifiedUser.id,
      primerNombre: formData.primerNombre.trim(),
      apellido: formData.apellido.trim(),
      email: verifiedUser.email,
      rol: "USER",
      fotoPerfil: null,
    };
    updateUser(user);
    setShowVerification(false);
    window.location.href = redirectTo;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-50 via-white to-purple-50 px-4 pt-20! pb-10! md:pt-40! md:pb-20!">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Logo y encabezado */}
          <div className="text-center mb-8">
            <h1 className="text-3xl! font-bold text-neutral-900">
              Crear cuenta
            </h1>
            <p className="text-neutral-500 mt-2 text-sm!">
              Únete a Lux Viajes y comienza a planificar tus aventuras
            </p>
          </div>

          {/* Error general */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2">
              <XCircleIcon className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Nombre
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <input
                    type="text"
                    id="primerNombre"
                    name="primerNombre"
                    value={formData.primerNombre}
                    onChange={handleChange}
                    placeholder="Juan"
                    autoComplete="given-name"
                    disabled={isLoading}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 ${validationErrors.primerNombre ? "border-red-300 focus:ring-red-200" : "border-neutral-300 focus:ring-primary-200 focus:border-primary-500"}`}
                  />
                </div>
                {validationErrors.primerNombre && (
                  <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <XCircleIcon className="h-3.5 w-3.5" />
                    {validationErrors.primerNombre}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Apellido
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    placeholder="Pérez"
                    autoComplete="family-name"
                    disabled={isLoading}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 ${validationErrors.apellido ? "border-red-300 focus:ring-red-200" : "border-neutral-300 focus:ring-primary-200 focus:border-primary-500"}`}
                  />
                </div>
                {validationErrors.apellido && (
                  <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <XCircleIcon className="h-3.5 w-3.5" />
                    {validationErrors.apellido}
                  </span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  autoComplete="email"
                  disabled={isLoading}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 ${
                    validationErrors.email
                      ? "border-red-300 focus:ring-red-200"
                      : "border-neutral-300 focus:ring-primary-200 focus:border-primary-500"
                  }`}
                />
              </div>
              {validationErrors.email && (
                <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <XCircleIcon className="h-3.5 w-3.5" />
                  {validationErrors.email}
                </span>
              )}
            </div>

            {/* Contraseña */}
            <div className="form-group">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={isLoading}
                  className={`w-full pl-10 pr-12 py-2.5 border rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 ${
                    validationErrors.password
                      ? "border-red-300 focus:ring-red-200"
                      : "border-neutral-300 focus:ring-primary-200 focus:border-primary-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <XCircleIcon className="h-3.5 w-3.5" />
                  {validationErrors.password}
                </span>
              )}

              {/* Indicador de fuerza de contraseña */}
              {formData.password && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">Fortaleza:</span>
                    <span
                      className={`text-xs font-semibold ${getPasswordStrengthScore().color}`}
                    >
                      {getPasswordStrengthScore().text}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${getPasswordStrengthScore().color.replace(
                        "text-",
                        "bg-",
                      )}`}
                      style={{
                        width: `${(Object.values(passwordStrength).filter(Boolean).length / 5) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { key: "length", label: "Mínimo 8 caracteres" },
                      { key: "uppercase", label: "Mayúscula" },
                      { key: "lowercase", label: "Minúscula" },
                      { key: "number", label: "Número" },
                      { key: "special", label: "Carácter especial" },
                    ].map(({ key, label }) => (
                      <div
                        key={key}
                        className={`flex items-center gap-1 text-xs ${
                          passwordStrength[key as keyof PasswordStrength]
                            ? "text-green-600"
                            : "text-neutral-400"
                        }`}
                      >
                        {passwordStrength[key as keyof PasswordStrength] ? (
                          <CheckCircleIcon className="h-3 w-3" />
                        ) : (
                          <XCircleIcon className="h-3 w-3" />
                        )}
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div className="form-group">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Confirmar contraseña
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={isLoading}
                  className={`w-full pl-10 pr-12 py-2.5 border rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 ${
                    validationErrors.confirmPassword
                      ? "border-red-300 focus:ring-red-200"
                      : "border-neutral-300 focus:ring-primary-200 focus:border-primary-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <XCircleIcon className="h-3.5 w-3.5" />
                  {validationErrors.confirmPassword}
                </span>
              )}
              {formData.confirmPassword &&
                formData.password === formData.confirmPassword &&
                formData.password && (
                  <span className="text-green-500 text-xs mt-1 flex items-center gap-1">
                    <CheckCircleIcon className="h-3.5 w-3.5" />
                    Las contraseñas coinciden
                  </span>
                )}
            </div>

            {/* Términos y condiciones */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary-700 focus:ring-primary-500 accent-primary-700"
              />
              <label htmlFor="acceptTerms" className="text-xs text-neutral-600">
                Confirmo que he leído las{" "}
                <a
                  href={helpData?.pdfPoliticasPrivacidad || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-700 hover:underline"
                >
                  políticas de privacidad{" "}
                </a>
                y los{" "}
                <a
                  href={helpData?.pdfPoliticasUsoWeb || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-700 hover:underline"
                >
                  terminos y condiciones del uso de la plataforma
                </a>
                .
              </label>
            </div>
            {validationErrors.acceptTerms && (
              <span className="text-red-500 text-xs flex items-center gap-1">
                <XCircleIcon className="h-3.5 w-3.5" />
                {validationErrors.acceptTerms}
              </span>
            )}

            {/* Botón de registro */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creando cuenta...
                </span>
              ) : (
                "Crear cuenta"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              ¿Ya tienes cuenta?{" "}
              <Link
                href={preserveRedirectParam(searchParams, "/auth/login")}
                className="font-semibold text-primary-700 hover:text-primary-800 transition-colors"
              >
                Inicia sesión
              </Link>
            </p>
          </div>

          {/* Separador */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-neutral-500">
                O continúa con
              </span>
            </div>
          </div>

          {/* Social login */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>
        </div>
      </div>
      {showVerification && verifyEmail && (
        <VerificationDialog
          email={verifyEmail}
          onVerified={handleVerified}
          onCancel={() => setShowVerification(false)}
        />
      )}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
