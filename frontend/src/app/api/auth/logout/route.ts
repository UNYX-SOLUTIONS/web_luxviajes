import { NextResponse } from "next/server";
import { removeAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await removeAuthCookie();
    return NextResponse.json({
      success: true,
      message: "Sesión cerrada exitosamente",
    });
  } catch (error) {
    console.error("Error en logout:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
