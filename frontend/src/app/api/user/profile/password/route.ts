import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromCookies, comparePassword, hashPassword } from "@/lib/auth";
import { z } from "zod";
import { treeifyError } from "zod/v4/core";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { logSecurityEvent } from "@/lib/security-logger";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Contraseña actual requerida"),
  newPassword: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(50, "La contraseña no puede exceder 50 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),
});

export async function PUT(request: Request) {
  const rlKey = getRateLimitKey(request, "password_change");
  const rl = rateLimit(rlKey, 3, 300);
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, message: "Demasiadas solicitudes. Intenta de nuevo más tarde." },
      { status: 429 }
    );
  }

  const userPayload = await getUserFromCookies();
  if (!userPayload) {
    return NextResponse.json({ success: false, message: "No autenticado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Datos inválidos", errors: treeifyError(parsed.error) },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { id: userPayload.id },
      select: { password: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "Usuario no encontrado" }, { status: 404 });
    }

    const isValid = await comparePassword(currentPassword, user.password);
    if (!isValid) {
      await logSecurityEvent("LOGIN_FAILED", userPayload.id, request, {
        reason: "wrong_password_on_change",
      });
      return NextResponse.json(
        { success: false, message: "Contraseña actual incorrecta" },
        { status: 400 }
      );
    }

    const isSamePassword = await comparePassword(newPassword, user.password);
    if (isSamePassword) {
      return NextResponse.json(
        { success: false, message: "La nueva contraseña debe ser diferente a la actual" },
        { status: 400 }
      );
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userPayload.id },
      data: {
        password: hashedNewPassword,
        tokenVersion: { increment: 1 },
      },
    });

    await logSecurityEvent("PASSWORD_CHANGED", userPayload.id, request, {});

    return NextResponse.json({
      success: true,
      message: "Contraseña actualizada. Todas las demás sesiones han sido cerradas.",
    });
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    return NextResponse.json({ success: false, message: "Error interno" }, { status: 500 });
  }
}
