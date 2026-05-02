// app/products/[slug]/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Product Detail Page — mengambil data via getProductBySlug(slug).
// Menampilkan gambar hero, deskripsi, tech stack, dan link demo.
// Menggunakan notFound() jika slug tidak ada di database.
// ─────────────────────────────────────────────────────────────────────────────

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Tag, Code2, Calendar } from "lucide-react";
import { getProductBySlug, getProducts } from "@/app/actions/product.actions";
import FadeUp from "@/app/components/ui/FadeUp";

// ─── Static Params untuk SSG ──────────────────────────────────────────────
export async function generateStaticParams() {
  const result = await getProducts();
  return (result.data ?? []).map((p) => ({ slug: p.slug }));
}

// ─── Dynamic Metadata ─────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProductBySlug(slug);
  if (!result.data) return { title: "Product Not Found" };
  return {
    title: result.data.title,
    description: result.data.description.slice(0, 160),
  };
}

// ─── Page Component ───────────────────────────────────────────────────────
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const product = result.data;
  const techItems = product.techStack
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-[#050505] pt-28 pb-32 noise-bg relative overflow-hidden">
      <div className="scanlines" />
      {/* Ambient glow */}
      <div className="hidden dark:block absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-[100%] bg-[#50C878]/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 md:px-8 relative z-10">

        {/* ── Back Button ────────────────────────────────────────── */}
        <FadeUp delay={0.05}>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-[#50C878] transition-colors duration-200 mb-10 group"
          >
            <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Kembali ke Products
          </Link>
        </FadeUp>

        {/* ── Category Badge ─────────────────────────────────────── */}
        <FadeUp delay={0.1}>
          <span className="inline-block mb-5 rounded-full border border-[#50C878]/30 bg-[#50C878]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#50C878]">
            {product.category.name}
          </span>
        </FadeUp>

        {/* ── Title ─────────────────────────────────────────────── */}
        <FadeUp delay={0.15}>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-5xl lg:text-6xl mb-6">
            {product.title}
          </h1>
        </FadeUp>

        {/* ── Action Links ──────────────────────────────────────── */}
        {product.liveUrl && (
          <FadeUp delay={0.2}>
            <div className="flex items-center gap-4 mb-12">
              <a
                href={product.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#50C878] px-6 py-2.5 text-sm font-bold text-zinc-950 transition-all duration-300 hover:bg-[#50C878]/90 hover:shadow-[0_0_20px_rgba(80,200,120,0.3)]"
              >
                <ExternalLink className="size-4" />
                Live Demo
              </a>
            </div>
          </FadeUp>
        )}

        {/* ── Hero Image ────────────────────────────────────────── */}
        {product.imageUrl && (
          <FadeUp delay={0.25}>
            <div className="relative mb-14 w-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-none bg-zinc-100 dark:bg-zinc-900 aspect-video">
              {/* Ambient glow overlay (matching ProductCard) */}
              <div
                className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_top,rgba(80,200,120,0.05),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(80,200,120,0.08),transparent_70%)]"
                aria-hidden="true"
              />
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1024px"
                className="object-cover object-top transition-all duration-700 ease-out"
              />
            </div>
          </FadeUp>
        )}

        {/* ── Body: Description + Sidebar Meta ──────────────────── */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">

          {/* Description */}
          <FadeUp delay={0.3} className="lg:col-span-2">
            <div className="rounded-3xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/40 p-8 md:p-10 shadow-sm dark:shadow-none">
              <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-[#50C878]">
                Tentang Produk
              </h2>
              <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-300 whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </FadeUp>

          {/* Sidebar Meta */}
          <FadeUp delay={0.35} className="flex flex-col gap-6">

            {/* Tech Stack Card */}
            <div className="rounded-3xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/40 p-6 shadow-sm dark:shadow-none">
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="size-4 text-[#50C878]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Tech Stack
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {techItems.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Category Card */}
            <div className="rounded-3xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/40 p-6 shadow-sm dark:shadow-none">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="size-4 text-[#50C878]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Kategori
                </h3>
              </div>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {product.category.name}
              </span>
            </div>

            {/* Published Card */}
            <div className="rounded-3xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/40 p-6 shadow-sm dark:shadow-none">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="size-4 text-[#50C878]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Dipublikasikan
                </h3>
              </div>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {new Date(product.createdAt).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </FadeUp>
        </div>
      </div>
    </main>
  );
}
