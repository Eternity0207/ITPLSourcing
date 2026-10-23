import { createHash, createHmac, timingSafeEqual } from "crypto";

// Single-user login for the invoice tool. The username and password come from
// INVOICE_ADMIN_USERNAME / INVOICE_ADMIN_PASSWORD; the session is an
// HMAC-signed cookie, so no database is needed. Changing the password (or
// INVOICE_SESSION_SECRET) signs everyone out.

export const SESSION_COOKIE = "itpl_invoice_session";
export const SESSION_MAX_AGE = 60 * 60 * 12;

function credentials() {
  const username = process.env.INVOICE_ADMIN_USERNAME;
  const password = process.env.INVOICE_ADMIN_PASSWORD;
  if (!username || !password) return null;
  return { username, password };
}

export function isLoginConfigured() {
  return credentials() !== null;
}

function secret() {
  const creds = credentials();
  if (!creds) return null;
  return process.env.INVOICE_SESSION_SECRET || `${creds.username}:${creds.password}:itpl-invoices`;
}

function sign(payload: string, key: string) {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

// Hashing first keeps the comparison constant-time regardless of input length.
function safeEqual(a: string, b: string) {
  return timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
}

export function checkCredentials(username: string, password: string) {
  const creds = credentials();
  if (!creds) return false;
  // Evaluate both so a wrong username takes as long as a wrong password.
  const userOk = safeEqual(username.trim(), creds.username);
  const passOk = safeEqual(password, creds.password);
  return userOk && passOk;
}

export function createSessionToken() {
  const key = secret();
  const creds = credentials();
  if (!key || !creds) throw new Error("Invoice login is not configured.");
  const payload = Buffer.from(
    JSON.stringify({ u: creds.username, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE }),
  ).toString("base64url");
  return `${payload}.${sign(payload, key)}`;
}

export function verifySessionToken(token: string | undefined) {
  const key = secret();
  const creds = credentials();
  if (!token || !key || !creds) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload, key))) return false;

  try {
    const { u, exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { u: string; exp: number };
    return u === creds.username && exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};
