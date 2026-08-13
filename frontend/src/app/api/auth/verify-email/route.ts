import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logSecurityEvent } from "@/lib/security-logger";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, message: "Token inválido" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Token inválido o expirado" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificado: true,
        emailVerificationToken: null,
      },
    });

    await logSecurityEvent("EMAIL_VERIFIED", user.id, request, {});

    return NextResponse.json({
      success: true,
      message: "Correo electrónico verificado exitosamente",
    });
  } catch (error) {
    console.error("Error en verificación:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
