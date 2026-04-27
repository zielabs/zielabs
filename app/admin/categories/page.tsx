import { redirect } from "next/navigation";
import { isAuthenticated } from "@/app/lib/auth";
import { getCategories } from "@/app/actions/category.actions";
import CategoriesClient from "./CategoriesClient";
import type { CategoryDisplay } from "@/app/lib/types";

export default async function AdminCategoriesPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const result = await getCategories();
  
  // Transform data untuk UI
  const categories: CategoryDisplay[] = (result.data ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Kategori</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Kelola kategori produk untuk portofolio Anda.
        </p>
      </div>
      <CategoriesClient categories={categories} />
    </div>
  );
}
