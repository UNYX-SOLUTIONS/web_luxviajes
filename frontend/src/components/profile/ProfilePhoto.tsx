"use client";

import React, { useRef } from "react";
import { CameraIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Avatar, AvatarFallback } from "@/components/auth/avatar";

interface ProfilePhotoProps {
  fotoUrl: string | null;
  nombre: string;
  onUpload: (file: File) => void;
  onDelete: () => void;
  isSaving: boolean;
}

export function ProfilePhoto({ fotoUrl, nombre, onUpload, onDelete, isSaving }: ProfilePhotoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getUserInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona una imagen válida");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no debe superar los 5MB");
      return;
    }

    onUpload(file);
  };

  return (
    <div className="text-center">
      <div className="relative inline-block">
        {fotoUrl ? (
          <img
            src={fotoUrl}
            alt="Foto de perfil"
            className="h-32 w-32 rounded-full object-cover ring-4 ring-primary-100"
          />
        ) : (
          <Avatar size="2xl" variant="solid" shape="circle">
            <AvatarFallback className="text-3xl">
              {getUserInitials(nombre)}
            </AvatarFallback>
          </Avatar>
        )}

        <label
          htmlFor="profile-photo-upload"
          className="absolute bottom-0 right-0 cursor-pointer bg-primary-700 hover:bg-primary-800 text-white p-2 rounded-full shadow-lg transition-colors"
        >
          <CameraIcon className="h-4 w-4" />
          <input
            ref={fileInputRef}
            id="profile-photo-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={isSaving}
          />
        </label>
      </div>

      <h3 className="font-semibold text-neutral-900 mt-4 truncate">
        {nombre}
      </h3>

      {fotoUrl && (
        <button
          onClick={onDelete}
          disabled={isSaving}
          className="mt-2 inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600 disabled:opacity-50"
        >
          <TrashIcon className="h-3.5 w-3.5" />
          Eliminar foto
        </button>
      )}
    </div>
  );
}
