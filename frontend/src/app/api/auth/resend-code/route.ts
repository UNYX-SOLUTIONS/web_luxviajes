import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { treeifyError } from "zod/v4/core";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";

const resendCodeSchema = z.object({
  email: z.string().email(),
});

function generateCode(): string {
  const arr = new Uint8Array(3);
  crypto.getRandomValues(arr);
  return String(Math.floor(100000 + (arr[0] << 16 | arr[1] << 8 | arr[2]) % 900000)).padStart(6, "0");
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

    const pending = await prisma.pendingRegistration.findUnique({
      where: { email },
    });

    if (!pending) {
      return NextResponse.json({ success: false, message: "No hay una verificación pendiente para este email" }, { status: 404 });
    }

    const rawCode = generateCode();
    const hashedCode = await bcrypt.hash(rawCode, 10);

    await prisma.pendingRegistration.update({
      where: { id: pending.id },
      data: {
        verificationCode: hashedCode,
        codeExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
        verificationAttempts: 0,
      },
    });

    console.log(`[DEV] New verification code for ${email}: ${rawCode}`);

    return NextResponse.json({ success: true, message: "Nuevo código enviado" });
  } catch (error) {
    console.error("Error al reenviar código:", error);
    return NextResponse.json({ success: false, message: "Error interno" }, { status: 500 });
  }
}
