// app/actions/service.actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { z } from "zod";
import { isAuthenticated } from "@/app/lib/auth";
import type { ActionResponse } from "@/app/lib/types";
import type { Service } from "@/app/generated/prisma/client";

const serviceSchema = z.object({
  title: z.string().min(3).max(150),
  slug: z
    .string()
    .min(3)
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug tidak valid." }),
  description: z.string().min(10).max(5000),
  icon: z.string().max(50).optional().or(z.literal("")),
});

async function requireAuth(): Promise<void> {
  const authed = await isAuthenticated();
  if (!authed) throw new Error("Unauthorized.");
}

// ─── GET ───────────────────────────────────────────────────────────

export async function getServices(): Promise<ActionResponse<Service[]>> {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, message: "OK", data: services };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal memuat layanan.";
    console.error("[getServices]", msg);
    return { success: false, message: msg };
  }
}

// ─── CREATE ────────────────────────────────────────────────────────

export async function createService(
  formData: FormData
): Promise<ActionResponse<Service>> {
  try {
    await requireAuth();

    const parsed = serviceSchema.safeParse({
      title: formData.get("title"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      icon: formData.get("icon"),
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message ?? "Validasi gagal." };
    }

    const { title, slug, description, icon } = parsed.data;

    const existing = await prisma.service.findUnique({ where: { slug } });
    if (existing) return { success: false, message: `Slug "${slug}" sudah dipakai.` };

    const service = await prisma.service.create({
      data: { title, slug, description, icon: icon || null },
    });

    revalidatePath("/services");
    revalidatePath("/admin/services");
    revalidatePath("/");

    return { success: true, message: "Layanan berhasil dibuat.", data: service };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal membuat layanan.";
    console.error("[createService]", msg);
    return { success: false, message: msg };
  }
}

// ─── UPDATE ────────────────────────────────────────────────────────

export async function updateService(
  id: number,
  formData: FormData
): Promise<ActionResponse<Service>> {
  try {
    await requireAuth();

    const parsed = serviceSchema.safeParse({
      title: formData.get("title"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      icon: formData.get("icon"),
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message ?? "Validasi gagal." };
    }

    const { title, slug, description, icon } = parsed.data;

    const duplicate = await prisma.service.findFirst({ where: { slug, NOT: { id } } });
    if (duplicate) return { success: false, message: `Slug "${slug}" sudah dipakai.` };

    const service = await prisma.service.update({
      where: { id },
      data: { title, slug, description, icon: icon || null },
    });

    revalidatePath("/services");
    revalidatePath("/admin/services");
    revalidatePath("/");

    return { success: true, message: "Layanan diperbarui.", data: service };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal memperbarui layanan.";
    console.error("[updateService]", msg);
    return { success: false, message: msg };
  }
}

// ─── DELETE ────────────────────────────────────────────────────────

export async function deleteService(id: number): Promise<ActionResponse> {
  try {
    await requireAuth();
    await prisma.service.delete({ where: { id } });

    revalidatePath("/services");
    revalidatePath("/admin/services");
    revalidatePath("/");

    return { success: true, message: "Layanan dihapus." };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal menghapus layanan.";
    console.error("[deleteService]", msg);
    return { success: false, message: msg };
  }
}

// ─── Category actions (untuk admin panel) ─────────────────────────

export async function createCategory(name: string, slug: string): Promise<ActionResponse> {
  try {
    await requireAuth();

    if (!name || name.length < 2) return { success: false, message: "Nama minimal 2 karakter." };
    if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return { success: false, message: "Slug tidak valid." };
    }

    const existing = await prisma.category.findFirst({
      where: { OR: [{ name }, { slug }] },
    });
    if (existing) return { success: false, message: "Nama atau slug sudah ada." };

    await prisma.category.create({ data: { name, slug } });
    revalidatePath("/admin/products");

    return { success: true, message: "Kategori dibuat." };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal membuat kategori.";
    return { success: false, message: msg };
  }
}

export async function deleteCategory(id: number): Promise<ActionResponse> {
  try {
    await requireAuth();
    const count = await prisma.product.count({ where: { categoryId: id } });
    if (count > 0) {
      return { success: false, message: `Tidak bisa hapus: ${count} produk masih memakai kategori ini.` };
    }
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/products");
    return { success: true, message: "Kategori dihapus." };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal menghapus kategori.";
    return { success: false, message: msg };
  }
}
