import { createHmac } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "cs_admin_session";

function getSecret(): string {
  const secret = process.env.ADMIN_COOKIE_SECRET;
  if (!secret) throw new Error("ADMIN_COOKIE_SECRET is not set");
  return secret;
}

export function getAdminPassword(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) throw new Error("ADMIN_PASSWORD is not set");
  return pw;
}

export async function isAdminAuthenticated() {
  const jar = await cookies();
  const val = jar.get(COOKIE)?.value;
  return val === sign(getAdminPassword());
}

export function sign(password: string): string {
  return createHmac("sha256", getSecret()).update(`cs:${password}`).digest("hex");
}

export { COOKIE as ADMIN_COOKIE };
