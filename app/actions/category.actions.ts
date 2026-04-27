"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { isAuthenticated } from "@/app/lib/auth";
import type { ActionResponse } from "@/app/lib/types";
import type { Category } from "@/app/generated/prisma/client";

async function requireAuth(): Promise<void> {
  const authed = await isAuthenticated();
  if (!authed) throw new Error("Unauthorized.");
}

export async function getCategories(): Promise<ActionResponse<Category[]>> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, message: "OK", data: categories };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal memuat kategori.";
    return { success: false, message: msg };
  }
}

export async function createCategory(
  name: string,
  slug: string
): Promise<ActionResponse<Category>> {
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

    const category = await prisma.category.create({ data: { name, slug } });
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");

    return { success: true, message: "Kategori dibuat.", data: category };
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
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    return { success: true, message: "Kategori dihapus." };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal menghapus kategori.";
    return { success: false, message: msg };
  }
}

export async function updateCategory(
  id: number,
  name: string,
  slug: string
): Promise<ActionResponse<Category>> {
  try {
    await requireAuth();

    if (!name || name.length < 2) return { success: false, message: "Nama minimal 2 karakter." };
    if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return { success: false, message: "Slug tidak valid." };
    }

    const duplicate = await prisma.category.findFirst({
      where: {
        OR: [{ name }, { slug }],
        NOT: { id },
      },
    });

    if (duplicate) return { success: false, message: "Nama atau slug sudah dipakai." };

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");

    return { success: true, message: "Kategori diperbarui.", data: category };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal memperbarui kategori.";
    return { success: false, message: msg };
  }
}
