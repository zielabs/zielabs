// app/components/admin/ProductFormModal.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Modal form untuk Create/Update produk di admin dashboard.
//
// VALIDASI ZOD (BARU):
// - Client-side validation sebelum memanggil Server Action
// - fieldErrors state: Record<fieldName, errorMessage[]>
// - Feedback visual per-field: teks merah di bawah setiap input
// - AnimatePresence pada error messages untuk transisi yang elegan
//
// FLOW:
// 1. User submit form
// 2. Zod validate semua field → jika gagal, tampilkan error per field
// 3. Jika valid, kirim ke Server Action (createProduct/updateProduct)
// 4. Jika Server Action gagal → tampilkan error global di banner
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState, useTransition, useRef } from "react";
import { X, Upload, ImageIcon, AlertCircle } from "lucide-react";
import type { ProductDisplay, CategoryDisplay } from "@/app/lib/types";
import { createProduct, updateProduct } from "@/app/actions/product.actions";
import { slugify } from "@/app/lib/utils";
import { createProductSchema } from "@/app/lib/validations/product.schema";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface ProductFormModalProps {
  product?: ProductDisplay;
  categories: CategoryDisplay[];
  onClose: () => void;
}

// Tipe untuk field errors dari Zod flatten
type FieldErrors = Partial<Record<string, string[]>>;

// Animasi error message — spring yang elegan
const errorVariants = {
  hidden: { opacity: 0, y: -4, height: 0 },
  visible: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
  exit: {
    opacity: 0,
    y: -4,
    height: 0,
    transition: { duration: 0.15 },
  },
};

// Komponen kecil untuk menampilkan error di bawah setiap field
function FieldError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={errors[0]}
        variants={errorVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="mt-1.5 flex items-center gap-1 text-xs text-red-400 overflow-hidden"
        role="alert"
      >
        <AlertCircle className="size-3 flex-shrink-0" />
        {errors[0]}
      </motion.p>
    </AnimatePresence>
  );
}

export default function ProductFormModal({
  product,
  categories,
  onClose,
}: ProductFormModalProps) {
  const router = useRouter();
  const isEditing = !!product;
  const [isPending, startTransition] = useTransition();

  // State untuk error global (dari Server Action)
  const [globalError, setGlobalError] = useState<string | null>(null);
  // State untuk error per-field (dari Zod)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    product?.imageUrl ?? null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Controlled inputs untuk field yang perlu auto-derivasi (title → slug)
  const [title, setTitle] = useState(product?.title ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");

  function handleTitleChange(value: string) {
    setTitle(value);
    // Auto-generate slug dari title hanya saat mode Create
    if (!isEditing) setSlug(slugify(value));
    // Clear error field saat user mengetik
    if (fieldErrors.title) {
      setFieldErrors((prev) => ({ ...prev, title: undefined }));
    }
  }

  function handleSlugChange(value: string) {
    setSlug(value);
    if (fieldErrors.slug) {
      setFieldErrors((prev) => ({ ...prev, slug: undefined }));
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleFieldChange(fieldName: string) {
    // Generic handler untuk clear field error saat user berinteraksi
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGlobalError(null);
    setFieldErrors({});

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);

    // Sync controlled values ke FormData
    formData.set("title", title);
    formData.set("slug", slug);
    // isFeatured dikirim sebagai string "on" jika checkbox tercentang, kalau tidak null, ubah ke string untuk Zod
    formData.set("isFeatured", formData.get("isFeatured") === "on" ? "true" : "false");

    // ── CLIENT-SIDE ZOD VALIDATION ────────────────────────────────
    // Bangun object untuk divalidasi dari FormData
    const rawData = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      techStack: formData.get("techStack") as string,
      // imageUrl: bisa berupa file upload (diabaikan oleh Zod URL schema)
      //           atau string URL jika sudah ada (untuk mode edit)
      imageUrl: previewUrl?.startsWith("data:")
        ? undefined // Base64 dari file upload → skip URL validation
        : (previewUrl ?? undefined),
      liveUrl: (formData.get("liveUrl") as string) || undefined,
      categoryId: Number(formData.get("categoryId")),
      isFeatured: formData.get("isFeatured") === "true",
    };

    const result = createProductSchema.safeParse(rawData);

    if (!result.success) {
      // Ekstrak field errors dari Zod dan set ke state
      const zodErrors = result.error.flatten().fieldErrors;
      setFieldErrors(zodErrors as FieldErrors);
      return; // Hentikan submit, tampilkan errors
    }

    // ── SERVER ACTION ──────────────────────────────────────────────
    startTransition(async () => {
      const actionResult = isEditing
        ? await updateProduct(product.id, formData)
        : await createProduct(formData);

      if (!actionResult.success) {
        setGlobalError(actionResult.message);
        return;
      }
      onClose();
      router.refresh(); // Memaksa sinkronisasi UI setelah Server Action sukses
    });
  }

  return (
    // Overlay backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        // Tutup modal saat click di luar konten
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ────────────────────────────────────────────── */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-100">
            {isEditing ? "Edit Produk" : "Tambah Produk"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/5 hover:text-zinc-200 transition-colors"
            aria-label="Tutup modal"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* ── Global Error Banner ────────────────────────────────── */}
        <AnimatePresence>
          {globalError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400 border border-red-500/20"
            >
              {globalError}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* ── Image Upload ───────────────────────────────────── */}
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
                  className="max-h-36 w-full rounded-xl object-cover object-top"
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

          {/* ── Judul ──────────────────────────────────────────── */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              Judul <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={`w-full rounded-lg border bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:ring-1 ${
                fieldErrors.title
                  ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                  : "border-white/10 focus:border-[#50C878]/50 focus:ring-[#50C878]/30"
              }`}
              placeholder="Nama produk..."
              aria-describedby={fieldErrors.title ? "title-error" : undefined}
            />
            <FieldError errors={fieldErrors.title} />
          </div>

          {/* ── Slug ───────────────────────────────────────────── */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              Slug <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              name="slug"
              className={`w-full rounded-lg border bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:ring-1 font-mono ${
                fieldErrors.slug
                  ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                  : "border-white/10 focus:border-[#50C878]/50 focus:ring-[#50C878]/30"
              }`}
              placeholder="nama-produk"
            />
            <FieldError errors={fieldErrors.slug} />
          </div>

          {/* ── Deskripsi ──────────────────────────────────────── */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              Deskripsi <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              defaultValue={product?.description ?? ""}
              rows={3}
              onChange={() => handleFieldChange("description")}
              className={`w-full resize-none rounded-lg border bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:ring-1 ${
                fieldErrors.description
                  ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                  : "border-white/10 focus:border-[#50C878]/50 focus:ring-[#50C878]/30"
              }`}
              placeholder="Deskripsi produk..."
            />
            <FieldError errors={fieldErrors.description} />
          </div>

          {/* ── Tech Stack + Kategori ──────────────────────────── */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
                Tech Stack <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="techStack"
                defaultValue={product?.techStack ?? ""}
                onChange={() => handleFieldChange("techStack")}
                className={`w-full rounded-lg border bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:ring-1 ${
                  fieldErrors.techStack
                    ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                    : "border-white/10 focus:border-[#50C878]/50 focus:ring-[#50C878]/30"
                }`}
                placeholder="React, Node.js..."
              />
              <FieldError errors={fieldErrors.techStack} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
                Kategori <span className="text-red-400">*</span>
              </label>
              <select
                name="categoryId"
                defaultValue={product?.category.id ?? categories[0]?.id ?? ""}
                onChange={() => handleFieldChange("categoryId")}
                className={`w-full rounded-lg border bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:ring-1 ${
                  fieldErrors.categoryId
                    ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                    : "border-white/10 focus:border-[#50C878]/50 focus:ring-[#50C878]/30"
                }`}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <FieldError errors={fieldErrors.categoryId} />
            </div>
          </div>

          {/* ── Live URL ───────────────────────────────────────── */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              Live URL <span className="text-zinc-600">(opsional)</span>
            </label>
            <input
              type="text"
              name="liveUrl"
              defaultValue={product?.liveUrl ?? ""}
              onChange={() => handleFieldChange("liveUrl")}
              className={`w-full rounded-lg border bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:ring-1 ${
                fieldErrors.liveUrl
                  ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                  : "border-white/10 focus:border-[#50C878]/50 focus:ring-[#50C878]/30"
              }`}
              placeholder="https://..."
            />
            <FieldError errors={fieldErrors.liveUrl} />
          </div>

          {/* ── Featured Toggle ────────────────────────────────── */}
          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              defaultChecked={(product as any)?.isFeatured ?? false}
              className="size-4 rounded border-white/10 bg-zinc-900 text-[#50C878] focus:ring-[#50C878]/30"
            />
            <label htmlFor="isFeatured" className="text-sm font-medium text-zinc-300">
              Tampilkan di Homepage (Featured)
            </label>
          </div>

          {/* ── Actions ────────────────────────────────────────── */}
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
      </motion.div>
    </div>
  );
}
