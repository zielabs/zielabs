// app/admin/products/page.tsx

import { redirect } from "next/navigation";
import { isAuthenticated } from "@/app/lib/auth";
import { getProducts, getCategories } from "@/app/actions/product.actions";
import AdminProductsClient from "./AdminProductsClient";
import type { ProductDisplay, CategoryDisplay } from "@/app/lib/types";

export default async function AdminProductsPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const [productsResult, categoriesResult] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  // Map to display types (strip timestamps, handle base64 imageUrl)
  const products: ProductDisplay[] = (productsResult.data ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    techStack: p.techStack,
    imageUrl: p.imageUrl ?? null,
    liveUrl: p.liveUrl ?? null,
    category: {
      id: p.category.id,
      name: p.category.name,
      slug: p.category.slug,
    },
  }));

  const categories: CategoryDisplay[] = (categoriesResult.data ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Products</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Kelola portofolio produk digital Zielabs.
        </p>
      </div>
      <AdminProductsClient products={products} categories={categories} />
    </div>
  );
}
