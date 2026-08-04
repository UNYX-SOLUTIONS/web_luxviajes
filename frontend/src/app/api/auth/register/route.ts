import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { treeifyError } from "zod/v4/core";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { logSecurityEvent } from "@/lib/security-logger";
import { sendVerificationWebhook } from "@/lib/webhook";
import bcrypt from "bcryptjs";

function generateCode(): string {
  const arr = new Uint8Array(3);
  crypto.getRandomValues(arr);
  const num = Math.floor(100000 + ((arr[0] << 16 | arr[1] << 8 | arr[2]) % 900000));
  return num.toString().padStart(6, "0");
}

export async function POST(request: Request) {
  const rlKey = getRateLimitKey(request, "register");
  const rl = rateLimit(rlKey, 5, 60);
  if (!rl.allowed) {
    return NextResponse.json({ success: false, message: "Demasiadas solicitudes." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Datos inválidos", errors: treeifyError(parsed.error) }, { status: 400 });
    }

    const { primerNombre, apellido, email, password, telefono, cedula, direccion, pais } = parsed.data;

    const [existingUser, existingPending] = await Promise.all([
      prisma.user.findUnique({ where: { email }, select: { id: true } }),
      prisma.pendingRegistration.findUnique({ where: { email }, select: { id: true } }),
    ]);

    if (existingUser || existingPending) {
      return NextResponse.json({ success: false, message: "Este correo ya está registrado o tiene una verificación pendiente." }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const rawCode = generateCode();
    const hashedCode = await bcrypt.hash(rawCode, 10);

    const pending = await prisma.pendingRegistration.create({
      data: {
        primerNombre,
        apellido,
        email,
        password: hashedPassword,
        telefono: telefono || null,
        cedula: cedula || null,
        direccion: direccion || null,
        pais: pais || "EC",
        verificationCode: hashedCode,
        codeExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    const webhookOk = await sendVerificationWebhook(email, primerNombre, apellido, rawCode);

    if (webhookOk) {
      await prisma.pendingRegistration.update({
        where: { id: pending.id },
        data: { webhookSent: true, webhookSentAt: new Date() },
      });
    }

    await logSecurityEvent("REGISTER", pending.id, request, { email });

    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV] Verification code for ${email}: ${rawCode}`);
    }

    return NextResponse.json({
      success: true,
      message: "Usuario registrado. Revisa tu correo para el código de verificación.",
      data: {
        email,
        code: process.env.NODE_ENV === "development" ? rawCode : undefined,
      },
    }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ success: false, message: "Este correo ya está registrado." }, { status: 409 });
    }
    console.error("Error en registro:", error);
    return NextResponse.json({ success: false, message: "Error interno" }, { status: 500 });
  }
}
