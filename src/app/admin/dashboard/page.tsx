import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminBookingsTable } from "@/components/admin/AdminBookingsTable";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/admin");

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">Admin</h1>
          <p className="mt-2 text-muted">Welcome back, {session.name}</p>
        </div>
        <Link href="/admin/services">
          <span className="gradient-gold inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-background">
            Services & Pricing
          </span>
        </Link>
      </div>

      <div className="mt-12">
        <AdminBookingsTable compact showServicesLink={false} />
      </div>
    </div>
  );
}
