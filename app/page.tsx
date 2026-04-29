// app/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Homepage utama Zielabs. Semua warna menggunakan dark: Tailwind variants agar
// otomatis beradaptasi antara Light dan Dark mode.
//
// Light Mode: bg-zinc-50, text-zinc-900, border-zinc-200, card bg-white
// Dark Mode : bg-zinc-950, text-zinc-100, border-white/5, card glassmorphism
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Smartphone,
  ShoppingCart,
  Cloud,
  Monitor,
  Network,
  Target,
  Zap,
  Shield,
  Code2,
} from "lucide-react";
import HeroScene from "@/app/components/three/HeroSceneWrapper";
import ProductGrid from "@/app/products/ProductGrid";
import { getProducts } from "@/app/actions/product.actions";
import { getServices } from "@/app/actions/service.actions";
import { getTestimonials } from "@/app/actions/testimonial.actions";
import FadeUp from "@/app/components/ui/FadeUp";
import TextReveal from "@/app/components/ui/TextReveal";
import MagneticButton from "@/app/components/ui/MagneticButton";
import TiltCard from "@/app/components/ui/TiltCard";
import TestimonialCarousel from "@/app/components/ui/TestimonialCarousel";

// ─── Icon Mapping ──────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ReactNode> = {
  Globe: <Globe className="size-7" />,
  Smartphone: <Smartphone className="size-7" />,
  ShoppingCart: <ShoppingCart className="size-7" />,
  Cloud: <Cloud className="size-7" />,
  Monitor: <Monitor className="size-7" />,
  Network: <Network className="size-7" />,
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

// ─── Page ──────────────────────────────────────────────────────────

export default async function Home() {
  const [productsResult, servicesResult, testimonialsResult] = await Promise.all([
    getProducts(),
    getServices(),
    getTestimonials(),
  ]);

  const featuredProducts = (productsResult.data ?? []).slice(0, 3).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    techStack: p.techStack,
    imageUrl: p.imageUrl ?? null,
    liveUrl: p.liveUrl ?? null,
    category: {
      id: p.category.id,
      name: p.category.name,
      slug: p.category.slug,
    },
  }));

  const services = servicesResult.data ?? [];

  return (
    <main className="noise-bg">
      {/* ────────────────────────────────────────────────────────── */}
      {/*  HERO SECTION                                             */}
      {/* ────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* HeroScene 3D — absolut di belakang konten */}
        <HeroScene />
        {/* Scanlines — hanya terlihat di dark mode via CSS */}
        <div className="scanlines" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-8 mt-12">
          <FadeUp delay={0.1}>
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.4em] text-[#50C878]">
              Digital Product Agency
            </p>
          </FadeUp>

          <h1 className="text-5xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-100 md:text-7xl lg:text-8xl flex flex-col items-center">
            <TextReveal delay={0.2}>Engineering</TextReveal>
            <TextReveal delay={0.3}>
              <span className="bg-gradient-to-r from-[#50C878] via-[#A7FFD3] to-[#2660A4] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(80,200,120,0.4)]">
                Digital Excellence
              </span>
            </TextReveal>
          </h1>

          <FadeUp delay={0.5}>
            <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-zinc-500 dark:text-zinc-400 md:text-lg">
              Kami membangun produk digital berkelas enterprise — dari Web App dan Mobile
              App hingga POS, SaaS, dan Desktop Solutions dengan presisi tinggi.
            </p>
          </FadeUp>

          <FadeUp delay={0.6}>
            <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <MagneticButton>
                <Link
                  href="/products"
                  className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-[#50C878] px-8 py-4 text-sm font-bold uppercase tracking-wider text-zinc-950 transition-all duration-300 hover:bg-[#50C878]/90 hover:shadow-[0_0_40px_rgba(80,200,120,0.5)] overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Lihat Portfolio
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  href="#about"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-300 dark:border-white/10 bg-white/80 dark:bg-zinc-950/50 backdrop-blur-md px-8 py-4 text-sm font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 transition-all duration-300 hover:border-[#50C878]/50 hover:bg-[#50C878]/10 hover:text-[#50C878]"
                >
                  Tentang Kami
                </Link>
              </MagneticButton>
            </div>
          </FadeUp>
        </div>

        {/* Gradient fade ke background di bawah hero */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-50 dark:from-[#050505] via-zinc-50/80 dark:via-[#050505]/80 to-transparent"
          aria-hidden="true"
        />
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  SERVICES OVERVIEW                                        */}
      {/* ────────────────────────────────────────────────────────── */}
      <section id="services" className="py-24 md:py-32 relative">
        {/* Divider */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#50C878]/30 to-transparent" />

        <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10">
          <FadeUp delay={0.1}>
            <div className="mb-20 max-w-2xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#50C878]">
                What We Do
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-5xl flex flex-col items-start gap-2">
                <TextReveal delay={0.2}>Solusi Digital</TextReveal>
                <TextReveal delay={0.3}>
                  <span className="text-zinc-400 dark:text-zinc-600">End-to-End</span>
                </TextReveal>
              </h2>
            </div>
          </FadeUp>

          {services.length === 0 ? (
            <FadeUp delay={0.4}>
              <div className="flex flex-col items-center gap-3 py-16 text-center border border-zinc-200 dark:border-white/5 rounded-3xl glass-card">
                <span className="text-4xl select-none opacity-20">⬡</span>
                <p className="text-zinc-400 dark:text-zinc-500 text-sm tracking-widest uppercase">Layanan sedang dipersiapkan</p>
              </div>
            </FadeUp>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, idx) => (
                <FadeUp key={service.id} delay={0.1 * (idx + 1)}>
                  <TiltCard>
                    <div className="group h-full rounded-3xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-950/60 p-8 backdrop-blur-xl transition-all duration-500 hover:border-[#50C878]/30 hover:bg-zinc-50 dark:hover:bg-zinc-900/80 relative overflow-hidden shadow-sm dark:shadow-none">
                      <div className="absolute -inset-px bg-gradient-to-br from-[#50C878]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                      <div className="relative z-10">
                        <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-[#50C878]/10 text-[#50C878] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#50C878] group-hover:text-zinc-950 group-hover:shadow-[0_0_20px_rgba(80,200,120,0.4)]">
                          {ICON_MAP[service.icon ?? "Globe"] ?? <Globe className="size-7" />}
                        </div>
                        <h3 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </TiltCard>
                </FadeUp>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  ABOUT SECTION                                            */}
      {/* ────────────────────────────────────────────────────────── */}
      <section id="about" className="py-24 md:py-32 relative z-10 bg-zinc-50 dark:bg-[#050505]">
        {/* Divider */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#50C878]/30 to-transparent" />
        
        <div className="mx-auto max-w-7xl px-4 md:px-8 mb-20 relative z-10">
          <FadeUp delay={0.1}>
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.4em] text-[#50C878]">
              About Us
            </p>
          </FadeUp>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-5xl flex flex-col items-start gap-2">
            <TextReveal delay={0.1}>Merekayasa Masa Depan</TextReveal>
            <TextReveal delay={0.2}>
              <span className="text-zinc-400 dark:text-zinc-600">Produk Digital</span>
            </TextReveal>
          </h2>
          <FadeUp delay={0.3}>
            <div className="mt-8 h-[2px] w-32 bg-gradient-to-r from-[#50C878] to-transparent" />
          </FadeUp>
        </div>

        {/* ── Story Section ──────────────────────────────────────── */}
        <div className="mx-auto max-w-7xl px-4 md:px-8 mb-32 relative z-10">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
            {/* Left: Story */}
            <FadeUp delay={0.1} className="lg:col-span-3 space-y-8">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#50C878] to-[#A7FFD3] uppercase tracking-widest border-l-4 border-[#50C878] pl-4">
                Visi Kami
              </h3>
              <div className="space-y-6 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                <p>
                  Zielabs lahir dari keyakinan bahwa setiap bisnis layak memiliki produk
                  digital berkualitas enterprise — tanpa kompromi. Kami adalah tim engineer
                  dan desainer yang terobsesi dengan kualitas, performa, dan keanggunan
                  dalam setiap solusi yang kami bangun.
                </p>
                <p>
                  Dari sistem inventarisasi enterprise hingga platform e-commerce headless,
                  POS systems, dan SaaS products — kami menghadirkan solusi yang tidak hanya berfungsi,
                  tetapi menginspirasi. Setiap proyek dieksekusi dengan arsitektur yang scalable, codebase yang
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
                        <div className="absolute inset-0 bg-gradient-to-b from-[#50C878]/5 dark:from-[#50C878]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
                        <p className="relative text-3xl font-bold text-[#50C878] drop-shadow-[0_0_15px_rgba(80,200,120,0.3)]">
                          {stat.value}
                        </p>
                        <p className="relative mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                          {stat.label}
                        </p>
                      </div>
                    </TiltCard>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Approach Section ───────────────────────────────────── */}
        <div className="border-t border-zinc-200 dark:border-white/5 pt-24 relative z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#2660A4]/30 dark:via-[#2660A4]/40 to-transparent" />
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="mb-16 text-center max-w-2xl mx-auto">
              <FadeUp delay={0.1}>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-[#50C878]">
                  Our Approach
                </p>
              </FadeUp>
              <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-4xl">
                Engineering Philosophy
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {APPROACH.map((item, idx) => (
                <FadeUp key={item.title} delay={0.1 * (idx + 1)}>
                  <TiltCard>
                    <div className="group h-full rounded-3xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-950/60 shadow-sm dark:shadow-none p-6 transition-all duration-500 hover:border-[#50C878]/40 dark:hover:border-[#50C878]/30 overflow-hidden relative">
                      <div className="absolute -inset-px bg-gradient-to-br from-[#50C878]/5 dark:from-[#50C878]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
                      <div className="relative z-10">
                        <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-[#50C878]/10 text-[#50C878] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#50C878] group-hover:text-zinc-950 group-hover:shadow-[0_0_20px_rgba(80,200,120,0.4)]">
                          {item.icon}
                        </div>
                        <h4 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </TiltCard>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  FEATURED PRODUCTS                                        */}
      {/* ────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Divider */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#50C878]/20 to-transparent" />

        {/* Glow ambient — hanya terlihat di dark */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 h-[600px] w-[600px] rounded-full bg-[#50C878]/5 blur-[120px] pointer-events-none dark:block hidden" />

        <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10">
          <FadeUp delay={0.1}>
            <div className="mb-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#50C878]">
                  Featured Work
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-5xl flex flex-col items-start gap-2">
                  <TextReveal delay={0.2}>Digital Products</TextReveal>
                  <TextReveal delay={0.3}>
                    <span className="text-zinc-400 dark:text-zinc-600">We&apos;ve Built</span>
                  </TextReveal>
                </h2>
              </div>
              <Link
                href="/products"
                className="hidden md:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 transition-colors hover:text-[#50C878] link-underline pb-1"
              >
                Lihat semua
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </FadeUp>

          {featuredProducts.length === 0 ? (
            <FadeUp delay={0.2}>
              <div className="flex flex-col items-center gap-3 py-16 text-center border border-zinc-200 dark:border-white/5 rounded-3xl glass-card">
                <span className="text-4xl select-none opacity-20">⬡</span>
                <p className="text-zinc-400 dark:text-zinc-500 text-sm tracking-widest uppercase">Belum ada portofolio produk</p>
              </div>
            </FadeUp>
          ) : (
            <FadeUp delay={0.2}>
              <ProductGrid products={featuredProducts} />
            </FadeUp>
          )}

          <FadeUp delay={0.3}>
            <div className="mt-12 text-center md:hidden">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 transition-colors hover:text-[#50C878] link-underline pb-1"
              >
                Lihat semua produk
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  TESTIMONIALS SECTION                                     */}
      {/* ────────────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-zinc-300/50 dark:via-[#2660A4]/30 to-transparent" />

        <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10">
          <FadeUp delay={0.1}>
            <div className="mb-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#50C878]">
                  Client Testimonials
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-5xl flex flex-col items-start gap-2">
                  <TextReveal delay={0.2}>Apa Kata</TextReveal>
                  <TextReveal delay={0.3}>
                    <span className="text-zinc-400 dark:text-zinc-600">Klien Kami</span>
                  </TextReveal>
                </h2>
              </div>
            </div>
          </FadeUp>

          {(!testimonialsResult.data || testimonialsResult.data.length === 0) ? (
            <FadeUp delay={0.2}>
              <div className="flex flex-col items-center gap-3 py-16 text-center border border-zinc-200 dark:border-white/5 rounded-3xl glass-card">
                <span className="text-4xl select-none opacity-20">⬡</span>
                <p className="text-zinc-400 dark:text-zinc-500 text-sm tracking-widest uppercase">Belum ada testimoni</p>
              </div>
            </FadeUp>
          ) : (
            <FadeUp delay={0.2}>
              <TestimonialCarousel testimonials={testimonialsResult.data ?? []} />
            </FadeUp>
          )}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  CTA SECTION                                              */}
      {/* ────────────────────────────────────────────────────────── */}
      <section className="py-32 md:py-48 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#50C878]/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(80,200,120,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_center,rgba(80,200,120,0.1),transparent_50%)] pointer-events-none" />
        <div className="scanlines" />

        <div className="mx-auto max-w-3xl px-4 text-center md:px-8 relative z-10">
          <FadeUp delay={0.1}>
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.4em] text-[#50C878]">
              Ready to Start?
            </p>
          </FadeUp>
          <h2 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-6xl flex flex-col items-center gap-2">
            <TextReveal delay={0.2}>Mari Wujudkan</TextReveal>
            <TextReveal delay={0.3}>
              <span className="bg-gradient-to-r from-[#50C878] to-[#A7FFD3] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(80,200,120,0.3)]">
                Ide Digital Anda
              </span>
            </TextReveal>
          </h2>
          <FadeUp delay={0.4}>
            <p className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
              Hubungi kami untuk konsultasi gratis tentang bagaimana Zielabs dapat
              membantu merealisasikan visi produk digital Anda dengan presisi engineering tingkat tinggi.
            </p>
          </FadeUp>
          <FadeUp delay={0.5}>
            <div className="mt-12">
              <MagneticButton>
                <a
                  href="mailto:hello@zielabs.com"
                  className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 dark:bg-zinc-100 px-10 py-5 text-sm font-bold uppercase tracking-wider text-zinc-100 dark:text-zinc-950 transition-all duration-300 hover:bg-zinc-800 dark:hover:bg-white hover:shadow-[0_0_40px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Hubungi Kami
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 dark:via-zinc-400/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </a>
              </MagneticButton>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
