import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromCookies } from "@/lib/auth";
import { z } from "zod";
import { treeifyError } from "zod/v4/core";
import { logSecurityEvent } from "@/lib/security-logger";

const updateProfileSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .regex(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/, "El nombre solo puede contener letras y espacios")
    .optional(),
  telefono: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 caracteres")
    .max(15, "El teléfono no puede exceder 15 caracteres")
    .regex(/^[0-9+]+$/, "El teléfono solo puede contener números y el signo +")
    .optional()
    .or(z.literal("")),
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
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        fotoPerfil: true,
        rol: true,
        emailVerificado: true,
        createdAt: true,
        updatedAt: true,
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
      return NextResponse.json(
        { success: false, message: "Datos inválidos", errors: treeifyError(parsed.error) },
        { status: 400 }
      );
    }

    const updateData: Record<string, string> = {};
    if (parsed.data.nombre !== undefined) updateData.nombre = parsed.data.nombre;
    if (parsed.data.telefono !== undefined) updateData.telefono = parsed.data.telefono || "";

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: false, message: "No hay datos para actualizar" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userPayload.id },
      data: updateData,
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        fotoPerfil: true,
        updatedAt: true,
      },
    });

    await logSecurityEvent("PROFILE_UPDATED", userPayload.id, request, updateData);

    return NextResponse.json({ success: true, data: user, message: "Perfil actualizado" });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return NextResponse.json({ success: false, message: "Error interno" }, { status: 500 });
  }
}
