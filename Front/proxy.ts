// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import { NextRequest, NextResponse } from "next/server";
import {
  isValidLocale,
  detectLocaleFromHeaders,
} from "./src/lib/i18n/locale-config";

/**
 * Proxy (Middleware) convention for Next.js 16+
 * Located in the project root for better production detection
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip system files and public assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(
      /\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf|eot)$/,
    )
  ) {
    return NextResponse.next();
  }

  // 2. Handle the root redirect
  if (pathname === "/") {
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
    const detectedLocale =
      cookieLocale && isValidLocale(cookieLocale)
        ? cookieLocale
        : detectLocaleFromHeaders(request);

    return NextResponse.redirect(new URL(`/${detectedLocale}`, request.url));
  }

  // 3. Handle locale cookie synchronization
  const segments = pathname.split("/").filter(Boolean);
  const pathLocale = segments[0];

  if (isValidLocale(pathLocale)) {
    const response = NextResponse.next();
    // Refresh the cookie to keep it alive
    response.cookies.set("NEXT_LOCALE", pathLocale, {
      maxAge: 31536000,
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  return NextResponse.next();
}

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
