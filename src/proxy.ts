import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/invoice/auth";

// Keeps the invoice tool behind its login. The API routes check the session
// again themselves, so this is the first gate, not the only one.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/invoices/login" || pathname === "/api/invoices/login") return NextResponse.next();

  if (verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }

  const login = new URL("/invoices/login", request.url);
  login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/invoices", "/invoices/:path*", "/api/invoices/:path*"],
};
