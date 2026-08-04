import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken, setAuthCookie } from "@/lib/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { z } from "zod";
import { treeifyError } from "zod/v4/core";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { logSecurityEvent } from "@/lib/security-logger";
import bcrypt from "bcryptjs";

const registerVerifiedSchema = z.object({
  primerNombre: z.string().min(2).max(50).regex(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/),
  apellido: z.string().min(2).max(50).regex(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/),
  email: z.string().email().max(100),
  password: z.string().min(8).max(50).regex(/[A-Z]/).regex(/[0-9]/),
  confirmPassword: z.string(),
  telefono: z.string().min(7).max(15).regex(/^[0-9+]+$/).optional().or(z.literal("")),
  cedula: z.string().length(10).optional().or(z.literal("")),
  direccion: z.string().max(200).optional().or(z.literal("")),
  pais: z.string().length(2).optional(),
}).refine((d) => d.password === d.confirmPassword, { message: "Las contraseñas no coinciden", path: ["confirmPassword"] });

function generateCode(): string {
  const arr = new Uint8Array(3);
  crypto.getRandomValues(arr);
  return String(Math.floor(100000 + (arr[0] << 16 | arr[1] << 8 | arr[2]) % 900000)).padStart(6, "0");
}

export async function POST(request: Request) {
  const rlKey = getRateLimitKey(request, "register_verified");
  const rl = rateLimit(rlKey, 5, 60);
  if (!rl.allowed) {
    return NextResponse.json({ success: false, message: "Demasiadas solicitudes" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = registerVerifiedSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Datos inválidos", errors: treeifyError(parsed.error) }, { status: 400 });
    }

    const { primerNombre, apellido, email, password, telefono, cedula, direccion, pais } = parsed.data;

    const [existingUser, existingPending] = await Promise.all([
      prisma.user.findUnique({ where: { email }, select: { id: true } }),
      prisma.pendingRegistration.findUnique({ where: { email }, select: { id: true } }),
    ]);

    if (existingUser || existingPending) {
      return NextResponse.json({ success: false, message: "Este correo ya está registrado o tiene una verificación pendiente" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const rawCode = generateCode();
    const hashedCode = await bcrypt.hash(rawCode, 10);

    await prisma.pendingRegistration.create({
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

    console.log(`[DEV] Verification code for ${email}: ${rawCode}`);

    return NextResponse.json({ success: true, message: "Código de verificación enviado", data: { email } }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ success: false, message: "Este correo ya está registrado" }, { status: 409 });
    }
    console.error("Error en registro verificado:", error);
    return NextResponse.json({ success: false, message: "Error interno" }, { status: 500 });
  }
}
