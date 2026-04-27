// app/lib/validations/service.schema.ts

import { z } from "zod";

export const createServiceSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Judul minimal 3 karakter." })
    .max(150, { message: "Judul maksimal 150 karakter." }),

  slug: z
    .string()
    .min(3, { message: "Slug minimal 3 karakter." })
    .max(150, { message: "Slug maksimal 150 karakter." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug hanya boleh huruf kecil, angka, dan tanda hubung.",
    }),

  description: z
    .string()
    .min(10, { message: "Deskripsi minimal 10 karakter." })
    .max(5000, { message: "Deskripsi maksimal 5000 karakter." }),

  icon: z
    .string()
    .max(50, { message: "Nama icon maksimal 50 karakter." })
    .optional()
    .or(z.literal("")),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
