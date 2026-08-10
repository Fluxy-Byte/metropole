import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { accessTypeService } from "@/modules/access/services/access-type.service";
import { AccessTypeForm } from "@/modules/access/components/access-type-form";

export const metadata: Metadata = { title: "Tipo de Acesso" };

export default async function AdminAccessTypeFormPage({ params }: PageProps<"/admin/access-types/[id]">) {
  const { id } = await params;
  const isCreate = id === "novo";

  const accessType = isCreate ? null : await accessTypeService.getById(id);
  if (!isCreate && !accessType) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          {isCreate ? "Novo tipo de acesso" : "Editar tipo de acesso"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isCreate
            ? "Defina o nome e as permissões deste tipo de acesso."
            : "Atualize as permissões deste tipo de acesso."}
        </p>
      </div>

      <AccessTypeForm mode={isCreate ? "create" : "edit"} accessType={accessType ?? undefined} />
    </div>
  );
}
