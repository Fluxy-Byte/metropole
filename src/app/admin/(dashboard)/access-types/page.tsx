import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { accessTypeService } from "@/modules/access/services/access-type.service";
import { accessTypeFilterSchema } from "@/modules/access/validators/access-type.validators";
import { AccessTypesTable } from "@/modules/access/components/access-types-table";
import { TableSearch } from "@/components/shared/table-search";
import { DataPagination } from "@/components/shared/data-pagination";

export const metadata: Metadata = { title: "Tipos de Acesso" };

export default async function AdminAccessTypesPage({ searchParams }: PageProps<"/admin/access-types">) {
  const rawParams = await searchParams;
  const flatParams = Object.fromEntries(
    Object.entries(rawParams).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  ) as Record<string, string | undefined>;

  const filters = accessTypeFilterSchema.parse(flatParams);
  const result = await accessTypeService.list(filters);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Tipos de Acesso</h1>
          <p className="text-sm text-muted-foreground">{result.total} tipos de acesso cadastrados</p>
        </div>
        <div className="flex gap-3">
          <TableSearch placeholder="Buscar por nome..." />
          <Button nativeButton={false} render={<Link href="/admin/access-types/novo" />}>
            <Plus data-icon="inline-start" /> Novo tipo de acesso
          </Button>
        </div>
      </div>

      <AccessTypesTable accessTypes={result.items} />

      <DataPagination
        basePath="/admin/access-types"
        page={result.page}
        totalPages={result.totalPages}
        searchParams={flatParams}
      />
    </div>
  );
}
