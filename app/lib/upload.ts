// app/lib/upload.ts

const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Validasi file gambar: MIME type dan ukuran.
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.",
    };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return {
      valid: false,
      error: `Ukuran file terlalu besar. Maksimal ${MAX_SIZE_BYTES / 1024 / 1024}MB.`,
    };
  }

  return { valid: true };
}

/**
 * Konversi File menjadi Base64 Data URI string.
 * Hasilnya bisa langsung dipakai sebagai `src` pada tag <img>.
 */
export async function fileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString("base64");
  return `data:${file.type};base64,${base64}`;
}

/**
 * Proses file gambar dari FormData: validasi lalu konversi ke Base64.
 * Mengembalikan null jika tidak ada file atau file kosong.
 * Melempar Error jika validasi gagal.
 */
export async function processImageFromFormData(
  formData: FormData,
  fieldName: string
): Promise<string | null> {
  const file = formData.get(fieldName);

  // Tidak ada file yang di-upload (opsional)
  if (!file || !(file instanceof File) || file.size === 0) {
    return null;
  }

  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return fileToBase64(file);
}
