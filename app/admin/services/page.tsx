// app/admin/services/page.tsx

import { redirect } from "next/navigation";
import { isAuthenticated } from "@/app/lib/auth";
import { getServices } from "@/app/actions/service.actions";
import ServicesClient from "./ServicesClient";

export default async function AdminServicesPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const { data: services = [] } = await getServices();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Services</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Kelola daftar layanan yang ditawarkan Zielabs.
        </p>
      </div>
      <ServicesClient services={services} />
    </div>
  );
}
