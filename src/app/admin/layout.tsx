import { getSession } from "@/lib/auth";
import { AdminThemeLock } from "@/components/admin/AdminThemeLock";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <>
      <AdminThemeLock />
      <div className="sunshine-site admin-site">
        {session && <AdminHeader session={session} />}
        <div className={session ? "ss-container ss-page-dark admin-main" : "admin-login-wrap"}>
          {children}
        </div>
      </div>
    </>
  );
}
