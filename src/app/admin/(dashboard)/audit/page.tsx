import type { Metadata } from "next";
import { auditService } from "@/modules/audit/services/audit.service";
import { AuditTable } from "@/modules/audit/components/audit-table";
import { TableSearch } from "@/components/shared/table-search";
import { DataPagination } from "@/components/shared/data-pagination";

export const metadata: Metadata = { title: "Auditoria" };

export default async function AdminAuditPage({ searchParams }: PageProps<"/admin/audit">) {
  const rawParams = await searchParams;
  const flatParams = Object.fromEntries(
    Object.entries(rawParams).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  ) as Record<string, string | undefined>;

  const page = Number(flatParams.page ?? 1);
  const result = await auditService.list({
    page,
    pageSize: 20,
    search: flatParams.search,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Auditoria</h1>
          <p className="text-sm text-muted-foreground">
            Registro completo de ações realizadas no painel administrativo
          </p>
        </div>
        <TableSearch placeholder="Buscar por usuário ou entidade..." />
      </div>

      <AuditTable entries={result.items} />

      <DataPagination
        basePath="/admin/audit"
        page={result.page}
        totalPages={result.totalPages}
        searchParams={flatParams}
      />
    </div>
  );
}
