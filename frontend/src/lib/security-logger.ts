import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

type SecurityEvent =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED"
  | "LOGIN_LOCKED"
  | "LOGOUT"
  | "REGISTER"
  | "PASSWORD_CHANGED"
  | "PROFILE_UPDATED"
  | "PHOTO_UPLOADED"
  | "PHOTO_DELETED"
  | "EMAIL_VERIFIED";

export async function logSecurityEvent(
  event: SecurityEvent,
  userId: string | null,
  request: Request,
  details: Record<string, unknown> = {}
): Promise<void> {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;
    const userAgent = request.headers.get("user-agent") || null;

    await prisma.securityLog.create({
      data: {
        userId,
        event,
        details: details as Prisma.InputJsonValue,
        ip,
        userAgent,
      },
    });
  } catch {
    console.error(`[SecurityLog] Error logging event: ${event}`);
  }
}
