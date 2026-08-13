import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromCookies } from "@/lib/auth";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { validateFileType, getFileExtension } from "@/lib/file-validator";
import { logSecurityEvent } from "@/lib/security-logger";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "profiles");
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const userPayload = await getUserFromCookies();
  if (!userPayload) {
    return NextResponse.json({ success: false, message: "No autenticado" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No se envió ningún archivo" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "La imagen no debe superar los 5MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const detectedType = validateFileType(buffer);

    if (!detectedType) {
      return NextResponse.json(
        { success: false, message: "Tipo de archivo no permitido. Usa JPG, PNG o WEBP" },
        { status: 400 }
      );
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const ext = getFileExtension(file.type);
    const fileName = `user_${userPayload.id}_${Date.now()}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    await writeFile(filePath, buffer);

    const fotoUrl = `/uploads/profiles/${fileName}`;

    const user = await prisma.user.update({
      where: { id: userPayload.id },
      data: { fotoPerfil: fotoUrl },
      select: { fotoPerfil: true },
    });

    await logSecurityEvent("PHOTO_UPLOADED", userPayload.id, request, {
      type: detectedType,
      size: file.size,
    });

    return NextResponse.json({ success: true, data: user, message: "Foto actualizada" });
  } catch (error) {
    console.error("Error al subir foto:", error);
    return NextResponse.json({ success: false, message: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const userPayload = await getUserFromCookies();
  if (!userPayload) {
    return NextResponse.json({ success: false, message: "No autenticado" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userPayload.id },
      select: { fotoPerfil: true },
    });

    if (user?.fotoPerfil) {
      const oldPath = path.join(process.cwd(), "public", user.fotoPerfil);
      try {
        await unlink(oldPath);
      } catch {
        // El archivo puede no existir
      }
    }

    await prisma.user.update({
      where: { id: userPayload.id },
      data: { fotoPerfil: null },
    });

    await logSecurityEvent("PHOTO_DELETED", userPayload.id, request, {});

    return NextResponse.json({ success: true, message: "Foto eliminada" });
  } catch (error) {
    console.error("Error al eliminar foto:", error);
    return NextResponse.json({ success: false, message: "Error interno" }, { status: 500 });
  }
}
