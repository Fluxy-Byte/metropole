import Image from "next/image";
import Link from "next/link";
import { BedDouble, Car, MapPin, ShowerHead, Ruler } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/modules/favorites/components/favorite-button";
import { formatArea, formatCurrency, formatListingType } from "@/lib/format";
import type { HouseListItemDto } from "@/modules/houses/types";

export function HouseCard({ house }: { house: HouseListItemDto }) {
  return (
    <Card className="group overflow-hidden py-0 gap-0">
      <Link href={`/house/${house.slug}`} className="block">
        <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
          {house.coverImageUrl ? (
            <Image
              src={house.coverImageUrl}
              alt={house.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Sem imagem
            </div>
          )}

          <Badge className="absolute top-3 left-3 bg-accent text-white">
            {formatListingType(house.listingType)}
          </Badge>

          <FavoriteButton houseId={house.id} className="absolute top-3 right-3" />
        </div>
      </Link>

      <div className="flex flex-col gap-3 p-4">
        <div>
          <Link href={`/house/${house.slug}`}>
            <h3 className="line-clamp-1 font-heading text-base font-semibold text-foreground hover:text-accent">
              {house.title}
            </h3>
          </Link>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            {house.neighborhood}, {house.city}
          </p>
        </div>

        <p className="font-heading text-xl font-bold text-primary">
          {formatCurrency(house.price)}
          {house.listingType === "RENT" && <span className="text-sm font-normal text-muted-foreground">/mês</span>}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Ruler className="size-4" /> {formatArea(house.builtArea)}
          </span>
          <span className="flex items-center gap-1">
            <BedDouble className="size-4" /> {house.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <ShowerHead className="size-4" /> {house.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Car className="size-4" /> {house.garageSpaces}
          </span>
        </div>

        <Button
          variant="outline"
          className="mt-1 w-full"
          nativeButton={false}
          render={<Link href={`/house/${house.slug}`} />}
        >
          Ver detalhes
        </Button>
      </div>
    </Card>
  );
}

export function HouseCardSkeleton() {
  return (
    <Card className="overflow-hidden py-0 gap-0">
      <div className="aspect-4/3 w-full animate-pulse bg-muted" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-9 w-full animate-pulse rounded bg-muted" />
      </div>
    </Card>
  );
}
