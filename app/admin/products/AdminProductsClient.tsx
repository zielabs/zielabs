// app/admin/products/AdminProductsClient.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin Products table — selalu dark (dikontrol layout).
// Dibersihkan: border-white/5, bg-zinc-900/50, hover:bg-white/[0.02] dipertahankan
// karena sudah berada di context admin yang selalu dark.
// Fix: bg-zinc-800 thumbnail → bg-zinc-800 (sudah ok di dark context)
// Fix: text-zinc-200 → text-zinc-100 untuk konsistensi
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import type { ProductDisplay, CategoryDisplay } from "@/app/lib/types";
import { truncate } from "@/app/lib/utils";
import { deleteProduct } from "@/app/actions/product.actions";
import ProductFormModal from "@/app/components/admin/ProductFormModal";
import { useRouter } from "next/navigation";

interface AdminProductsClientProps {
  products: ProductDisplay[];
  categories: CategoryDisplay[];
}

export default function AdminProductsClient({
  products,
  categories,
}: AdminProductsClientProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductDisplay | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    setEditProduct(undefined);
    setShowModal(true);
  }

  function handleEdit(product: ProductDisplay) {
    setEditProduct(product);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setEditProduct(undefined);
    router.refresh();
  }

  function handleDelete(product: ProductDisplay) {
    if (!confirm(`Hapus produk "${product.title}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setDeletingId(product.id);
    startTransition(async () => {
      const result = await deleteProduct(product.id);
      if (!result.success) alert(`Gagal: ${result.message}`);
      setDeletingId(null);
      router.refresh();
    });
  }

  return (
    <>
      {/* ── Toolbar ────────────────────────────────────── */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-[#50C878] px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-all hover:bg-[#50C878]/90 hover:shadow-[0_0_15px_rgba(80,200,120,0.3)]"
        >
          <Plus className="size-4" />
          Tambah Produk
        </button>
      </div>

      {/* ── Empty State ────────────────────────────────── */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-center border border-white/5 rounded-2xl bg-zinc-900/40">
          <span className="text-4xl select-none text-[#50C878] opacity-20">⬡</span>
          <p className="text-zinc-500 text-sm">Belum ada produk. Tambah produk pertama Anda!</p>
        </div>
      ) : (
        /* ── Table ─────────────────────────────────────── */
        <div className="overflow-hidden rounded-2xl border border-white/5">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-zinc-900/60">
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500">Gambar</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500">Produk</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500">Kategori</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500">Tech Stack</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((product) => (
                <tr key={product.id} className="group transition-colors hover:bg-white/[0.02]">
                  {/* Thumbnail */}
                  <td className="px-4 py-3">
                    <div className="size-12 overflow-hidden rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="size-full object-cover object-top"
                        />
                      ) : (
                        <span className="text-zinc-600 text-xs">—</span>
                      )}
                    </div>
                  </td>

                  {/* Title + Description */}
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-zinc-100">{product.title}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {truncate(product.description, 60)}
                    </p>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[#50C878]/10 px-2.5 py-1 text-xs font-medium text-[#50C878]">
                      {product.category.name}
                    </span>
                  </td>

                  {/* Tech Stack */}
                  <td className="px-4 py-3 text-xs text-zinc-400">{product.techStack}</td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {product.liveUrl && (
                        <a
                          href={product.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-zinc-200 transition-colors"
                        >
                          <ExternalLink className="size-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => handleEdit(product)}
                        className="rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-zinc-200 transition-colors"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        disabled={isPending && deletingId === product.id}
                        className="rounded-lg p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProductFormModal
          product={editProduct}
          categories={categories}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
