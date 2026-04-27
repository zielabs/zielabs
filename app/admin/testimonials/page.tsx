// app/admin/testimonials/page.tsx

import { redirect } from "next/navigation";
import { isAuthenticated } from "@/app/lib/auth";
import { getTestimonials } from "@/app/actions/testimonial.actions";
import TestimonialsClient from "./TestimonialsClient";

export default async function AdminTestimonialsPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const { data: testimonials = [] } = await getTestimonials();

  const mapped = testimonials.map((t) => ({
    id: t.id,
    name: t.name,
    role: t.role,
    company: t.company,
    content: t.content,
    avatarUrl: t.avatarUrl ?? null,
    rating: t.rating,
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Testimonials</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Kelola ulasan dan testimoni klien Zielabs.
        </p>
      </div>
      <TestimonialsClient testimonials={mapped} />
    </div>
  );
}
