import { NextRequest, NextResponse } from "next/server";
import { createAdminSessionCookie, SESSION_COOKIE_NAME } from "@/lib/auth/session";

const FIVE_DAYS_SECONDS = 60 * 60 * 24 * 5;

/**
 * Called right after a successful client-side Firebase sign-in
 * (features/auth/api.ts). The client sends its fresh ID token here;
 * this route verifies it server-side (via the Admin SDK, checking the
 * `role: "admin"` custom claim) and, only if that passes, sets the
 * httpOnly session cookie that middleware.ts and every protected
 * admin page rely on. The ID token itself is never stored anywhere.
 */
export async function POST(request: NextRequest) {
  try {
    const { idToken } = (await request.json()) as { idToken?: string };

    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken." }, { status: 400 });
    }

    const sessionCookie = await createAdminSessionCookie(idToken);

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: FIVE_DAYS_SECONDS,
    });
    return response;
  } catch (error) {
    console.error("Failed to create admin session:", error);
    return NextResponse.json(
      { error: "This account does not have admin access." },
      { status: 401 },
    );
  }
}

/** Logs the admin out by clearing the session cookie. */
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
