// proxy.ts
// Auth guard di level middleware — melindungi semua route /admin/*
// kecuali /admin/login dan /admin/logout.

import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "zielabs_admin_session";
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/logout"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Hanya berlaku untuk /admin/* routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Izinkan login dan logout tanpa auth
  if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Cek session cookie
  const session = request.cookies.get(SESSION_COOKIE);
  const isAuthed = session?.value?.startsWith("zielabs_sess_");

  if (!isAuthed) {
    const loginUrl = new URL("/admin/login", request.url);
    // Simpan halaman yang dituju untuk redirect setelah login
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
