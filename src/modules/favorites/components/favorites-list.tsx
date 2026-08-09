"use client";

import Link from "next/link";
import useSWR from "swr";
import { Heart, SearchX } from "lucide-react";
import { http } from "@/lib/http";
import { useFavorites } from "@/modules/favorites/hooks/use-favorites";
import { HouseCard, HouseCardSkeleton } from "@/modules/houses/components/house-card";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import type { HouseListItemDto } from "@/modules/houses/types";

export function FavoritesList() {
  const { houseIds } = useFavorites();

  const { data, isLoading } = useSWR(
    houseIds.length > 0 ? ["/favorites/resolve", houseIds] : null,
    async ([, ids]: [string, string[]]) => {
      const res = await http.post<{ items: HouseListItemDto[] }>("/favorites/resolve", { ids });
      return res.data.items;
    },
  );

  if (houseIds.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <Heart />
        </EmptyMedia>
        <EmptyTitle>Você ainda não tem favoritos</EmptyTitle>
        <EmptyDescription>
          Explore nossos imóveis e clique no coração para salvar os que você mais gostar.
        </EmptyDescription>
        <Button className="mt-2" nativeButton={false} render={<Link href="/houses" />}>
          Ver imóveis
        </Button>
      </Empty>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {houseIds.map((id) => (
          <HouseCardSkeleton key={id} />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <SearchX />
        </EmptyMedia>
        <EmptyTitle>Nenhum imóvel encontrado</EmptyTitle>
        <EmptyDescription>
          Os imóveis favoritados podem ter sido removidos ou não estão mais disponíveis.
        </EmptyDescription>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((house) => (
        <HouseCard key={house.id} house={house} />
      ))}
    </div>
  );
}
