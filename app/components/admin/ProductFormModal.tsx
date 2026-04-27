// app/components/admin/ProductFormModal.tsx

"use client";

import { useState, useTransition, useRef } from "react";
import { X, Upload, ImageIcon } from "lucide-react";
import type { ProductDisplay, CategoryDisplay } from "@/app/lib/types";
import { createProduct, updateProduct } from "@/app/actions/product.actions";
import { slugify } from "@/app/lib/utils";

interface ProductFormModalProps {
  product?: ProductDisplay;
  categories: CategoryDisplay[];
  onClose: () => void;
}

export default function ProductFormModal({
  product,
  categories,
  onClose,
}: ProductFormModalProps) {
  const isEditing = !!product;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    product?.imageUrl ?? null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(product?.title ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEditing) setSlug(slugify(value));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    // Sync controlled title & slug ke FormData
    formData.set("title", title);
    formData.set("slug", slug);

    startTransition(async () => {
      const result = isEditing
        ? await updateProduct(product.id, formData)
        : await createProduct(formData);

      if (!result.success) {
        setError(result.message);
        return;
      }
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-100">
            {isEditing ? "Edit Produk" : "Tambah Produk"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/5 hover:text-zinc-200 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              Gambar Produk
            </label>
            <div
              className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-zinc-900 transition-colors hover:border-[#50C878]/40 hover:bg-zinc-900/80"
              style={{ minHeight: "140px" }}
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-36 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 p-6 text-zinc-600">
                  <ImageIcon className="size-8" />
                  <p className="text-xs">Klik untuk pilih gambar</p>
                  <p className="text-[10px] text-zinc-700">JPG, PNG, WebP · Maks 2MB</p>
                </div>
              )}
              {previewUrl && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                  <Upload className="size-6 text-white" />
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              name="imageFile"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Title */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              Judul <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-[#50C878]/50 focus:ring-1 focus:ring-[#50C878]/30 transition-colors"
              placeholder="Nama produk..."
            />
          </div>

          {/* Slug */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              Slug <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              name="slug"
              required
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-[#50C878]/50 focus:ring-1 focus:ring-[#50C878]/30 transition-colors font-mono"
              placeholder="nama-produk"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              Deskripsi <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              defaultValue={product?.description ?? ""}
              required
              rows={3}
              className="w-full resize-none rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-[#50C878]/50 focus:ring-1 focus:ring-[#50C878]/30 transition-colors"
              placeholder="Deskripsi produk..."
            />
          </div>

          {/* Tech Stack + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
                Tech Stack <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="techStack"
                defaultValue={product?.techStack ?? ""}
                required
                className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-[#50C878]/50 focus:ring-1 focus:ring-[#50C878]/30 transition-colors"
                placeholder="React, Node.js..."
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
                Kategori <span className="text-red-400">*</span>
              </label>
              <select
                name="categoryId"
                defaultValue={product?.category.id ?? categories[0]?.id ?? ""}
                className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-[#50C878]/50 focus:ring-1 focus:ring-[#50C878]/30 transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Live URL */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              Live URL <span className="text-zinc-600">(opsional)</span>
            </label>
            <input
              type="text"
              name="liveUrl"
              defaultValue={product?.liveUrl ?? ""}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-[#50C878]/50 focus:ring-1 focus:ring-[#50C878]/30 transition-colors"
              placeholder="https://..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-[#50C878] px-5 py-2 text-sm font-semibold text-zinc-950 transition-all hover:bg-[#50C878]/90 hover:shadow-[0_0_15px_rgba(80,200,120,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Menyimpan..." : isEditing ? "Perbarui" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
