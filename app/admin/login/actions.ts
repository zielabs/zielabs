// app/admin/login/actions.ts

"use server";

import { headers } from "next/headers";
import { login } from "@/app/lib/auth";

export async function loginAction(
  password: string
): Promise<{ success: boolean; message: string }> {
  // Ambil IP dari request headers untuk rate limiting
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  return login(password, ip);
}
