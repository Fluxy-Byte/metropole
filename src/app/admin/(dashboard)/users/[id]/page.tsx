import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { userService } from "@/modules/access/services/user.service";
import { accessTypeService } from "@/modules/access/services/access-type.service";
import { UserForm } from "@/modules/access/components/user-form";

export const metadata: Metadata = { title: "Acesso" };

export default async function AdminUserFormPage({ params }: PageProps<"/admin/users/[id]">) {
  const { id } = await params;
  const isCreate = id === "novo";

  const [user, accessTypes] = await Promise.all([
    isCreate ? Promise.resolve(null) : userService.getById(id),
    accessTypeService.listAll(),
  ]);

  if (!isCreate && !user) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          {isCreate ? "Criar acesso" : "Editar acesso"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isCreate
            ? "Preencha os dados abaixo para criar um novo acesso ao painel."
            : "Atualize os dados e o tipo de acesso desta pessoa."}
        </p>
      </div>

      <UserForm mode={isCreate ? "create" : "edit"} user={user ?? undefined} accessTypes={accessTypes} />
    </div>
  );
}
