import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  checkCredentials,
  createSessionToken,
  isLoginConfigured,
  sessionCookieOptions,
} from "@/lib/invoice/auth";

export async function POST(request: NextRequest) {
  if (!isLoginConfigured()) {
    return NextResponse.json(
      { error: "Login is not set up. Set INVOICE_ADMIN_USERNAME and INVOICE_ADMIN_PASSWORD." },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as { username?: unknown; password?: unknown };
  const username = typeof body.username === "string" ? body.username : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!checkCredentials(username, password)) {
    // Slow down password guessing.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions);
  return response;
}
