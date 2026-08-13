import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { treeifyError } from "zod/v4/core";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { sendVerificationWebhook } from "@/lib/webhook";
import bcrypt from "bcryptjs";

const resendCodeSchema = z.object({ email: z.string().trim().toLowerCase().email() });

function generateCode(): string {
  const arr = new Uint8Array(3);
  crypto.getRandomValues(arr);
  const num = Math.floor(100000 + ((arr[0] << 16 | arr[1] << 8 | arr[2]) % 900000));
  return num.toString().padStart(6, "0");
}

export async function POST(request: Request) {
  const rlKey = getRateLimitKey(request, "resend_code");
  const rl = rateLimit(rlKey, 3, 3600);
  if (!rl.allowed) {
    return NextResponse.json({ success: false, message: "Demasiadas solicitudes. Intenta en una hora." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = resendCodeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Datos inválidos", errors: treeifyError(parsed.error) }, { status: 400 });
    }

    const { email } = parsed.data;

    const pending = await prisma.pendingRegistration.findUnique({ where: { email } });

    if (!pending) {
      return NextResponse.json({ success: false, message: "No hay verificación pendiente para este email." }, { status: 404 });
    }

    const rawCode = generateCode();
    const hashedCode = await bcrypt.hash(rawCode, 10);

    await prisma.pendingRegistration.update({
      where: { id: pending.id },
      data: {
        verificationCode: hashedCode,
        codeExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
        verificationAttempts: 0,
        webhookSent: false,
      },
    });

    const webhookOk = await sendVerificationWebhook(
      email,
      pending.primerNombre || "",
      pending.apellido || "",
      rawCode
    );

    if (webhookOk) {
      await prisma.pendingRegistration.update({
        where: { id: pending.id },
        data: { webhookSent: true, webhookSentAt: new Date() },
      });
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV] New code for ${email}: ${rawCode}`);
    }

    return NextResponse.json({
      success: true,
      message: webhookOk ? "Nuevo código enviado. Revisa tu correo." : "Código generado. Intenta de nuevo si no lo recibes.",
    });
  } catch (error) {
    console.error("Error al reenviar código:", error);
    return NextResponse.json({ success: false, message: "Error interno" }, { status: 500 });
  }
}
