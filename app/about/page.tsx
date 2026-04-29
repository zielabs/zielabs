// app/about/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Theme-aware About page.
// Light: bg-zinc-50, text-zinc-900, card bg-white border-zinc-200 shadow-sm
// Dark : bg-[#050505], text-zinc-100, card bg-zinc-950/60 border-white/5
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { Target, Zap, Shield, Code2 } from "lucide-react";
import TiltCard from "@/app/components/ui/TiltCard";
import TextReveal from "@/app/components/ui/TextReveal";
import FadeUp from "@/app/components/ui/FadeUp";

export const metadata: Metadata = {
  title: "About",
  description:
    "Zielabs adalah agensi produk digital premium yang berfokus pada rekayasa solusi enterprise-grade. Membangun Web App, Mobile App, POS, SaaS, dan Desktop App.",
};

const STATS = [
  { value: "5+",  label: "Tahun Pengalaman"    },
  { value: "50+", label: "Proyek Terselesaikan" },
  { value: "30+", label: "Klien Puas"           },
  { value: "99%", label: "On-Time Delivery"     },
];

const APPROACH = [
  {
    icon: <Target className="size-6" />,
    title: "Precision Engineering",
    description:
      "Setiap baris kode ditulis dengan presisi. Kami tidak membangun prototype — kami membangun produk yang siap untuk skala enterprise.",
  },
  {
    icon: <Zap className="size-6" />,
    title: "Performance First",
    description:
      "Optimasi performa bukan afterthought — ini adalah fondasi. Dari database query hingga frontend rendering, semuanya dioptimalkan.",
  },
  {
    icon: <Shield className="size-6" />,
    title: "Security by Design",
    description:
      "Keamanan diintegrasikan sejak arsitektur awal. Authentication, authorization, encryption, dan audit trail bawaan di setiap produk.",
  },
  {
    icon: <Code2 className="size-6" />,
    title: "Clean Architecture",
    description:
      "Kode yang maintainable, testable, dan scalable. Kami mengikuti SOLID principles dan menggunakan teknologi terdepan yang sudah teruji.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-[#050505] pt-32 pb-32 noise-bg relative overflow-hidden">
      <div className="scanlines" />
      {/* Ambient glow — dark mode only */}
      <div className="hidden dark:block absolute top-0 right-0 -mr-40 -mt-40 h-[600px] w-[600px] rounded-full bg-[#50C878]/5 blur-[120px] pointer-events-none" />

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 mb-20 relative z-10">
        <FadeUp delay={0.1}>
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.4em] text-[#50C878]">
            About Us
          </p>
        </FadeUp>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-6xl lg:text-7xl flex flex-col items-start gap-2">
          <TextReveal delay={0.1}>Merekayasa Masa Depan</TextReveal>
          <TextReveal delay={0.2}>
            <span className="bg-gradient-to-r from-[#50C878] to-[#2660A4] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(80,200,120,0.3)]">
              Produk Digital
            </span>
          </TextReveal>
        </h1>
        <FadeUp delay={0.3}>
          <div className="mt-8 h-[2px] w-32 bg-gradient-to-r from-[#50C878] to-transparent" />
        </FadeUp>
      </div>

      {/* ── Story Section ──────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 mb-32 relative z-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
          {/* Left: Story */}
          <FadeUp delay={0.1} className="lg:col-span-3 space-y-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#50C878] to-[#A7FFD3] uppercase tracking-widest border-l-4 border-[#50C878] pl-4">
              Visi Kami
            </h2>
            <div className="space-y-6 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              <p>
                Zielabs lahir dari keyakinan bahwa setiap bisnis layak memiliki produk
                digital berkualitas enterprise — tanpa kompromi. Kami adalah tim engineer
                dan desainer yang terobsesi dengan kualitas, performa, dan keanggunan
                dalam setiap solusi yang kami bangun.
              </p>
              <p>
                Dari sistem inventarisasi enterprise  
                hingga platform e-commerce headless, POS systems, dan SaaS products — kami
                menghadirkan solusi yang tidak hanya berfungsi, tetapi menginspirasi.
                Setiap proyek dieksekusi dengan arsitektur yang scalable, codebase yang
                bersih, dan UI/UX yang memukau.
              </p>
              <p>
                Estetika visual kami terinspirasi dari presisi engineering automotive
                kelas dunia —{" "}
                <span className="font-bold text-[#50C878]">Minimalist Luxury</span>{" "}
                bertemu{" "}
                <span className="font-bold text-[#2660A4]">Digital Cyberpunk</span>.
                Obsidian Black dan Emerald Green bukan sekadar warna — ini adalah identitas.
              </p>
            </div>
          </FadeUp>

          {/* Right: Stats */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat) => (
                <FadeUp key={stat.label} delay={0.15}>
                  <TiltCard>
                    <div className="relative h-full rounded-3xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-950/60 shadow-sm dark:shadow-none p-8 flex flex-col justify-center text-center transition-all duration-500 hover:border-[#50C878]/40 dark:hover:border-[#50C878]/30 group overflow-hidden">
                      {/* Hover glow */}
                      <div className="absolute inset-0 bg-gradient-to-b from-[#50C878]/5 dark:from-[#50C878]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
                      <p className="relative text-4xl font-bold text-[#50C878] drop-shadow-[0_0_15px_rgba(80,200,120,0.3)]">
                        {stat.value}
                      </p>
                      <p className="relative mt-2 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                        {stat.label}
                      </p>
                    </div>
                  </TiltCard>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Approach Section ───────────────────────────────────── */}
      <section className="border-t border-zinc-200 dark:border-white/5 pt-32 relative z-10">
        {/* Gradient divider */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#2660A4]/30 dark:via-[#2660A4]/40 to-transparent" />

        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-20">
            <FadeUp delay={0.1}>
              <p className="mb-6 text-xs font-bold uppercase tracking-[0.4em] text-[#50C878]">
                Our Approach
              </p>
            </FadeUp>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-5xl flex flex-col items-start gap-2">
              <TextReveal delay={0.15}>Engineering Philosophy</TextReveal>
            </h2>
            <FadeUp delay={0.2}>
              <div className="mt-8 h-[2px] w-32 bg-gradient-to-r from-[#50C878] to-transparent" />
            </FadeUp>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {APPROACH.map((item, idx) => (
              <FadeUp key={item.title} delay={0.1 * (idx + 1)}>
                <TiltCard>
                  <div className="group h-full rounded-3xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-950/60 shadow-sm dark:shadow-none p-8 transition-all duration-500 hover:border-[#50C878]/40 dark:hover:border-[#50C878]/30 hover:shadow-md dark:hover:shadow-none overflow-hidden relative">
                    {/* Hover glow overlay */}
                    <div className="absolute -inset-px bg-gradient-to-br from-[#50C878]/5 dark:from-[#50C878]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-[#50C878]/10 text-[#50C878] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#50C878] group-hover:text-zinc-950 group-hover:shadow-[0_0_20px_rgba(80,200,120,0.4)]">
                        {item.icon}
                      </div>

                      {/* Title */}
                      <h3 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
