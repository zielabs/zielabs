"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, X, Pencil } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "@/app/actions/category.actions";
import { slugify } from "@/app/lib/utils";
import { useRouter } from "next/navigation";
import type { CategoryDisplay } from "@/app/lib/types";

interface CategoriesClientProps {
  categories: CategoryDisplay[];
}

export default function CategoriesClient({ categories }: CategoriesClientProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleNameChange(v: string) {
    setName(v);
    setSlug(slugify(v));
  }

  function handleSaveCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      let result;
      if (editingId) {
        result = await updateCategory(editingId, name, slug);
      } else {
        result = await createCategory(name, slug);
      }
      
      if (!result.success) {
        setError(result.message);
        return;
      }
      setShowModal(false);
      setName("");
      setSlug("");
      setEditingId(null);
      router.refresh();
    });
  }

  function handleDelete(cat: CategoryDisplay) {
    if (!confirm(`Hapus kategori "${cat.name}"?`)) return;
    setDeletingId(cat.id);
    startTransition(async () => {
      const result = await deleteCategory(cat.id);
      if (!result.success) alert(`Gagal: ${result.message}`);
      setDeletingId(null);
      router.refresh();
    });
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-[#50C878]/50 focus:ring-1 focus:ring-[#50C878]/30 transition-colors";

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => {
            setError(null);
            setName("");
            setSlug("");
            setEditingId(null);
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#50C878] px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-all hover:bg-[#50C878]/90 hover:shadow-[0_0_15px_rgba(80,200,120,0.3)]"
        >
          <Plus className="size-4" />
          Tambah Kategori
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <span className="text-4xl select-none opacity-30">⬡</span>
          <p className="text-zinc-500 text-sm">Belum ada kategori.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/5">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-zinc-900/50">
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Nama Kategori
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Slug
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500 text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="group transition-colors hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-zinc-200">
                      {cat.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-zinc-400">
                      {cat.slug}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditingId(cat.id);
                          setName(cat.name);
                          setSlug(cat.slug);
                          setError(null);
                          setShowModal(true);
                        }}
                        disabled={isPending}
                        className="rounded-lg p-2 text-zinc-500 hover:bg-blue-500/10 hover:text-blue-400 transition-colors disabled:opacity-50"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        disabled={isPending && deletingId === cat.id}
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

      {/* Modal Kategori */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-100">{editingId ? "Edit Kategori" : "Tambah Kategori"}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/5 hover:text-zinc-200 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400 border border-red-500/20">
                {error}
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Nama <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className={inputClass}
                  placeholder="Misal: Web App"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Slug <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className={`${inputClass} font-mono`}
                  placeholder="web-app"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg bg-[#50C878] px-5 py-2 text-sm font-semibold text-zinc-950 transition-all hover:bg-[#50C878]/90 disabled:opacity-50"
                >
                  {isPending ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
