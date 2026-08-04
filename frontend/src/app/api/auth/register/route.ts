import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken, setAuthCookie } from "@/lib/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { treeifyError } from "zod/v4/core";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { logSecurityEvent } from "@/lib/security-logger";

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

    const existingUser = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Este correo ya está registrado" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        primerNombre,
        apellido,
        email,
        password: hashedPassword,
        telefono: telefono || null,
        cedula: cedula || null,
        direccion: direccion || null,
        pais: pais || "EC",
      },
      select: { id: true, primerNombre: true, apellido: true, email: true, rol: true, tokenVersion: true },
    });

    const tv = user.tokenVersion;
    const token = generateToken({ id: user.id, email: user.email, primerNombre: user.primerNombre ?? "", apellido: user.apellido ?? "", rol: user.rol, tv });
    await setAuthCookie(token);

    await logSecurityEvent("REGISTER", user.id, request, { email });

    return NextResponse.json({
      success: true,
      user: { id: user.id, primerNombre: user.primerNombre, apellido: user.apellido, email: user.email, rol: user.rol },
      message: "Usuario registrado exitosamente",
    }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ success: false, message: "Este correo ya está registrado" }, { status: 409 });
    }
    console.error("Error en registro:", error);
    return NextResponse.json({ success: false, message: "Error interno" }, { status: 500 });
  }
}
