import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

async function verifySession(cookieValue: string): Promise<boolean> {
  const secret = process.env.ADMIN_COOKIE_SECRET;
  const password = process.env.ADMIN_PASSWORD;
  if (!secret || !password) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(`cs:${password}`));
  const expected = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return cookieValue === expected;
}

export async function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith('/admin') &&
    !req.nextUrl.pathname.startsWith('/admin/login')
  ) {
    const cookie = req.cookies.get('cs_admin_session');
    if (!cookie || !(await verifySession(cookie.value))) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }
}

export const config = { matcher: ['/admin/:path*'] };
