// app/admin/layout.tsx

import { redirect } from "next/navigation";
import { isAuthenticated } from "@/app/lib/auth";
import AdminSidebar from "@/app/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin — Zielabs",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authed = await isAuthenticated();

  // Jangan redirect jika sedang di halaman login
  // Layout ini di-share oleh semua route di /admin/*
  // Kita hanya redirect jika bukan halaman login
  // Next.js tidak memberi pathname di layout, jadi kita handle di page-level

  if (!authed) {
    // Bypass check: login page akan handle sendiri
    // Tapi kita perlu tahu apakah ini login page — solusi: render tanpa sidebar
    // Trick: gunakan cookie check + children langsung
    return (
      <div className="min-h-screen bg-[#050505] text-zinc-100">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-zinc-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
