// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_LOCALE,
  isValidLocale,
  detectLocaleFromHeaders,
} from "./lib/i18n/locale-config";

/**
 * Security headers to be added to all responses
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

/**
 * Proxy (formerly Middleware) to handle locale redirection and security headers
 * In Next.js 16+, the convention is to use proxy.ts instead of middleware.ts
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Explicitly skip all Next.js internal paths and common assets
  // This prevents 404s on Vercel for static files and prefetch data
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(
      /\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf|eot)$/,
    )
  ) {
    return addSecurityHeaders(NextResponse.next());
  }

  // 2. Handle root path redirect (e.g., / -> /en)
  if (pathname === "/") {
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
    const detectedLocale =
      cookieLocale && isValidLocale(cookieLocale)
        ? cookieLocale
        : detectLocaleFromHeaders(request);

    const url = request.nextUrl.clone();
    url.pathname = `/${detectedLocale}`;

    const response = NextResponse.redirect(url);
    response.cookies.set("NEXT_LOCALE", detectedLocale, {
      maxAge: 31536000, // 1 year
      path: "/",
      sameSite: "lax",
    });
    return addSecurityHeaders(response);
  }

  // 3. Sync locale cookie with current path
  const segments = pathname.split("/").filter(Boolean);
  const pathLocale = segments[0];

  if (isValidLocale(pathLocale)) {
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
    if (cookieLocale !== pathLocale) {
      const response = NextResponse.next();
      response.cookies.set("NEXT_LOCALE", pathLocale, {
        maxAge: 31536000,
        path: "/",
        sameSite: "lax",
      });
      return addSecurityHeaders(response);
    }
    return addSecurityHeaders(NextResponse.next());
  }

  // 4. Handle localized routes without prefix (e.g., /about -> /en/about)
  const localizedRoutes = [
    "about",
    "services",
    "properties",
    "blog",
    "login",
    "register",
    "forgot-password",
    "dashboard",
  ];

  if (localizedRoutes.includes(pathLocale)) {
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
    const detectedLocale =
      cookieLocale && isValidLocale(cookieLocale)
        ? cookieLocale
        : detectLocaleFromHeaders(request);

    const url = request.nextUrl.clone();
    url.pathname = `/${detectedLocale}${pathname}`;
    return addSecurityHeaders(NextResponse.redirect(url));
  }

  // 5. Handle invalid 2-char prefixes
  if (pathLocale && pathLocale.length === 2 && !isValidLocale(pathLocale)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}/${segments.slice(1).join("/")}`;
    return addSecurityHeaders(NextResponse.redirect(url));
  }

  return addSecurityHeaders(NextResponse.next());
}

/**
 * Configure which paths should trigger the proxy.
 * We use the standard Next.js exclusion pattern which is the most reliable on Vercel.
 */
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
