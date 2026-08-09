"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import type { HouseMapItemDto } from "@/modules/houses/types";

const HousesMap = dynamic(
  () => import("@/modules/houses/components/houses-map").then((mod) => mod.HousesMap),
  { ssr: false, loading: () => <Skeleton className="h-full w-full" /> },
);

export function HousesMapSection({ houses }: { houses: HouseMapItemDto[] }) {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="mb-10">
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">
            Onde estamos
          </p>
          <h2 className="mt-1 font-heading text-3xl font-bold text-primary">
            Encontre imóveis pelo mapa
          </h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Explore a localização de todos os nossos imóveis disponíveis em Uberlândia e clique em
            um marcador para ver os detalhes.
          </p>
        </div>

        {houses.length === 0 ? (
          <Empty className="h-96 rounded-2xl border border-border">
            <EmptyMedia variant="icon">
              <MapPin />
            </EmptyMedia>
            <EmptyTitle>Nenhum imóvel com localização cadastrada</EmptyTitle>
            <EmptyDescription>
              Assim que imóveis com coordenadas forem publicados, eles aparecerão aqui.
            </EmptyDescription>
          </Empty>
        ) : (
          <div className="relative isolate h-[600px] w-full overflow-hidden rounded-2xl border border-border sm:h-[720px]">
            <HousesMap houses={houses} />
          </div>
        )}
      </Container>
    </section>
  );
}
