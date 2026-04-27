// app/admin/login/page.tsx

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/admin/login/actions";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await loginAction(password);

      if (!result.success) {
        setError(result.message);
        return;
      }

      router.push("/admin");
      router.refresh();
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900">
            <div className="size-2.5 rounded-full bg-[#50C878] shadow-[0_0_10px_rgba(80,200,120,0.6)]" />
          </div>
          <h1 className="text-xl font-bold tracking-wide text-zinc-100">
            Zielabs Admin
          </h1>
          <p className="mt-1 text-xs text-zinc-500 tracking-wider uppercase">
            Restricted Access
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400 border border-red-500/20 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-[#50C878]/50 focus:ring-1 focus:ring-[#50C878]/30 transition-colors"
              placeholder="Masukkan password admin..."
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-[#50C878] py-3 text-sm font-semibold text-zinc-950 transition-all hover:bg-[#50C878]/90 hover:shadow-[0_0_20px_rgba(80,200,120,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Memverifikasi..." : "Masuk"}
          </button>
        </form>

        <p className="mt-8 text-center text-[11px] text-zinc-600">
          &copy; {new Date().getFullYear()} Zielabs. Internal use only.
        </p>
      </div>
    </div>
  );
}
