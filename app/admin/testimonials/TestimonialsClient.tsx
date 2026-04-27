// app/admin/testimonials/TestimonialsClient.tsx

"use client";

import { useState, useTransition, useRef } from "react";
import { Plus, Pencil, Trash2, X, Star, ImageIcon, Upload } from "lucide-react";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/app/actions/testimonial.actions";
import { getInitials, truncate } from "@/app/lib/utils";
import { useRouter } from "next/navigation";

interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatarUrl: string | null;
  rating: number;
}

// ─── Star Rating Input ─────────────────────────────────────────────

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`size-5 transition-colors ${
              star <= (hover || value)
                ? "fill-[#50C878] text-[#50C878]"
                : "text-zinc-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Testimonial Modal ─────────────────────────────────────────────

function TestimonialModal({
  testimonial,
  onClose,
}: {
  testimonial?: TestimonialItem;
  onClose: () => void;
}) {
  const isEditing = !!testimonial;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(testimonial?.rating ?? 5);
  const [previewUrl, setPreviewUrl] = useState<string | null>(testimonial?.avatarUrl ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("rating", String(rating));

    startTransition(async () => {
      const result = isEditing
        ? await updateTestimonial(testimonial.id, formData)
        : await createTestimonial(formData);

      if (!result.success) { setError(result.message); return; }
      router.refresh();
      onClose();
    });
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-[#50C878]/50 focus:ring-1 focus:ring-[#50C878]/30 transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-100">
            {isEditing ? "Edit Testimonial" : "Tambah Testimonial"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/5 hover:text-zinc-200 transition-colors">
            <X className="size-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400 border border-red-500/20">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Upload */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">Foto Avatar</label>
            <div
              className="relative flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-white/10 bg-zinc-900 p-4 hover:border-[#50C878]/40 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="size-16 overflow-hidden rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                {previewUrl ? (
                  <img src={previewUrl} alt="Avatar" className="size-full object-cover" />
                ) : (
                  <ImageIcon className="size-6 text-zinc-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-zinc-400 flex items-center gap-1">
                  <Upload className="size-3.5" />
                  Klik untuk pilih foto
                </p>
                <p className="text-xs text-zinc-600 mt-0.5">JPG, PNG, WebP · Maks 2MB</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              name="avatarFile"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Name + Company */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">Nama *</label>
              <input type="text" name="name" defaultValue={testimonial?.name ?? ""} required className={inputClass} placeholder="Budi Santoso" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">Perusahaan *</label>
              <input type="text" name="company" defaultValue={testimonial?.company ?? ""} required className={inputClass} placeholder="PT. Maju Bersama" />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">Jabatan *</label>
            <input type="text" name="role" defaultValue={testimonial?.role ?? ""} required className={inputClass} placeholder="CEO, CTO, Product Manager..." />
          </div>

          {/* Content */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">Isi Testimoni *</label>
            <textarea name="content" defaultValue={testimonial?.content ?? ""} required rows={4} className={`${inputClass} resize-none`} placeholder="Tulis testimoni klien di sini..." />
          </div>

          {/* Rating */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-400">Rating *</label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors">Batal</button>
            <button type="submit" disabled={isPending} className="rounded-lg bg-[#50C878] px-5 py-2 text-sm font-semibold text-zinc-950 transition-all hover:bg-[#50C878]/90 disabled:opacity-50">
              {isPending ? "Menyimpan..." : isEditing ? "Perbarui" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Client Component ─────────────────────────────────────────

export default function TestimonialsClient({
  testimonials,
}: {
  testimonials: TestimonialItem[];
}) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editTestimonial, setEditTestimonial] = useState<TestimonialItem | undefined>();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  function handleDelete(t: TestimonialItem) {
    if (!confirm(`Hapus testimonial dari "${t.name}"?`)) return;
    setDeletingId(t.id);
    startTransition(async () => {
      const result = await deleteTestimonial(t.id);
      if (!result.success) alert(`Gagal: ${result.message}`);
      setDeletingId(null);
      router.refresh();
    });
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => { setEditTestimonial(undefined); setShowModal(true); }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#50C878] px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-all hover:bg-[#50C878]/90 hover:shadow-[0_0_15px_rgba(80,200,120,0.3)]"
        >
          <Plus className="size-4" />
          Tambah Testimonial
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <span className="text-4xl select-none">⬡</span>
          <p className="text-zinc-500 text-sm">Belum ada testimonial.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="group rounded-2xl border border-white/5 bg-zinc-950/80 p-5 backdrop-blur-md transition-colors hover:border-[#50C878]/20">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-9 overflow-hidden rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-[#50C878] flex-shrink-0">
                    {t.avatarUrl ? (
                      <img src={t.avatarUrl} alt={t.name} className="size-full object-cover" />
                    ) : (
                      getInitials(t.name)
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{t.name}</p>
                    <p className="text-[11px] text-zinc-500">{t.role} — {t.company}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditTestimonial(t); setShowModal(true); }} className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/5 hover:text-zinc-200 transition-colors">
                    <Pencil className="size-3" />
                  </button>
                  <button onClick={() => handleDelete(t)} disabled={deletingId === t.id} className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-50">
                    <Trash2 className="size-3" />
                  </button>
                </div>
              </div>
              <div className="mb-2 flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={`size-3 ${i < t.rating ? "fill-[#50C878] text-[#50C878]" : "text-zinc-700"}`} />
                ))}
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">&ldquo;{truncate(t.content, 120)}&rdquo;</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <TestimonialModal testimonial={editTestimonial} onClose={() => { setShowModal(false); setEditTestimonial(undefined); }} />
      )}
    </>
  );
}
