import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations/auth";
import { prisma } from "@/lib/prisma";
import { comparePassword, generateToken, setAuthCookie } from "@/lib/auth";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { logSecurityEvent } from "@/lib/security-logger";

const MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS || "5", 10);
const LOCKOUT_DURATION = parseInt(process.env.LOCKOUT_DURATION || "15", 10);

export async function POST(request: Request) {
  const rlKey = getRateLimitKey(request, "login");
  const rl = rateLimit(rlKey, 10, 60);
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, message: "Demasiadas solicitudes. Intenta de nuevo más tarde." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Datos inválidos" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        nombre: true,
        email: true,
        password: true,
        rol: true,
        tokenVersion: true,
        loginAttempts: true,
        lockedUntil: true,
        emailVerificado: true,
      },
    });

    if (!user) {
      await logSecurityEvent("LOGIN_FAILED", null, request, { email, reason: "user_not_found" });
      return NextResponse.json(
        { success: false, message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      await logSecurityEvent("LOGIN_LOCKED", user.id, request, { email });
      return NextResponse.json(
        {
          success: false,
          message: "Cuenta bloqueada temporalmente. Intenta de nuevo más tarde.",
        },
        { status: 423 }
      );
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      const newAttempts = user.loginAttempts + 1;
      const lockedUntil =
        newAttempts >= MAX_LOGIN_ATTEMPTS
          ? new Date(Date.now() + LOCKOUT_DURATION * 60 * 1000)
          : undefined;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: newAttempts,
          lockedUntil: lockedUntil ?? null,
        },
      });

      await logSecurityEvent("LOGIN_FAILED", user.id, request, {
        email,
        attempt: newAttempts,
        reason: "wrong_password",
      });

      return NextResponse.json(
        { success: false, message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    if (!user.emailVerificado) {
      await logSecurityEvent("LOGIN_FAILED", user.id, request, {
        email,
        reason: "email_not_verified",
      });
      return NextResponse.json(
        { success: false, message: "Debes verificar tu correo electrónico antes de iniciar sesión." },
        { status: 403 }
      );
    }

    const tv = user.tokenVersion;
    const token = generateToken({
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
      tv,
    });

    await setAuthCookie(token);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
        lastLogin: new Date(),
      },
    });

    await logSecurityEvent("LOGIN_SUCCESS", user.id, request, { email });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
      message: "Inicio de sesión exitoso",
    });
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
