import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromCookies } from "@/lib/auth";
import { z } from "zod";
import { treeifyError } from "zod/v4/core";
import { logSecurityEvent } from "@/lib/security-logger";

const updateProfileSchema = z.object({
  primerNombre: z.string().min(2).max(50).regex(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/).optional(),
  apellido: z.string().min(2).max(50).regex(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/).optional(),
  telefono: z.string().min(7).max(25).regex(/^[0-9+]+$/).optional().or(z.literal("")),
  cedula: z.string().length(10).regex(/^\d{10}$/).optional().or(z.literal("")),
  direccion: z.string().max(100).optional().or(z.literal("")),
  pais: z.string().length(2).optional(),
});

export async function GET() {
  const userPayload = await getUserFromCookies();
  if (!userPayload) {
    return NextResponse.json({ success: false, message: "No autenticado" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userPayload.id },
      select: {
        id: true, primerNombre: true, apellido: true, email: true,
        telefono: true, cedula: true, direccion: true, pais: true,
        fotoPerfil: true, rol: true, emailVerificado: true,
        createdAt: true, updatedAt: true,
      },
    });
    if (!user) {
      return NextResponse.json({ success: false, message: "Usuario no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    return NextResponse.json({ success: false, message: "Error interno" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const userPayload = await getUserFromCookies();
  if (!userPayload) {
    return NextResponse.json({ success: false, message: "No autenticado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Datos inválidos", errors: treeifyError(parsed.error) }, { status: 400 });
    }

    const updateData: Record<string, string> = {};
    if (parsed.data.primerNombre !== undefined) updateData.primerNombre = parsed.data.primerNombre;
    if (parsed.data.apellido !== undefined) updateData.apellido = parsed.data.apellido;
    if (parsed.data.telefono !== undefined) updateData.telefono = parsed.data.telefono || "";
    if (parsed.data.cedula !== undefined) updateData.cedula = parsed.data.cedula || "";
    if (parsed.data.direccion !== undefined) updateData.direccion = parsed.data.direccion || "";
    if (parsed.data.pais !== undefined) updateData.pais = parsed.data.pais;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: false, message: "No hay datos para actualizar" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userPayload.id },
      data: updateData,
      select: {
        id: true, primerNombre: true, apellido: true, email: true,
        telefono: true, cedula: true, direccion: true, pais: true,
        fotoPerfil: true, updatedAt: true,
      },
    });

    await logSecurityEvent("PROFILE_UPDATED", userPayload.id, request, updateData);
    return NextResponse.json({ success: true, data: user, message: "Perfil actualizado" });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return NextResponse.json({ success: false, message: "Error interno" }, { status: 500 });
  }
}
