import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Middleware para proteger rutas, logging, etc.
export function middleware(request: NextRequest) {
  // Ejemplo: loguear rutas
  // // console.log(`[${new Date().toISOString()}] ${request.method} ${request.nextUrl.pathname}`);

  // Ejemplo: redirigir rutas
  // if (request.nextUrl.pathname.startsWith('/admin')) {
  //   // Verificar autenticación aquí
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

// Rutas donde aplicar el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
