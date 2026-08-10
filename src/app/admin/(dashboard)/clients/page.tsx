import type { Metadata } from "next";
import { clientService } from "@/modules/clients/services/client.service";
import { clientFilterSchema } from "@/modules/clients/validators/client.validators";
import { ClientsTable } from "@/modules/clients/components/clients-table";
import { ClientsKanban } from "@/modules/clients/components/clients-kanban";
import { TableSearch } from "@/components/shared/table-search";
import { DataPagination } from "@/components/shared/data-pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = { title: "Clientes" };

export default async function AdminClientsPage({ searchParams }: PageProps<"/admin/clients">) {
  const rawParams = await searchParams;
  const flatParams = Object.fromEntries(
    Object.entries(rawParams).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  ) as Record<string, string | undefined>;

  const filters = clientFilterSchema.parse(flatParams);
  const [result, kanbanClients] = await Promise.all([clientService.list(filters), clientService.listForKanban()]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Clientes</h1>
        <p className="text-sm text-muted-foreground">{result.total} clientes cadastrados</p>
      </div>

      <Tabs defaultValue="kanban">
        <TabsList>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="lista">Lista</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="flex flex-col gap-4">
          <ClientsKanban clients={kanbanClients} />
        </TabsContent>

        <TabsContent value="lista" className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
            <TableSearch placeholder="Buscar por nome, telefone ou e-mail..." />
          </div>

          <ClientsTable clients={result.items} />

          <DataPagination
            basePath="/admin/clients"
            page={result.page}
            totalPages={result.totalPages}
            searchParams={flatParams}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
