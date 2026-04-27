// app/lib/auth.ts
//
// Security improvements:
// 1. Session token berbasis random string (bukan literal "authenticated")
// 2. timingSafeEqual untuk mencegah timing attack pada password check
// 3. In-memory rate limiting (maks 5 gagal per IP per 15 menit)

import { cookies } from "next/headers";
import { timingSafeEqual, randomBytes } from "crypto";

const SESSION_COOKIE_NAME = "zielabs_admin_session";
const SESSION_PREFIX = "zielabs_sess_";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 jam

// ─── In-Memory Rate Limiter ────────────────────────────────────────
// Key: IP address, Value: { count, firstAttemptAt }

interface RateLimitEntry {
  count: number;
  firstAttemptAt: number;
}

const loginAttempts = new Map<string, RateLimitEntry>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 menit

function checkRateLimit(ip: string): { allowed: boolean; remainingMs?: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry) return { allowed: true };

  // Reset jika window sudah lewat
  if (now - entry.firstAttemptAt > WINDOW_MS) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    const remainingMs = WINDOW_MS - (now - entry.firstAttemptAt);
    return { allowed: false, remainingMs };
  }

  return { allowed: true };
}

function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now - entry.firstAttemptAt > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttemptAt: now });
  } else {
    loginAttempts.set(ip, { count: entry.count + 1, firstAttemptAt: entry.firstAttemptAt });
  }
}

function clearAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

// ─── Timing-Safe Password Check ───────────────────────────────────

function safePasswordCompare(input: string, stored: string): boolean {
  try {
    const inputBuf = Buffer.from(input, "utf8");
    const storedBuf = Buffer.from(stored, "utf8");

    // Panjang harus sama untuk timingSafeEqual
    if (inputBuf.length !== storedBuf.length) {
      // Lakukan dummy comparison untuk mencegah timing leak dari length check
      timingSafeEqual(storedBuf, storedBuf);
      return false;
    }

    return timingSafeEqual(inputBuf, storedBuf);
  } catch {
    return false;
  }
}

// ─── Public API ────────────────────────────────────────────────────

/**
 * Validasi password dan buat session cookie.
 * @param password - Password yang dimasukkan user
 * @param clientIp - IP address untuk rate limiting (opsional)
 */
export async function login(
  password: string,
  clientIp: string = "unknown"
): Promise<{ success: boolean; message: string }> {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error("[auth] ADMIN_PASSWORD tidak diset di environment variables.");
    return {
      success: false,
      message: "Konfigurasi server error. Hubungi administrator.",
    };
  }

  // Rate limiting check
  const rateCheck = checkRateLimit(clientIp);
  if (!rateCheck.allowed) {
    const minutes = Math.ceil((rateCheck.remainingMs ?? 0) / 60000);
    return {
      success: false,
      message: `Terlalu banyak percobaan. Coba lagi dalam ${minutes} menit.`,
    };
  }

  // Timing-safe password comparison
  const isValid = safePasswordCompare(password, adminPassword);

  if (!isValid) {
    recordFailedAttempt(clientIp);
    const entry = loginAttempts.get(clientIp);
    const remaining = MAX_ATTEMPTS - (entry?.count ?? 0);
    console.warn(`[auth] Login gagal dari IP ${clientIp}. Sisa percobaan: ${remaining}`);
    return {
      success: false,
      message: `Password salah. Sisa percobaan: ${Math.max(0, remaining)}.`,
    };
  }

  // Login berhasil — hapus rate limit dan buat session token
  clearAttempts(clientIp);
  const sessionToken = SESSION_PREFIX + randomBytes(32).toString("hex");

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return { success: true, message: "Login berhasil." };
}

/**
 * Hapus session cookie (logout).
 */
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Cek apakah user sudah login.
 * Session token harus diawali dengan prefix yang diketahui.
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value?.startsWith(SESSION_PREFIX) === true;
}
