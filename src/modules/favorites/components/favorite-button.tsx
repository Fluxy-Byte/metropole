"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/modules/favorites/hooks/use-favorites";

export function FavoriteButton({
  houseId,
  className,
  variant = "icon",
}: {
  houseId: string;
  className?: string;
  variant?: "icon" | "full";
}) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(houseId);

  if (variant === "full") {
    return (
      <Button
        variant={active ? "default" : "outline"}
        onClick={() => toggle(houseId)}
        className={className}
      >
        <Heart data-icon="inline-start" className={cn(active && "fill-current")} />
        {active ? "Favoritado" : "Favoritar"}
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(houseId);
      }}
      aria-pressed={active}
      aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className={cn(
        "flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-primary shadow-sm backdrop-blur transition-transform hover:scale-105",
        className,
      )}
    >
      <Heart className={cn("size-4", active && "fill-accent text-accent")} />
    </button>
  );
}
