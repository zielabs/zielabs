// app/admin/logout/route.ts

import { NextResponse } from "next/server";
import { logout } from "@/app/lib/auth";

export async function POST(): Promise<NextResponse> {
  await logout();
  return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));
}
