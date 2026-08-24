import { createHmac, timingSafeEqual } from "node:crypto";

// קובץ זה נטען גם ב-proxy.ts (Node.js runtime) וגם בפעולות שרת,
// ולכן הוא לא תלוי ב-next/headers.

export const SESSION_COOKIE = "leadsystem_session";
const SESSION_DAYS = 90;
export const SESSION_MAX_AGE_SECONDS = SESSION_DAYS * 24 * 60 * 60;

function getSecret(): string {
  const secret = process.env.AUTH_SECRET || process.env.APP_PASSWORD;
  if (!secret) {
    throw new Error(
      "חסר משתנה סביבה APP_PASSWORD (אפשר גם להוסיף AUTH_SECRET נפרד). הגדירו אותו בהגדרות הפרויקט ב-Vercel."
    );
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

export function isSessionTokenValid(token: string | undefined | null): boolean {
  if (!token) return false;
  const separatorIndex = token.indexOf(".");
  if (separatorIndex === -1) return false;
  const payload = token.slice(0, separatorIndex);
  const signature = token.slice(separatorIndex + 1);
  if (!payload || !signature) return false;

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  try {
    return safeEqual(signature, sign(payload));
  } catch {
    return false;
  }
}

export function checkPassword(password: string): boolean {
  const expected = process.env.APP_PASSWORD;
  if (!expected || !password) return false;
  try {
    return safeEqual(password, expected);
  } catch {
    return false;
  }
}
