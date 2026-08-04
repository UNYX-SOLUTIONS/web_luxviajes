import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken, setAuthCookie } from "@/lib/auth";
import { z } from "zod";
import { treeifyError } from "zod/v4/core";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { logSecurityEvent } from "@/lib/security-logger";
import bcrypt from "bcryptjs";

const verifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6).regex(/^\d{6}$/, "El código debe ser 6 dígitos"),
});

export async function POST(request: Request) {
  const rlKey = getRateLimitKey(request, "verify_code");
  const rl = rateLimit(rlKey, 10, 60);
  if (!rl.allowed) {
    return NextResponse.json({ success: false, message: "Demasiados intentos" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = verifyCodeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Datos inválidos", errors: treeifyError(parsed.error) }, { status: 400 });
    }

    const { email, code } = parsed.data;

    const pending = await prisma.pendingRegistration.findUnique({
      where: { email },
    });

    if (!pending) {
      return NextResponse.json({ success: false, message: "Código inválido o expirado" }, { status: 400 });
    }

    if (new Date() > pending.codeExpiresAt) {
      await prisma.pendingRegistration.delete({ where: { id: pending.id } });
      return NextResponse.json({ success: false, message: "El código ha expirado. Solicita uno nuevo." }, { status: 400 });
    }

    if (pending.verificationAttempts >= pending.maxAttempts) {
      return NextResponse.json({ success: false, message: "Demasiados intentos. Solicita un nuevo código." }, { status: 400 });
    }

    const isValid = await bcrypt.compare(code, pending.verificationCode);

    if (!isValid) {
      await prisma.pendingRegistration.update({
        where: { id: pending.id },
        data: { verificationAttempts: { increment: 1 } },
      });
      const remaining = pending.maxAttempts - pending.verificationAttempts - 1;
      return NextResponse.json({
        success: false,
        message: remaining > 0 ? `Código incorrecto. Te quedan ${remaining} intentos.` : "Demasiados intentos. Solicita un nuevo código.",
      }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        primerNombre: pending.primerNombre,
        apellido: pending.apellido,
        email: pending.email,
        password: pending.password,
        telefono: pending.telefono,
        emailVerificado: true,
        emailVerifiedAt: new Date(),
      },
      select: { id: true, primerNombre: true, apellido: true, email: true, rol: true, tokenVersion: true },
    });

    await prisma.pendingRegistration.delete({ where: { id: pending.id } });

    await logSecurityEvent("REGISTER", user.id, request, { email, verified: true });

    const token = generateToken({ id: user.id, email: user.email, primerNombre: user.primerNombre ?? "", apellido: user.apellido ?? "", rol: user.rol, tv: user.tokenVersion });
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      message: "Email verificado. Cuenta creada exitosamente.",
      user: { id: user.id, primerNombre: user.primerNombre, apellido: user.apellido, email: user.email, rol: user.rol },
    });
  } catch (error) {
    console.error("Error en verificación:", error);
    return NextResponse.json({ success: false, message: "Error interno" }, { status: 500 });
  }
}
