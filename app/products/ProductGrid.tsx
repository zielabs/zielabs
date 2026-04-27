// app/products/ProductGrid.tsx

"use client";

import { motion } from "framer-motion";
import ProductCard from "@/app/components/ui/ProductCard";

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

interface ProductGridProps {
  products: Product[];
}

// ─── Framer Motion Variants ─────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

// ─── Component ─────────────────────────────────────────────────────

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-24 flex flex-col items-center gap-3">
        <span className="text-4xl select-none">⬡</span>
        <p className="text-zinc-500 text-sm tracking-wide">No products yet.</p>
      </div>
    );
  }

  return (
    <motion.ul
      role="list"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={[
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
        "w-full max-w-7xl mx-auto px-4 md:px-8",
        "list-none p-0 m-0",
      ].join(" ")}
    >
      {products.map((product) => (
        <motion.li key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.li>
      ))}
    </motion.ul>
  );
}
