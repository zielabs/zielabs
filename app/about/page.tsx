// app/about/page.tsx

import type { Metadata } from "next";
import { Target, Zap, Shield, Code2 } from "lucide-react";
import TiltCard from "@/app/components/ui/TiltCard";
import TextReveal from "@/app/components/ui/TextReveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Zielabs adalah agensi produk digital premium yang berfokus pada rekayasa solusi enterprise-grade. Membangun Web App, Mobile App, POS, SaaS, dan Desktop App.",
};

const STATS = [
  { value: "5+", label: "Tahun Pengalaman" },
  { value: "50+", label: "Proyek Terselesaikan" },
  { value: "30+", label: "Klien Puas" },
  { value: "99%", label: "On-Time Delivery" },
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
    <main className="min-h-screen bg-[#050505] pt-32 pb-32 noise-bg relative overflow-hidden">
      <div className="scanlines" />
      <div className="absolute top-0 right-0 -mr-40 -mt-40 h-[600px] w-[600px] rounded-full bg-[#50C878]/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 mb-20 relative z-10">
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.4em] text-[#50C878]">
          About Us
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-100 md:text-6xl lg:text-7xl flex flex-col items-start gap-2">
          <TextReveal delay={0.1}>Merekayasa Masa Depan</TextReveal>
          <TextReveal delay={0.2}><span className="text-zinc-600">Produk Digital</span></TextReveal>
        </h1>
        <div className="mt-8 h-[2px] w-32 bg-gradient-to-r from-[#50C878] to-transparent" />
      </div>

      {/* Story Section */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 mb-32 relative z-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
          {/* Left: Story */}
          <div className="lg:col-span-3 space-y-8">
            <h2 className="text-2xl font-bold text-zinc-100 uppercase tracking-widest border-l-2 border-[#50C878] pl-4">
              Visi Kami
            </h2>
            <div className="space-y-6 text-base leading-relaxed text-zinc-400">
              <p>
                Zielabs lahir dari keyakinan bahwa setiap bisnis layak memiliki produk
                digital berkualitas enterprise — tanpa kompromi. Kami adalah tim engineer
                dan desainer yang terobsesi dengan kualitas, performa, dan keanggunan
                dalam setiap solusi yang kami bangun.
              </p>
              <p>
                Dari sistem inventarisasi enterprise seperti{" "}
                <span className="font-bold text-zinc-200">E-Borrow</span> hingga
                platform e-commerce headless, POS systems, dan SaaS products — kami
                menghadirkan solusi yang tidak hanya berfungsi, tetapi menginspirasi.
                Setiap proyek dieksekusi dengan arsitektur yang scalable, codebase yang
                bersih, dan UI/UX yang memukau.
              </p>
              <p>
                Estetika visual kami terinspirasi dari presisi engineering automotive
                kelas dunia — <span className="font-bold text-[#50C878]">Minimalist Luxury</span> bertemu <span className="font-bold text-[#2660A4]">Digital Cyberpunk</span>. 
                Obsidian Black dan Emerald Green bukan sekadar warna — ini adalah identitas.
              </p>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat, idx) => (
                <TiltCard key={stat.label}>
                  <div className="h-full rounded-3xl border border-white/5 bg-zinc-950/60 p-8 glass-card flex flex-col justify-center text-center transition-all duration-500 hover:border-[#50C878]/30 group">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#50C878]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
                    <p className="relative text-4xl font-bold text-[#50C878] drop-shadow-[0_0_15px_rgba(80,200,120,0.5)]">{stat.value}</p>
                    <p className="relative mt-2 text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      {stat.label}
                    </p>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="border-t border-white/5 pt-32 relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#2660A4]/40 to-transparent" />
        
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-20">
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.4em] text-[#50C878]">
              Our Approach
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-100 md:text-5xl flex flex-col items-start gap-2">
              <TextReveal delay={0.1}>Engineering Philosophy</TextReveal>
            </h2>
            <div className="mt-8 h-[2px] w-32 bg-gradient-to-r from-[#50C878] to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {APPROACH.map((item) => (
              <TiltCard key={item.title}>
                <div className="group h-full rounded-3xl border border-white/5 bg-zinc-950/60 p-8 glass-card transition-all duration-500 hover:border-[#50C878]/30 overflow-hidden relative">
                  <div className="absolute -inset-px bg-gradient-to-br from-[#50C878]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-[#50C878]/10 text-[#50C878] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#50C878] group-hover:text-zinc-950 group-hover:shadow-[0_0_20px_rgba(80,200,120,0.5)]">
                      {item.icon}
                    </div>
                    <h3 className="mb-4 text-lg font-bold text-zinc-100 group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors">
                      {item.description}
                    </p>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
