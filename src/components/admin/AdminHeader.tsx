import Link from "next/link";
import { redirect } from "next/navigation";
import { destroySession, type AdminSession } from "@/lib/auth";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/stylists", label: "Stylists" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/hours", label: "Hours" },
];

async function logoutAction() {
  "use server";
  await destroySession();
  redirect("/admin");
}

export function AdminHeader({ session }: { session: AdminSession }) {
  return (
    <header className="ss-admin-header">
      <div className="ss-admin-header-inner">
        <div className="ss-header-left">
          <Link href="/admin/dashboard" className="ss-logo">
            <div className="ss-logo-sun">☀</div>
            <div>
              <div className="ss-logo-text">LUMIÈRE</div>
              <div className="ss-logo-sub">Admin Portal</div>
            </div>
          </Link>
          <nav className="ss-admin-nav">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="ss-admin-nav-link">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="ss-admin-header-right">
          <span className="ss-admin-user">{session.name}</span>
          <form action={logoutAction}>
            <button type="submit" className="ss-admin-link-btn">
              Logout
            </button>
          </form>
          <Link href="/" className="ss-admin-link-btn">
            View Site
          </Link>
        </div>
      </div>
    </header>
  );
}
