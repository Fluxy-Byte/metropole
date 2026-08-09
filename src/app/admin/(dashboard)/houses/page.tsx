import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { houseService } from "@/modules/houses/services/house.service";
import { houseFilterSchema } from "@/modules/houses/validators/house.validators";
import { AdminHousesTable } from "@/modules/houses/components/admin-houses-table";
import { TableSearch } from "@/components/shared/table-search";
import { DataPagination } from "@/components/shared/data-pagination";

export const metadata: Metadata = { title: "Imóveis" };

export default async function AdminHousesPage({ searchParams }: PageProps<"/admin/houses">) {
  const rawParams = await searchParams;
  const flatParams = Object.fromEntries(
    Object.entries(rawParams).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  ) as Record<string, string | undefined>;

  const filters = houseFilterSchema.parse(flatParams);
  const result = await houseService.listAdmin({ ...filters, status: flatParams.status });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Imóveis</h1>
          <p className="text-sm text-muted-foreground">{result.total} imóveis cadastrados</p>
        </div>
        <div className="flex gap-3">
          <TableSearch placeholder="Buscar por título, bairro..." />
          <Button nativeButton={false} render={<Link href="/admin/houses/novo" />}>
            <Plus data-icon="inline-start" /> Novo imóvel
          </Button>
        </div>
      </div>

      <AdminHousesTable houses={result.items} />

      <DataPagination
        basePath="/admin/houses"
        page={result.page}
        totalPages={result.totalPages}
        searchParams={flatParams}
      />
    </div>
  );
}
