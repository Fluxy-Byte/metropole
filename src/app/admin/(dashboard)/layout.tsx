import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminTopbar } from "@/components/layout/admin-topbar";
import { getCurrentUser } from "@/lib/session";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/signin");

  return (
    <div className="flex min-h-screen bg-secondary">
      <AdminSidebar role={user.role} />
      <div className="flex flex-1 flex-col">
        <AdminTopbar user={user} role={user.role} />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
