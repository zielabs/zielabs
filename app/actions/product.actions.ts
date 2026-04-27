// app/actions/product.actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { z } from "zod";
import { processImageFromFormData } from "@/app/lib/upload";
import { isAuthenticated } from "@/app/lib/auth";
import type { ActionResponse, ProductWithCategory } from "@/app/lib/types";
import type { Product } from "@/app/generated/prisma/client";

// ─── Zod Schema untuk FormData fields ─────────────────────────────

const productSchema = z.object({
  title: z.string().min(3).max(150),
  slug: z
    .string()
    .min(3)
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug tidak valid." }),
  description: z.string().min(10).max(5000),
  techStack: z.string().min(2).max(255),
  liveUrl: z.string().url({ message: "Live URL tidak valid." }).max(500).optional().or(z.literal("")),
  categoryId: z.coerce.number().int().positive(),
});

// ─── Helper: Auth guard untuk mutations ───────────────────────────

async function requireAuth(): Promise<void> {
  const authed = await isAuthenticated();
  if (!authed) throw new Error("Unauthorized: Anda harus login.");
}

// ─── GET: Semua Product ────────────────────────────────────────────

export async function getProducts(): Promise<ActionResponse<ProductWithCategory[]>> {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, message: "OK", data: products };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal memuat produk.";
    console.error("[getProducts]", msg);
    return { success: false, message: msg };
  }
}

// ─── GET: Product by Slug ──────────────────────────────────────────

export async function getProductBySlug(
  slug: string
): Promise<ActionResponse<ProductWithCategory>> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!product) return { success: false, message: `Produk "${slug}" tidak ditemukan.` };
    return { success: true, message: "OK", data: product };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal mencari produk.";
    return { success: false, message: msg };
  }
}

// ─── POST: Create Product ──────────────────────────────────────────

export async function createProduct(
  formData: FormData
): Promise<ActionResponse<Product>> {
  try {
    await requireAuth();

    const parsed = productSchema.safeParse({
      title: formData.get("title"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      techStack: formData.get("techStack"),
      liveUrl: formData.get("liveUrl"),
      categoryId: formData.get("categoryId"),
    });

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Validasi gagal.";
      return { success: false, message: firstError };
    }

    const { title, slug, description, techStack, liveUrl, categoryId } = parsed.data;

    // Cek slug unik
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) return { success: false, message: `Slug "${slug}" sudah dipakai.` };

    // Cek kategori ada
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) return { success: false, message: `Kategori tidak ditemukan.` };

    // Proses gambar
    const imageUrl = await processImageFromFormData(formData, "imageFile");

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        techStack,
        imageUrl,
        liveUrl: liveUrl || null,
        categoryId,
      },
    });

    revalidatePath("/products");
    revalidatePath("/admin/products");
    revalidatePath("/");

    return { success: true, message: "Produk berhasil dibuat.", data: product };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal membuat produk.";
    console.error("[createProduct]", msg);
    return { success: false, message: msg };
  }
}

// ─── PUT: Update Product ───────────────────────────────────────────

export async function updateProduct(
  id: number,
  formData: FormData
): Promise<ActionResponse<Product>> {
  try {
    await requireAuth();

    const parsed = productSchema.safeParse({
      title: formData.get("title"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      techStack: formData.get("techStack"),
      liveUrl: formData.get("liveUrl"),
      categoryId: formData.get("categoryId"),
    });

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Validasi gagal.";
      return { success: false, message: firstError };
    }

    const { title, slug, description, techStack, liveUrl, categoryId } = parsed.data;

    // Cek slug unik (kecuali diri sendiri)
    const duplicate = await prisma.product.findFirst({
      where: { slug, NOT: { id } },
    });
    if (duplicate) return { success: false, message: `Slug "${slug}" sudah dipakai.` };

    // Proses gambar baru jika ada, kalau tidak pakai yang lama
    const newImage = await processImageFromFormData(formData, "imageFile");
    const updateData: {
      title: string;
      slug: string;
      description: string;
      techStack: string;
      liveUrl: string | null;
      categoryId: number;
      imageUrl?: string | null;
    } = {
      title,
      slug,
      description,
      techStack,
      liveUrl: liveUrl || null,
      categoryId,
    };

    if (newImage !== null) {
      updateData.imageUrl = newImage;
    }

    const product = await prisma.product.update({ where: { id }, data: updateData });

    revalidatePath("/products");
    revalidatePath("/admin/products");
    revalidatePath("/");

    return { success: true, message: "Produk berhasil diperbarui.", data: product };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal memperbarui produk.";
    console.error("[updateProduct]", msg);
    return { success: false, message: msg };
  }
}

// ─── DELETE: Product ───────────────────────────────────────────────

export async function deleteProduct(id: number): Promise<ActionResponse> {
  try {
    await requireAuth();
    await prisma.product.delete({ where: { id } });

    revalidatePath("/products");
    revalidatePath("/admin/products");
    revalidatePath("/");

    return { success: true, message: "Produk berhasil dihapus." };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal menghapus produk.";
    console.error("[deleteProduct]", msg);
    return { success: false, message: msg };
  }
}

// ─── GET: Categories (untuk dropdown) ─────────────────────────────

export async function getCategories(): Promise<ActionResponse<{ id: number; name: string; slug: string }[]>> {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    return { success: true, message: "OK", data: categories };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal memuat kategori.";
    return { success: false, message: msg };
  }
}
