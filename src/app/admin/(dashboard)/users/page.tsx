import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userService } from "@/modules/access/services/user.service";
import { userFilterSchema } from "@/modules/access/validators/user.validators";
import { AdminUsersTable } from "@/modules/access/components/admin-users-table";
import { TableSearch } from "@/components/shared/table-search";
import { DataPagination } from "@/components/shared/data-pagination";

export const metadata: Metadata = { title: "Acessos" };

export default async function AdminUsersPage({ searchParams }: PageProps<"/admin/users">) {
  const rawParams = await searchParams;
  const flatParams = Object.fromEntries(
    Object.entries(rawParams).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  ) as Record<string, string | undefined>;

  const filters = userFilterSchema.parse(flatParams);
  const result = await userService.list(filters);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Acessos</h1>
          <p className="text-sm text-muted-foreground">{result.total} acessos cadastrados</p>
        </div>
        <div className="flex gap-3">
          <TableSearch placeholder="Buscar por nome, e-mail..." />
          <Button nativeButton={false} render={<Link href="/admin/users/novo" />}>
            <Plus data-icon="inline-start" /> Criar acesso
          </Button>
        </div>
      </div>

      <AdminUsersTable users={result.items} />

      <DataPagination
        basePath="/admin/users"
        page={result.page}
        totalPages={result.totalPages}
        searchParams={flatParams}
      />
    </div>
  );
}
