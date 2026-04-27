// app/admin/page.tsx

import { redirect } from "next/navigation";
import { isAuthenticated } from "@/app/lib/auth";
import { Package, Wrench, MessageSquareQuote, FolderOpen } from "lucide-react";
import { prisma } from "@/app/lib/db";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-zinc-950/80 p-6 backdrop-blur-md">
      <div className="flex size-12 items-center justify-center rounded-xl bg-[#50C878]/10 text-[#50C878]">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-zinc-100">{value}</p>
        <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
      </div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  // Live DB counts
  const [productCount, serviceCount, testimonialCount, categoryCount] =
    await Promise.all([
      prisma.product.count(),
      prisma.service.count(),
      prisma.testimonial.count(),
      prisma.category.count(),
    ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Selamat datang di panel administrasi Zielabs.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Products" value={productCount} icon={<Package className="size-5" />} />
        <StatCard label="Services" value={serviceCount} icon={<Wrench className="size-5" />} />
        <StatCard label="Testimonials" value={testimonialCount} icon={<MessageSquareQuote className="size-5" />} />
        <StatCard label="Categories" value={categoryCount} icon={<FolderOpen className="size-5" />} />
      </div>

      {/* System Status */}
      <div className="mt-8 rounded-2xl border border-white/5 bg-zinc-950/80 p-6 backdrop-blur-md">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Status Sistem
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="size-2 rounded-full bg-[#50C878] shadow-[0_0_6px_rgba(80,200,120,0.4)]" />
            <span className="text-zinc-400">Database:</span>
            <span className="text-zinc-300">XAMPP MySQL (localhost:3306/zielabs)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="size-2 rounded-full bg-[#50C878] shadow-[0_0_6px_rgba(80,200,120,0.4)]" />
            <span className="text-zinc-400">Server:</span>
            <span className="text-zinc-300">Next.js Development Mode</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="size-2 rounded-full bg-[#50C878] shadow-[0_0_6px_rgba(80,200,120,0.4)]" />
            <span className="text-zinc-400">Penyimpanan Gambar:</span>
            <span className="text-zinc-300">Database (Base64 / LongText)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
