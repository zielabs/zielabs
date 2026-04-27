// app/lib/validations/testimonial.schema.ts

import { z } from "zod";

export const createTestimonialSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Nama minimal 2 karakter." })
    .max(100, { message: "Nama maksimal 100 karakter." }),

  role: z
    .string()
    .min(2, { message: "Jabatan minimal 2 karakter." })
    .max(100, { message: "Jabatan maksimal 100 karakter." }),

  company: z
    .string()
    .min(2, { message: "Perusahaan minimal 2 karakter." })
    .max(150, { message: "Perusahaan maksimal 150 karakter." }),

  content: z
    .string()
    .min(20, { message: "Konten testimonial minimal 20 karakter." })
    .max(2000, { message: "Konten testimonial maksimal 2000 karakter." }),

  avatarUrl: z
    .string()
    .url({ message: "Avatar URL harus berformat URL yang valid." })
    .max(500, { message: "Avatar URL maksimal 500 karakter." })
    .optional()
    .or(z.literal("")),

  rating: z
    .number({ error: "Rating harus berupa angka." })
    .int({ error: "Rating harus bilangan bulat." })
    .min(1, { message: "Rating minimal 1." })
    .max(5, { message: "Rating maksimal 5." }),
});

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
