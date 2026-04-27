// app/lib/validations/product.schema.ts

import { z } from "zod";

export const createProductSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Judul minimal 3 karakter." })
    .max(150, { message: "Judul maksimal 150 karakter." }),

  slug: z
    .string()
    .min(3, { message: "Slug minimal 3 karakter." })
    .max(150, { message: "Slug maksimal 150 karakter." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug hanya boleh huruf kecil, angka, dan tanda hubung (contoh: 'my-product').",
    }),

  description: z
    .string()
    .min(10, { message: "Deskripsi minimal 10 karakter." })
    .max(5000, { message: "Deskripsi maksimal 5000 karakter." }),

  techStack: z
    .string()
    .min(2, { message: "Tech stack minimal 2 karakter." })
    .max(255, { message: "Tech stack maksimal 255 karakter." }),

  imageUrl: z
    .string()
    .url({ message: "Image URL harus berformat URL yang valid." })
    .max(500, { message: "Image URL maksimal 500 karakter." })
    .optional()
    .or(z.literal("")),

  liveUrl: z
    .string()
    .url({ message: "Live URL harus berformat URL yang valid." })
    .max(500, { message: "Live URL maksimal 500 karakter." })
    .optional()
    .or(z.literal("")),

  categoryId: z
    .number({ error: "Category ID harus berupa angka." })
    .int({ error: "Category ID harus bilangan bulat." })
    .positive({ error: "Category ID harus lebih dari 0." }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
