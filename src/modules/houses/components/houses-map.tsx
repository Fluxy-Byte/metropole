"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { APIProvider, InfoWindow, Map as GoogleMap, Marker } from "@vis.gl/react-google-maps";
import { BedDouble, MapPin, ShowerHead } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { formatCurrency, formatListingType } from "@/lib/format";
import type { HouseMapItemDto } from "@/modules/houses/types";

const UBERLANDIA_CENTER = { lat: -18.9186, lng: -48.2772 };

const PIN_ICON_URL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg width="34" height="42" viewBox="0 0 34 42" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 0C7.6 0 0 7.6 0 17c0 12.7 17 25 17 25s17-12.3 17-25C34 7.6 26.4 0 17 0z" fill="#e07e58" stroke="#ffffff" stroke-width="2"/>
    <circle cx="17" cy="17" r="6" fill="#ffffff"/>
  </svg>
`)}`;

export function HousesMap({ houses }: { houses: HouseMapItemDto[] }) {
  const [selectedHouse, setSelectedHouse] = useState<HouseMapItemDto | null>(null);
  const [hoveredHouse, setHoveredHouse] = useState<HouseMapItemDto | null>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseOver = (house: HouseMapItemDto) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoveredHouse(house);
  };

  const handleMouseOut = () => {
    hoverTimeout.current = setTimeout(() => setHoveredHouse(null), 100);
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <Empty className="h-full">
        <EmptyMedia variant="icon">
          <MapPin />
        </EmptyMedia>
        <EmptyTitle>Mapa não configurado</EmptyTitle>
        <EmptyDescription>
          Defina a variável de ambiente NEXT_PUBLIC_GOOGLE_MAPS_API_KEY com uma chave da Google
          Maps Platform para exibir o mapa.
        </EmptyDescription>
      </Empty>
    );
  }

  const center =
    houses.length === 0
      ? UBERLANDIA_CENTER
      : {
          lat: houses.reduce((sum, h) => sum + h.latitude, 0) / houses.length,
          lng: houses.reduce((sum, h) => sum + h.longitude, 0) / houses.length,
        };

  return (
    <APIProvider apiKey={apiKey}>
      <GoogleMap
        defaultCenter={center}
        defaultZoom={12}
        gestureHandling="cooperative"
        disableDefaultUI={false}
        className="h-full w-full"
        style={{ height: "100%", width: "100%" }}
      >
        {houses.map((house) => (
          <Marker
            key={house.id}
            position={{ lat: house.latitude, lng: house.longitude }}
            title={house.title}
            icon={{ url: PIN_ICON_URL }}
            onClick={() => setSelectedHouse(house)}
            onMouseOver={() => handleMouseOver(house)}
            onMouseOut={handleMouseOut}
          />
        ))}

        {hoveredHouse && (
          <InfoWindow
            position={{ lat: hoveredHouse.latitude, lng: hoveredHouse.longitude }}
            headerDisabled
            shouldFocus={false}
            pixelOffset={[0, -38]}
            onCloseClick={() => setHoveredHouse(null)}
          >
            <div
              className="flex w-56 flex-col gap-2 p-1"
              onMouseEnter={() => handleMouseOver(hoveredHouse)}
              onMouseLeave={handleMouseOut}
            >
              <div className="relative h-28 w-full overflow-hidden rounded-md bg-muted">
                {hoveredHouse.coverImageUrl ? (
                  <Image
                    src={hoveredHouse.coverImageUrl}
                    alt={hoveredHouse.title}
                    fill
                    sizes="220px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    Sem imagem
                  </div>
                )}
                <Badge className="absolute top-2 left-2 bg-accent text-white">
                  {formatListingType(hoveredHouse.listingType)}
                </Badge>
              </div>

              <div>
                <p className="line-clamp-1 text-sm font-semibold text-foreground">
                  {hoveredHouse.title}
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3 shrink-0" />
                  {hoveredHouse.neighborhood}, {hoveredHouse.city}
                </p>
                <p className="mt-1 text-sm font-bold text-primary">
                  {formatCurrency(hoveredHouse.price)}
                  {hoveredHouse.listingType === "RENT" && (
                    <span className="text-xs font-normal text-muted-foreground">/mês</span>
                  )}
                </p>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BedDouble className="size-3.5" /> {hoveredHouse.bedrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <ShowerHead className="size-3.5" /> {hoveredHouse.bathrooms}
                  </span>
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <Dialog
        open={selectedHouse !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedHouse(null);
        }}
      >
        <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
          {selectedHouse && (
            <>
              <div className="relative h-48 w-full bg-muted">
                {selectedHouse.coverImageUrl ? (
                  <Image
                    src={selectedHouse.coverImageUrl}
                    alt={selectedHouse.title}
                    fill
                    sizes="400px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Sem imagem
                  </div>
                )}
                <Badge className="absolute top-3 left-3 bg-accent text-white">
                  {formatListingType(selectedHouse.listingType)}
                </Badge>
              </div>

              <div className="flex flex-col gap-3 p-4">
                <DialogHeader className="gap-1">
                  <DialogTitle className="font-heading text-lg">
                    {selectedHouse.title}
                  </DialogTitle>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0" />
                    {selectedHouse.neighborhood}, {selectedHouse.city}
                  </p>
                </DialogHeader>

                <p className="font-heading text-xl font-bold text-primary">
                  {formatCurrency(selectedHouse.price)}
                  {selectedHouse.listingType === "RENT" && (
                    <span className="text-sm font-normal text-muted-foreground">/mês</span>
                  )}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BedDouble className="size-4" /> {selectedHouse.bedrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <ShowerHead className="size-4" /> {selectedHouse.bathrooms}
                  </span>
                </div>

                <Button
                  className="mt-1 w-full"
                  nativeButton={false}
                  render={<Link href={`/house/${selectedHouse.slug}`} />}
                >
                  Ver detalhes completos
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </APIProvider>
  );
}
