"use client";

import Link from "next/link";
import TiltCard from "./TiltCard";
import { motion } from "framer-motion";

// ─── Types ─────────────────────────────────────────────────────────

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  liveUrl: string | null;
  category: Category;
}

interface ProductCardProps {
  product: Product;
}

// ─── Component ─────────────────────────────────────────────────────

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <TiltCard>
      <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-zinc-950/80 backdrop-blur-md border border-white/5 transition-colors duration-500 hover:border-[#50C878]/30 glass-card">
        
        {/* ── Animated Gradient Border (visible on hover) ── */}
        <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute -inset-[2px] rounded-[18px] bg-gradient-to-r from-[#50C878]/50 via-transparent to-[#2660A4]/50 blur-sm" />
        </div>

        {/* ── Inner content container to mask the border gradient ── */}
        <div className="relative z-10 flex h-full flex-col bg-zinc-950/90 rounded-2xl overflow-hidden">
          {/* ── Ambient glow overlay ── */}
          <div
            className="pointer-events-none absolute -inset-px opacity-0 bg-[radial-gradient(ellipse_at_top,rgba(80,200,120,0.1),transparent_70%)] group-hover:opacity-100 transition-opacity duration-700"
            aria-hidden="true"
          />

          {/* ── Thumbnail ── */}
          <div className="relative aspect-video w-full overflow-hidden bg-zinc-900 border-b border-white/5">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt={product.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 noise-bg">
                <span className="text-zinc-700 text-xs uppercase tracking-widest select-none">
                  No Preview
                </span>
              </div>
            )}

            {/* Subtle gradient veil at bottom of image */}
            <div
              className="absolute bottom-0 inset-x-0 h-2/3 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none"
              aria-hidden="true"
            />
          </div>

          {/* ── Content ── */}
          <div className="flex flex-1 flex-col p-8 relative">
            <span className="mb-3 text-xs font-bold uppercase tracking-widest text-[#50C878]">
              {product.category.name}
            </span>

            <h3 className="mb-3 text-2xl font-bold leading-snug text-zinc-100 group-hover:text-white transition-colors duration-200">
              {product.title}
            </h3>

            <p className="mb-6 flex-1 text-sm leading-relaxed text-zinc-400 line-clamp-3">
              {product.description}
            </p>

            <div className="flex items-center gap-4 pt-5 border-t border-white/5">
              {product.liveUrl && (
                <Link
                  href={product.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-[#50C878] transition-colors duration-200 link-underline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4" aria-hidden="true">
                    <path fillRule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
                  </svg>
                  Live Demo
                </Link>
              )}

              <Link
                href={`/products/${product.slug}`}
                className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-[#50C878] transition-colors duration-200"
              >
                Details
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="size-4"
                  aria-hidden="true"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </motion.svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}
