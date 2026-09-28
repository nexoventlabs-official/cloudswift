import { NextResponse } from "next/server";
import { ADMIN_COOKIE, getAdminPassword, sign } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const password = String(body.password || "");
  if (password !== getAdminPassword()) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, sign(password), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
