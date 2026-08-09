import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { houseService } from "@/modules/houses/services/house.service";
import { categoryService } from "@/modules/houses/services/category.service";
import { HouseForm } from "@/modules/houses/components/house-form";
import { HouseImageUploader } from "@/modules/houses/components/house-image-uploader";
import { HouseDocumentUploader } from "@/modules/houses/components/house-document-uploader";

export const metadata: Metadata = { title: "Imóvel" };

export default async function AdminHouseFormPage({ params }: PageProps<"/admin/houses/[id]">) {
  const { id } = await params;
  const isCreate = id === "novo";

  const [house, categories] = await Promise.all([
    isCreate ? Promise.resolve(null) : houseService.getById(id),
    categoryService.list(),
  ]);

  if (!isCreate && !house) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          {isCreate ? "Novo imóvel" : "Editar imóvel"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isCreate
            ? "Preencha os dados abaixo para cadastrar um novo imóvel."
            : "Atualize as informações e a mídia deste imóvel."}
        </p>
      </div>

      <HouseForm mode={isCreate ? "create" : "edit"} house={house ?? undefined} categories={categories} />

      {house && (
        <>
          <HouseImageUploader houseId={house.id} images={house.images} />
          <HouseDocumentUploader houseId={house.id} documents={house.documents} />
        </>
      )}
    </div>
  );
}
