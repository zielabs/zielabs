// app/admin/services/ServicesClient.tsx

"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { createService, updateService, deleteService } from "@/app/actions/service.actions";
import { slugify, truncate } from "@/app/lib/utils";
import { useRouter } from "next/navigation";

interface ServiceItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon: string | null;
}

interface ServiceModalProps {
  service?: ServiceItem;
  onClose: () => void;
}

function ServiceModal({ service, onClose }: ServiceModalProps) {
  const isEditing = !!service;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(service?.title ?? "");
  const [slug, setSlug] = useState(service?.slug ?? "");

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!isEditing) setSlug(slugify(v));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("title", title);
    formData.set("slug", slug);

    startTransition(async () => {
      const result = isEditing
        ? await updateService(service.id, formData)
        : await createService(formData);

      if (!result.success) { setError(result.message); return; }
      router.refresh();
      onClose();
    });
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-[#50C878]/50 focus:ring-1 focus:ring-[#50C878]/30 transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-100">
            {isEditing ? "Edit Layanan" : "Tambah Layanan"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/5 hover:text-zinc-200 transition-colors">
            <X className="size-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400 border border-red-500/20">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">Judul *</label>
            <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)} required className={inputClass} placeholder="Web Application Development" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">Slug *</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} name="slug" required className={`${inputClass} font-mono`} placeholder="web-application-development" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">Deskripsi *</label>
            <textarea name="description" defaultValue={service?.description ?? ""} required rows={4} className={`${inputClass} resize-none`} placeholder="Deskripsi layanan..." />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              Icon <span className="text-zinc-600">(nama Lucide: Globe, Smartphone, Cloud...)</span>
            </label>
            <input type="text" name="icon" defaultValue={service?.icon ?? ""} className={inputClass} placeholder="Globe" />
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

export default function ServicesClient({ services }: { services: ServiceItem[] }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editService, setEditService] = useState<ServiceItem | undefined>();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  function handleDelete(service: ServiceItem) {
    if (!confirm(`Hapus layanan "${service.title}"?`)) return;
    setDeletingId(service.id);
    startTransition(async () => {
      const result = await deleteService(service.id);
      if (!result.success) alert(`Gagal: ${result.message}`);
      setDeletingId(null);
      router.refresh();
    });
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => { setEditService(undefined); setShowModal(true); }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#50C878] px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-all hover:bg-[#50C878]/90 hover:shadow-[0_0_15px_rgba(80,200,120,0.3)]"
        >
          <Plus className="size-4" />
          Tambah Layanan
        </button>
      </div>

      {services.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <span className="text-4xl select-none">⬡</span>
          <p className="text-zinc-500 text-sm">Belum ada layanan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {services.map((service) => (
            <div key={service.id} className="group rounded-2xl border border-white/5 bg-zinc-950/80 p-5 backdrop-blur-md transition-colors hover:border-[#50C878]/20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs font-mono text-[#50C878]">{service.icon ?? "Box"}</span>
                    <h3 className="text-sm font-semibold text-zinc-200">{service.title}</h3>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">{truncate(service.description, 100)}</p>
                </div>
                <div className="ml-4 flex gap-1">
                  <button onClick={() => { setEditService(service); setShowModal(true); }} className="rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-zinc-200 transition-colors">
                    <Pencil className="size-3.5" />
                  </button>
                  <button onClick={() => handleDelete(service)} disabled={deletingId === service.id} className="rounded-lg p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-50">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ServiceModal service={editService} onClose={() => { setShowModal(false); setEditService(undefined); }} />
      )}
    </>
  );
}
