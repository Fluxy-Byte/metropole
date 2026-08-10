import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminTopbar } from "@/components/layout/admin-topbar";
import { getCurrentUser } from "@/lib/session";
import { accessTypeService } from "@/modules/access/services/access-type.service";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/signin");

  const accessType = await accessTypeService.getById(user.accessTypeId);
  const permissions = accessType?.permissions ?? {};

  return (
    <div className="flex min-h-screen bg-secondary">
      <AdminSidebar permissions={permissions} />
      <div className="flex flex-1 flex-col">
        <AdminTopbar user={user} accessTypeName={accessType?.name ?? "—"} permissions={permissions} />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
