// app/page.tsx

import Link from "next/link";
import { ArrowRight, Globe, Smartphone, ShoppingCart, Cloud, Monitor, Network, Star, Quote } from "lucide-react";
import HeroScene from "@/app/components/three/HeroScene";
import ProductGrid from "@/app/products/ProductGrid";
import { getProducts } from "@/app/actions/product.actions";
import { getServices } from "@/app/actions/service.actions";
import { getTestimonials } from "@/app/actions/testimonial.actions";
import { getInitials } from "@/app/lib/utils";
import FadeUp from "@/app/components/ui/FadeUp";
import TextReveal from "@/app/components/ui/TextReveal";
import MagneticButton from "@/app/components/ui/MagneticButton";
import TiltCard from "@/app/components/ui/TiltCard";

// ─── Icon Mapping ──────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ReactNode> = {
  Globe: <Globe className="size-7" />,
  Smartphone: <Smartphone className="size-7" />,
  ShoppingCart: <ShoppingCart className="size-7" />,
  Cloud: <Cloud className="size-7" />,
  Monitor: <Monitor className="size-7" />,
  Network: <Network className="size-7" />,
};

// ─── Page ──────────────────────────────────────────────────────────

export default async function Home() {
  const [productsResult, servicesResult, testimonialsResult] = await Promise.all([
    getProducts(),
    getServices(),
    getTestimonials(),
  ]);

  const products = (productsResult.data ?? []).map((p) => ({
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
  const featuredProducts = products.slice(0, 3);
  const featuredTestimonials = (testimonialsResult.data ?? []).slice(0, 3);

  return (
    <main className="noise-bg">
      {/* ────────────────────────────────────────────────────────── */}
      {/*  HERO SECTION                                             */}
      {/* ────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <HeroScene />
        <div className="scanlines" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-8 mt-12">
          <FadeUp delay={0.1}>
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.4em] text-[#50C878]">
              Digital Product Agency
            </p>
          </FadeUp>
          
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-zinc-100 md:text-7xl lg:text-8xl flex flex-col items-center">
            <TextReveal delay={0.2}>Engineering</TextReveal>
            <TextReveal delay={0.3}>
              <span className="bg-gradient-to-r from-[#50C878] via-[#A7FFD3] to-[#2660A4] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(80,200,120,0.4)]">
                Digital Excellence
              </span>
            </TextReveal>
          </h1>

          <FadeUp delay={0.5}>
            <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-zinc-400 md:text-lg mix-blend-screen">
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
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-zinc-950/50 backdrop-blur-md px-8 py-4 text-sm font-bold uppercase tracking-wider text-zinc-300 transition-all duration-300 hover:border-[#50C878]/50 hover:bg-[#50C878]/10 hover:text-[#50C878]"
                >
                  Tentang Kami
                </Link>
              </MagneticButton>
            </div>
          </FadeUp>
        </div>

        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"
          aria-hidden="true"
        />
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  SERVICES OVERVIEW                                        */}
      {/* ────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 relative">
        <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10">
          <FadeUp delay={0.1}>
            <div className="mb-20 max-w-2xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#50C878]">
                What We Do
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-100 md:text-5xl flex flex-col items-start gap-2">
                <TextReveal delay={0.2}>Solusi Digital</TextReveal>
                <TextReveal delay={0.3}><span className="text-zinc-600">End-to-End</span></TextReveal>
              </h2>
            </div>
          </FadeUp>

          {services.length === 0 ? (
            <FadeUp delay={0.4}>
              <div className="flex flex-col items-center gap-3 py-16 text-center border border-white/5 rounded-3xl glass-card">
                <span className="text-4xl select-none opacity-20">⬡</span>
                <p className="text-zinc-500 text-sm tracking-widest uppercase">Layanan sedang dipersiapkan</p>
              </div>
            </FadeUp>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, idx) => (
                <FadeUp key={service.id} delay={0.1 * (idx + 1)}>
                  <TiltCard>
                    <div className="group h-full rounded-3xl border border-white/5 bg-zinc-950/60 p-8 backdrop-blur-xl transition-all duration-500 hover:border-[#50C878]/30 hover:bg-zinc-900/80 relative overflow-hidden">
                      <div className="absolute -inset-px bg-gradient-to-br from-[#50C878]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                      
                      <div className="relative z-10">
                        <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-[#50C878]/10 text-[#50C878] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#50C878] group-hover:text-zinc-950 group-hover:shadow-[0_0_20px_rgba(80,200,120,0.4)]">
                          {ICON_MAP[service.icon ?? "Globe"] ?? <Globe className="size-7" />}
                        </div>
                        <h3 className="mb-4 text-xl font-bold text-zinc-100 group-hover:text-white transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </TiltCard>
                </FadeUp>
              ))}
            </div>
          )}

          <FadeUp delay={0.5}>
            <div className="mt-16 text-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:text-[#50C878] link-underline pb-1"
              >
                Lihat semua layanan
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  FEATURED PRODUCTS                                        */}
      {/* ────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Animated Gradient Divider */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#50C878]/50 to-transparent" />
        
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 h-[600px] w-[600px] rounded-full bg-[#50C878]/5 blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10">
          <FadeUp delay={0.1}>
            <div className="mb-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#50C878]">
                  Featured Work
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-100 md:text-5xl flex flex-col items-start gap-2">
                  <TextReveal delay={0.2}>Digital Products</TextReveal>
                  <TextReveal delay={0.3}><span className="text-zinc-600">We&apos;ve Built</span></TextReveal>
                </h2>
              </div>
              <Link
                href="/products"
                className="hidden md:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:text-[#50C878] link-underline pb-1"
              >
                Lihat semua
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </FadeUp>

          {featuredProducts.length === 0 ? (
            <FadeUp delay={0.2}>
              <div className="flex flex-col items-center gap-3 py-16 text-center border border-white/5 rounded-3xl glass-card">
                <span className="text-4xl select-none opacity-20">⬡</span>
                <p className="text-zinc-500 text-sm tracking-widest uppercase">Belum ada portofolio produk</p>
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
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:text-[#50C878] link-underline pb-1"
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
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#2660A4]/30 to-transparent" />
        
        <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10">
          <FadeUp delay={0.1}>
            <div className="mb-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#50C878]">
                  Client Testimonials
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-100 md:text-5xl flex flex-col items-start gap-2">
                  <TextReveal delay={0.2}>Apa Kata</TextReveal>
                  <TextReveal delay={0.3}><span className="text-zinc-600">Klien Kami</span></TextReveal>
                </h2>
              </div>
              <Link
                href="/testimonials"
                className="hidden md:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:text-[#50C878] link-underline pb-1"
              >
                Lihat semua
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </FadeUp>

          {featuredTestimonials.length === 0 ? (
            <FadeUp delay={0.2}>
              <div className="flex flex-col items-center gap-3 py-16 text-center border border-white/5 rounded-3xl glass-card">
                <span className="text-4xl select-none opacity-20">⬡</span>
                <p className="text-zinc-500 text-sm tracking-widest uppercase">Belum ada testimoni</p>
              </div>
            </FadeUp>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredTestimonials.map((t, idx) => (
                <FadeUp key={t.id} delay={0.1 * (idx + 1)}>
                  <TiltCard>
                    <div className="group relative h-full rounded-3xl border border-white/5 bg-zinc-950/60 p-8 glass-card transition-all duration-500 hover:border-[#50C878]/30">
                      <div className="absolute -inset-px bg-gradient-to-br from-[#50C878]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
                      
                      <div className="relative mb-8">
                        <Quote className="size-10 text-[#50C878]/20 group-hover:text-[#50C878]/50 transition-colors duration-500" />
                      </div>
                      <p className="relative mb-8 text-base leading-relaxed text-zinc-300 group-hover:text-zinc-100 transition-colors">
                        &ldquo;{t.content}&rdquo;
                      </p>
                      
                      <div className="mt-auto">
                        <div className="relative mb-6 flex gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`size-4 ${
                                i < t.rating
                                  ? "fill-[#50C878] text-[#50C878]"
                                  : "fill-zinc-800 text-zinc-800"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="relative flex items-center gap-4 pt-6 border-t border-white/5">
                          <div className="size-14 overflow-hidden rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-sm font-bold text-[#50C878] flex-shrink-0 group-hover:border-[#50C878]/50 transition-colors">
                            {t.avatarUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={t.avatarUrl} alt={t.name} className="size-full object-cover" />
                            ) : (
                              getInitials(t.name)
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-100">{t.name}</p>
                            <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">
                              {t.role}, <span className="text-zinc-400">{t.company}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </FadeUp>
              ))}
            </div>
          )}

          <FadeUp delay={0.4}>
            <div className="mt-12 text-center md:hidden">
              <Link
                href="/testimonials"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:text-[#50C878] link-underline pb-1"
              >
                Lihat semua testimoni
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/*  CTA SECTION                                              */}
      {/* ────────────────────────────────────────────────────────── */}
      <section className="py-32 md:py-48 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#E8652A]/30 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(80,200,120,0.1),transparent_50%)] pointer-events-none" />
        <div className="scanlines" />
        
        <div className="mx-auto max-w-3xl px-4 text-center md:px-8 relative z-10">
          <FadeUp delay={0.1}>
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.4em] text-[#50C878]">
              Ready to Start?
            </p>
          </FadeUp>
          <h2 className="text-4xl font-bold tracking-tight text-zinc-100 md:text-6xl flex flex-col items-center gap-2">
            <TextReveal delay={0.2}>Mari Wujudkan</TextReveal>
            <TextReveal delay={0.3}>
              <span className="bg-gradient-to-r from-[#50C878] to-[#A7FFD3] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(80,200,120,0.3)]">
                Ide Digital Anda
              </span>
            </TextReveal>
          </h2>
          <FadeUp delay={0.4}>
            <p className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-zinc-400">
              Hubungi kami untuk konsultasi gratis tentang bagaimana Zielabs dapat
              membantu merealisasikan visi produk digital Anda dengan presisi engineering tingkat tinggi.
            </p>
          </FadeUp>
          <FadeUp delay={0.5}>
            <div className="mt-12">
              <MagneticButton>
                <a
                  href="mailto:hello@zielabs.com"
                  className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-zinc-100 px-10 py-5 text-sm font-bold uppercase tracking-wider text-zinc-950 transition-all duration-300 hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Hubungi Kami
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-zinc-400/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </a>
              </MagneticButton>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
