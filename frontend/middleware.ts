import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const COOKIE_NAME = "lux_viajes_token";

const protectedRoutes = ["/profile", "/mi-perfil", "/mis-viajes", "/reservas"];
const authRoutes = ["/auth/login", "/auth/register"];
const apiRoutes = ["/api/user"];

const allowedOrigins = process.env.NODE_ENV === "production"
  ? ["https://agencialuxviajes.com"]
  : ["http://localhost:3000"];

function addSecurityHeaders(response: NextResponse, request: NextRequest): void {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://cms.agencialuxviajes.com"
  );

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  const origin = request.headers.get("origin");
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
  }
}

export function middleware(request: NextRequest) {
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });
    addSecurityHeaders(response, request);
    return response;
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  const isAuthenticated = !!token;

  if (isAuthenticated && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    !isAuthenticated &&
    (protectedRoutes.some((route) => pathname.startsWith(route)) ||
     apiRoutes.some((route) => pathname.startsWith(route)))
  ) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  addSecurityHeaders(response, request);

  if (isAuthenticated && token) {
    response.headers.set("x-user-authenticated", "true");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|fonts|uploads).*)",
  ],
};
