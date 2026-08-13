const API_BASE = "/api/user/profile";

export interface UserProfile {
  id: string;
  primerNombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  cedula: string | null;
  direccion: string | null;
  pais: string;
  fotoPerfil: string | null;
  rol: string;
  emailVerificado: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getProfile(): Promise<UserProfile> {
  const res = await fetch(API_BASE);
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Error al obtener perfil");
  return data.data;
}

export async function updateProfile(fields: { nombre?: string; telefono?: string }): Promise<UserProfile> {
  const res = await fetch(API_BASE, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Error al actualizar perfil");
  return data.data;
}

export async function uploadPhoto(file: File): Promise<{ fotoPerfil: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/photo`, { method: "POST", body: formData });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Error al subir foto");
  return data.data;
}

export async function deletePhoto(): Promise<void> {
  const res = await fetch(`${API_BASE}/photo`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Error al eliminar foto");
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const res = await fetch(`${API_BASE}/password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Error al cambiar contraseña");
}
