import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken, setAuthCookie } from "@/lib/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { treeifyError } from "zod/v4/core";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { logSecurityEvent } from "@/lib/security-logger";

function generateVerificationToken(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  const rlKey = getRateLimitKey(request, "register");
  const rl = rateLimit(rlKey, 5, 60);
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, message: "Demasiadas solicitudes. Intenta de nuevo más tarde." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors = treeifyError(parsed.error);
      return NextResponse.json(
        { success: false, message: "Datos inválidos", errors: fieldErrors },
        { status: 400 }
      );
    }

    const { nombre, email, password, telefono } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Este correo ya está registrado" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const verificationToken = generateVerificationToken();

    const user = await prisma.user.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        telefono: telefono || null,
        emailVerificationToken: verificationToken,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        emailVerificado: true,
        emailVerificationToken: true,
        tokenVersion: true,
        createdAt: true,
      },
    });

    const tv = user.tokenVersion;
    const token = generateToken({
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
      tv,
    });

    await setAuthCookie(token);

    await logSecurityEvent("REGISTER", user.id, request, { email });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
        },
        verificationToken: process.env.NODE_ENV === "development" ? verificationToken : undefined,
        message: "Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "Este correo ya está registrado" },
        { status: 409 }
      );
    }

    console.error("Error en registro:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
