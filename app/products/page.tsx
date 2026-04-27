// app/products/page.tsx

import ProductGrid from "./ProductGrid";
import type { Metadata } from "next";
import { getProducts, getCategories } from "@/app/actions/product.actions";
import TextReveal from "@/app/components/ui/TextReveal";

export const metadata: Metadata = {
  title: "Products",
  description: "Portofolio produk digital yang direkayasa oleh Zielabs.",
};

export default async function ProductsPage() {
  const [productsResult, categoriesResult] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const products = (productsResult.data ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    imageUrl: p.imageUrl ?? null,
    liveUrl: p.liveUrl ?? null,
    category: {
      id: p.category.id,
      name: p.category.name,
      slug: p.category.slug,
    },
  }));

  const categories = categoriesResult.data ?? [];

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-32 noise-bg relative overflow-hidden">
      <div className="scanlines" />
      <div className="absolute top-0 right-0 -mr-40 -mt-40 h-[600px] w-[600px] rounded-full bg-[#50C878]/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 mb-16 relative z-10">
        <div className="max-w-3xl">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.4em] text-[#50C878]">
            Portfolio
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100 md:text-6xl lg:text-7xl flex flex-col items-start gap-2">
            <TextReveal delay={0.1}>Digital Products</TextReveal>
            <TextReveal delay={0.2}><span className="text-zinc-600">We&apos;ve Built</span></TextReveal>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-zinc-400">
            Setiap produk adalah bukti dari komitmen kami terhadap engineering excellence,
            scalable architecture, dan premium user experience.
          </p>
          <div className="mt-8 h-[2px] w-32 bg-gradient-to-r from-[#50C878] to-transparent" />

          {/* Category Pills */}
          {categories.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-3">
              <span className="rounded-full border border-[#50C878]/50 bg-[#50C878]/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#50C878] shadow-[0_0_15px_rgba(80,200,120,0.2)]">
                Semua ({products.length})
              </span>
              {categories.map((cat) => {
                const count = products.filter((p) => p.category.slug === cat.slug).length;
                return (
                  <span
                    key={cat.id}
                    className="rounded-full border border-white/10 bg-zinc-900/50 px-5 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:text-zinc-200 cursor-pointer"
                  >
                    {cat.name} <span className="opacity-50">({count})</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Grid */}
      <section className="relative z-10">
        {products.length === 0 ? (
          <div className="mx-auto max-w-7xl px-4 md:px-8 mt-12">
            <div className="flex flex-col items-center justify-center py-24 text-center border border-white/5 rounded-3xl glass-card">
              <span className="text-6xl select-none opacity-20 mb-6 drop-shadow-[0_0_15px_rgba(80,200,120,0.3)] text-[#50C878]">⬡</span>
              <h3 className="text-xl font-bold text-zinc-200 mb-2 uppercase tracking-widest">No Architecture Found</h3>
              <p className="text-zinc-500 text-sm">Belum ada portofolio produk yang ditambahkan ke database.</p>
            </div>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>
    </main>
  );
}
