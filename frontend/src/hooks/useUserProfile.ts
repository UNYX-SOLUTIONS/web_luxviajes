"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  getProfile,
  updateProfile,
  uploadPhoto,
  deletePhoto,
  changePassword,
  type UserProfile,
} from "@/services/user.service";

export function useUserProfile() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar perfil");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProfile = useCallback(async (fields: { nombre?: string; telefono?: string }) => {
    setIsSaving(true);
    clearMessages();
    try {
      const updated = await updateProfile(fields);
      setProfile(updated);
      updateUser({
        id: updated.id,
        primerNombre: updated.primerNombre ?? "",
        apellido: updated.apellido ?? "",
        email: updated.email,
        rol: updated.rol,
        fotoPerfil: updated.fotoPerfil ?? null,
      });
      setSuccess("Perfil actualizado exitosamente");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar");
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [updateUser, clearMessages]);

  const savePhoto = useCallback(async (file: File) => {
    setIsSaving(true);
    clearMessages();
    try {
      const result = await uploadPhoto(file);
      setProfile((prev) => prev ? { ...prev, fotoPerfil: result.fotoPerfil } : null);
      updateUser({
        id: profile?.id ?? "",
        primerNombre: profile?.primerNombre ?? "",
        apellido: profile?.apellido ?? "",
        email: profile?.email ?? "",
        rol: profile?.rol ?? "",
        fotoPerfil: result.fotoPerfil,
      });
      setSuccess("Foto de perfil actualizada");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir foto");
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [clearMessages]);

  const removePhoto = useCallback(async () => {
    setIsSaving(true);
    clearMessages();
    try {
      await deletePhoto();
      setProfile((prev) => prev ? { ...prev, fotoPerfil: null } : null);
      updateUser({
        id: profile?.id ?? "",
        primerNombre: profile?.primerNombre ?? "",
        apellido: profile?.apellido ?? "",
        email: profile?.email ?? "",
        rol: profile?.rol ?? "",
        fotoPerfil: null,
      });
      setSuccess("Foto de perfil eliminada");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar foto");
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [clearMessages]);

  const savePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setIsSaving(true);
    clearMessages();
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess("Contraseña actualizada exitosamente");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cambiar contraseña");
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [clearMessages]);

  return {
    profile,
    isLoading,
    isSaving,
    error,
    success,
    loadProfile,
    saveProfile,
    savePhoto,
    removePhoto,
    savePassword,
    clearMessages,
  };
}
