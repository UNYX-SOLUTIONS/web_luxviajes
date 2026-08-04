import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken, setAuthCookie } from "@/lib/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { treeifyError } from "zod/v4/core";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors = treeifyError(parsed.error);
      return NextResponse.json(
        {
          success: false,
          message: "Datos inválidos",
          errors: fieldErrors,
        },
        { status: 400 }
      );
    }

    const { nombre, email, password, telefono } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Este correo ya está registrado",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        telefono: telefono || null,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        emailVerificado: true,
        createdAt: true,
      },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
    });

    await setAuthCookie(token);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
        },
        message: "Usuario registrado exitosamente",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Este correo ya está registrado",
        },
        { status: 409 }
      );
    }

    console.error("Error en registro:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
