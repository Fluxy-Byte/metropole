import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { HouseCard } from "@/modules/houses/components/house-card";
import type { HouseListItemDto } from "@/modules/houses/types";

export function LatestHousesSection({ houses }: { houses: HouseListItemDto[] }) {
  if (houses.length === 0) return null;

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold tracking-wide text-accent uppercase">
              Novidades
            </p>
            <h2 className="mt-1 font-heading text-3xl font-bold text-primary">
              Últimos imóveis adicionados
            </h2>
          </div>
          <Button variant="outline" nativeButton={false} render={<Link href="/houses" />}>
            Ver todos os imóveis
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {houses.map((house) => (
            <HouseCard key={house.id} house={house} />
          ))}
        </div>
      </Container>
    </section>
  );
}
