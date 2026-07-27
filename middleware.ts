import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const SESSION_COOKIE_NAME = "__session";
const ADMIN_LOGIN_PATH = "/admin/login";

/**
 * Next.js only allows a single middleware file, so the two concerns from
 * the approved architecture (locale routing + admin route protection) are
 * combined here with a clear early-return split rather than two competing
 * middleware files.
 *
 * IMPORTANT: this cookie check is a fast, edge-safe gate to keep
 * unauthenticated requests from ever reaching an /admin/** route. It is
 * NOT the final authority — Firestore Security Rules (server-side) and
 * the custom `role: "admin"` claim verification in the protected admin
 * layout (Sprint 5) are what actually enforce access. A forged cookie
 * cannot write data; it can, at worst, briefly render an admin shell
 * with no real data, since every Firestore call is independently
 * re-checked against the user's ID token server-side.
 */
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return handleAdminRoute(request, pathname);
  }

  return intlMiddleware(request);
}

function handleAdminRoute(request: NextRequest, pathname: string) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  const isLoginPage = pathname === ADMIN_LOGIN_PATH;

  if (!sessionCookie && !isLoginPage) {
    const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (sessionCookie && isLoginPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Admin routes: run our own auth check, skip next-intl entirely
    // (the admin dashboard is not localized via URL prefix).
    "/admin/:path*",
    // Public routes: run next-intl's locale routing, but skip
    // static files, images, and API routes.
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
