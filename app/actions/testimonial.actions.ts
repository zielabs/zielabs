// app/actions/testimonial.actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { z } from "zod";
import { processImageFromFormData } from "@/app/lib/upload";
import { isAuthenticated } from "@/app/lib/auth";
import type { ActionResponse } from "@/app/lib/types";
import type { Testimonial } from "@/app/generated/prisma/client";

// ─── Schema ────────────────────────────────────────────────────────

const testimonialSchema = z.object({
  name: z.string().min(2).max(100),
  role: z.string().min(2).max(100),
  company: z.string().min(2).max(150),
  content: z.string().min(20).max(2000),
  rating: z.coerce.number().int().min(1).max(5),
});

async function requireAuth(): Promise<void> {
  const authed = await isAuthenticated();
  if (!authed) throw new Error("Unauthorized.");
}

// ─── GET: All Testimonials ─────────────────────────────────────────

export async function getTestimonials(): Promise<ActionResponse<Testimonial[]>> {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, message: "OK", data: testimonials };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal memuat testimonial.";
    console.error("[getTestimonials]", msg);
    return { success: false, message: msg };
  }
}

// ─── POST: Create ──────────────────────────────────────────────────

export async function createTestimonial(
  formData: FormData
): Promise<ActionResponse<Testimonial>> {
  try {
    await requireAuth();

    const parsed = testimonialSchema.safeParse({
      name: formData.get("name"),
      role: formData.get("role"),
      company: formData.get("company"),
      content: formData.get("content"),
      rating: formData.get("rating"),
    });

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Validasi gagal.";
      return { success: false, message: firstError };
    }

    const avatarUrl = await processImageFromFormData(formData, "avatarFile");

    const testimonial = await prisma.testimonial.create({
      data: { ...parsed.data, avatarUrl },
    });

    revalidatePath("/testimonials");
    revalidatePath("/admin/testimonials");
    revalidatePath("/");

    return { success: true, message: "Testimonial berhasil dibuat.", data: testimonial };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal membuat testimonial.";
    console.error("[createTestimonial]", msg);
    return { success: false, message: msg };
  }
}

// ─── PUT: Update ───────────────────────────────────────────────────

export async function updateTestimonial(
  id: number,
  formData: FormData
): Promise<ActionResponse<Testimonial>> {
  try {
    await requireAuth();

    const parsed = testimonialSchema.safeParse({
      name: formData.get("name"),
      role: formData.get("role"),
      company: formData.get("company"),
      content: formData.get("content"),
      rating: formData.get("rating"),
    });

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Validasi gagal.";
      return { success: false, message: firstError };
    }

    const newAvatar = await processImageFromFormData(formData, "avatarFile");

    const updateData: {
      name: string;
      role: string;
      company: string;
      content: string;
      rating: number;
      avatarUrl?: string | null;
    } = { ...parsed.data };

    if (newAvatar !== null) {
      updateData.avatarUrl = newAvatar;
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/testimonials");
    revalidatePath("/admin/testimonials");

    return { success: true, message: "Testimonial diperbarui.", data: testimonial };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal memperbarui testimonial.";
    console.error("[updateTestimonial]", msg);
    return { success: false, message: msg };
  }
}

// ─── DELETE ────────────────────────────────────────────────────────

export async function deleteTestimonial(id: number): Promise<ActionResponse> {
  try {
    await requireAuth();
    await prisma.testimonial.delete({ where: { id } });

    revalidatePath("/testimonials");
    revalidatePath("/admin/testimonials");

    return { success: true, message: "Testimonial dihapus." };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal menghapus testimonial.";
    console.error("[deleteTestimonial]", msg);
    return { success: false, message: msg };
  }
}
