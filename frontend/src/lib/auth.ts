import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === "default-secret-change-me") {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET no está configurado en producción");
    }
    return "lux-viajes-dev-secret-not-for-production";
  }
  return secret;
}

function expiresInToSeconds(expiresIn: string): number {
  const match = /^(\d+)(s|m|h|d)$/.exec(expiresIn);
  if (!match) return 60 * 60 * 24 * 7;
  const n = parseInt(match[1], 10);
  const multipliers: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
  return n * multipliers[match[2]];
}

const COOKIE_NAME = "lux_viajes_token";

export interface JWTPayload {
  id: string;
  email: string;
  primerNombre: string;
  apellido: string;
  rol: string;
  tv: number;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as JWTPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: expiresInToSeconds(JWT_EXPIRES_IN),
    path: "/",
  });
}

export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
  cookieStore.delete(COOKIE_NAME);
}

export async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME);
  return token?.value ?? null;
}

export async function getUserFromCookies(): Promise<JWTPayload | null> {
  const token = await getTokenFromCookies();
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { tokenVersion: true },
  });

  if (!user || user.tokenVersion !== payload.tv) {
    return null;
  }

  return payload;
}
