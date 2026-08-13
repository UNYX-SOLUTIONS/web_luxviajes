"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ProfilePhoto } from "@/components/profile/ProfilePhoto";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordForm } from "@/components/profile/PasswordForm";

export default function ProfilePage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const {
    profile,
    isLoading,
    isSaving,
    error,
    success,
    loadProfile,
    saveProfile,
    savePassword,
  } = useUserProfile();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/profile");
      return;
    }
    loadProfile();
  }, [isAuthenticated, router, loadProfile]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary-200 border-t-primary-700 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-neutral-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <XCircleIcon className="h-12 w-12 text-red-400 mx-auto" />
          <p className="mt-4 text-neutral-600">No se pudo cargar el perfil</p>
          <button
            onClick={loadProfile}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-18! pb-6! px-4! sm:px-6! lg:px-8! md:pt-25! md:pb-10! lg:pt-30! lg:pb-15! xl:pt-40! xl:pb-20!">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Volver al inicio</span>
          </Link>
          <h1 className="text-xl! md:text-2xl! lg:text-3xl! font-bold text-neutral-900 mt-4">
            Mi Perfil
          </h1>
          <p className="text-neutral-500 mt-1">
            Gestiona tu información personal y configuración de seguridad
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-start gap-2 animate-slideDown">
            <CheckCircleIcon className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2">
            <XCircleIcon className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Foto de perfil */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-neutral-200 p-6">
              <ProfilePhoto
                primerNombre={profile.primerNombre ?? ""}
                apellido={profile.apellido ?? ""}
              />

              <div className="mt-6 pt-4 border-t border-neutral-200 space-y-2">
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  {showPasswordForm ? "Cancelar cambio" : "Cambiar contraseña"}
                </button>

                <button
                  onClick={logout}
                  className="w-full text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-6">
                Información personal
              </h2>
              <ProfileForm
                primerNombre={profile.primerNombre ?? ""}
                apellido={profile.apellido ?? ""}
                telefono={profile.telefono || ""}
                cedula={profile.cedula || ""}
                direccion={profile.direccion || ""}
                pais={profile.pais || "EC"}
                email={profile.email}
                onSave={saveProfile}
                isSaving={isSaving}
              />
            </div>

            {showPasswordForm && (
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-neutral-200 p-6 animate-slideDown">
                <PasswordForm
                  onSave={savePassword}
                  isSaving={isSaving}
                  onCancel={() => setShowPasswordForm(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
