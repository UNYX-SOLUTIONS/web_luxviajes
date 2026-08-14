"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/lib/auth-context";
import { getSafeRedirect, preserveRedirectParam } from "@/utils/redirect";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get("redirect"), "/");
  const { login, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const errors: typeof validationErrors = {};

    if (!formData.email) {
      errors.email = "Email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email no válido";
    }

    if (!formData.password) {
      errors.password = "Contraseña es requerida";
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
      await login(formData.email, formData.password);
      window.location.href = redirectTo;
    } catch (err) {
      // Login error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-50 via-white to-purple-50 px-4! pt-45! pb-15!">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Logo y encabezado */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                <span className="text-3xl font-bold text-primary-700">L</span>
              </div>
            </div>
            <h1 className="text-3xl! font-bold text-neutral-900">
              Bienvenido de vuelta
            </h1>
            <p className="text-neutral-500 mt-2 text-sm!">
              Inicia sesión para continuar tu viaje con Lux Viajes
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-neutral-700">
                  Contraseña
                </label>
                <Link
                  href={preserveRedirectParam(
                    searchParams,
                    "/auth/forgot-password",
                  )}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
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
            </div>

            {/* Recordarme */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="rememberMe" className="text-sm text-neutral-600">
                  Recordarme
                </label>
              </div>
              <span className="text-xs text-neutral-400">
                Seguro y protegido
              </span>
            </div>

            {/* Botón de login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                "Iniciar sesión"
              )}
            </button>

            {/* Demo credentials (solo desarrollo) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 font-medium text-center">
                  🔑 Demo: usuario@luxviajes.com / password123
                </p>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              ¿No tienes cuenta?{" "}
              <Link
                href={preserveRedirectParam(searchParams, "/auth/register")}
                className="font-semibold text-primary-700 hover:text-primary-800 transition-colors"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
