import { NextResponse } from "next/server";
import { getUserFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const userPayload = await getUserFromCookies();
  if (!userPayload) {
    return NextResponse.json({ success: false, message: "No autenticado" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userPayload.id },
      select: { id: true, email: true, primerNombre: true, apellido: true, emailVerificado: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      emailVerified: user.emailVerificado,
      user: { id: user.id, email: user.email, primerNombre: user.primerNombre, apellido: user.apellido },
    });
  } catch (error) {
    console.error("Error al verificar estado:", error);
    return NextResponse.json({ success: false, message: "Error interno" }, { status: 500 });
  }
}
