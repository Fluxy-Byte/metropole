import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { HouseCard } from "@/modules/houses/components/house-card";
import { HousesFilters } from "@/modules/houses/components/houses-filters";
import { HousesToolbar } from "@/modules/houses/components/houses-toolbar";
import { HousesPagination } from "@/modules/houses/components/houses-pagination";
import { houseService } from "@/modules/houses/services/house.service";
import { categoryService } from "@/modules/houses/services/category.service";
import { houseFilterSchema } from "@/modules/houses/validators/house.validators";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { SearchX } from "lucide-react";

export const metadata: Metadata = {
  title: "Imóveis à venda e para alugar",
  description: "Explore casas, apartamentos e imóveis comerciais em Uberlândia - MG.",
};

export default async function HousesPage({ searchParams }: PageProps<"/houses">) {
  const rawParams = await searchParams;
  const flatParams = Object.fromEntries(
    Object.entries(rawParams).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  ) as Record<string, string | undefined>;

  const filters = houseFilterSchema.parse(flatParams);

  const [result, categories] = await Promise.all([
    houseService.listPublic(filters),
    categoryService.list(),
  ]);

  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-primary">Imóveis</h1>
        <p className="mt-1 text-muted-foreground">
          Encontre o imóvel ideal entre nossas opções em Uberlândia e região.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className="hidden lg:block">
          <HousesFilters categories={categories} />
        </div>

        <div className="flex flex-col gap-6">
          <HousesToolbar total={result.total} categories={categories} />

          {result.items.length === 0 ? (
            <Empty>
              <EmptyMedia variant="icon">
                <SearchX />
              </EmptyMedia>
              <EmptyTitle>Nenhum imóvel encontrado</EmptyTitle>
              <EmptyDescription>
                Tente ajustar os filtros de busca para encontrar mais opções.
              </EmptyDescription>
            </Empty>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {result.items.map((house) => (
                <HouseCard key={house.id} house={house} />
              ))}
            </div>
          )}

          <HousesPagination page={result.page} totalPages={result.totalPages} searchParams={flatParams} />
        </div>
      </div>
    </Container>
  );
}
