import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, destroySession } from "@/lib/auth";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/stylists", label: "Stylists" },
  { href: "/admin/services", label: "Services & Pricing" },
];

async function logoutAction() {
  "use server";
  await destroySession();
  redirect("/admin");
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-background">
      {session && (
        <header className="border-b border-border bg-surface">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            <div className="flex items-center gap-8">
              <Link href="/admin/dashboard" className="font-serif tracking-widest">
                LUMIÈRE Admin
              </Link>
              <nav className="hidden gap-6 md:flex">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-xs uppercase tracking-widest text-muted hover:text-gold"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-muted">{session.name}</span>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-xs uppercase tracking-widest text-muted hover:text-gold"
                >
                  Logout
                </button>
              </form>
              <Link href="/" className="text-xs uppercase tracking-widest text-muted hover:text-gold">
                View Site
              </Link>
            </div>
          </div>
        </header>
      )}
      <div className={session ? "mx-auto max-w-7xl px-6 py-10" : ""}>{children}</div>
    </div>
  );
}
