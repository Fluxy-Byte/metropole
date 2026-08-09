import type { Category, House, HouseDocument, HouseImage } from "@/generated/prisma/client";
import type { HouseDetailDto, HouseListItemDto, HouseMapItemDto } from "@/modules/houses/types";

type HouseForList = House & { category: Category; images: HouseImage[] };
type HouseForDetail = HouseForList & { documents?: HouseDocument[] };

function toNumber(value: unknown): number {
  if (value === null || value === undefined) return 0;
  return typeof value === "object" && value !== null && "toNumber" in value
    ? (value as { toNumber: () => number }).toNumber()
    : Number(value);
}

export function toHouseListItemDto(house: HouseForList): HouseListItemDto {
  const cover = house.images.find((img) => img.isCover) ?? house.images[0];
  return {
    id: house.id,
    title: house.title,
    slug: house.slug,
    price: toNumber(house.price),
    listingType: house.listingType,
    status: house.status,
    neighborhood: house.neighborhood,
    city: house.city,
    builtArea: toNumber(house.builtArea),
    totalArea: toNumber(house.totalArea),
    bedrooms: house.bedrooms,
    bathrooms: house.bathrooms,
    garageSpaces: house.garageSpaces,
    hasPool: house.hasPool,
    coverImageUrl: cover?.url ?? null,
    category: { id: house.category.id, name: house.category.name, slug: house.category.slug },
    createdAt: house.createdAt.toISOString(),
  };
}

export function toHouseMapItemDto(house: HouseForList): HouseMapItemDto {
  const cover = house.images.find((img) => img.isCover) ?? house.images[0];
  return {
    id: house.id,
    title: house.title,
    slug: house.slug,
    price: toNumber(house.price),
    listingType: house.listingType,
    neighborhood: house.neighborhood,
    city: house.city,
    bedrooms: house.bedrooms,
    bathrooms: house.bathrooms,
    latitude: toNumber(house.latitude),
    longitude: toNumber(house.longitude),
    coverImageUrl: cover?.url ?? null,
  };
}

export function toHouseDetailDto(house: HouseForDetail): HouseDetailDto {
  return {
    ...toHouseListItemDto(house),
    description: house.description,
    address: house.address,
    state: house.state,
    zipCode: house.zipCode,
    latitude: house.latitude ? toNumber(house.latitude) : null,
    longitude: house.longitude ? toNumber(house.longitude) : null,
    hasBarbecue: house.hasBarbecue,
    condoFee: house.condoFee ? toNumber(house.condoFee) : null,
    iptu: house.iptu ? toNumber(house.iptu) : null,
    videoUrl: house.videoUrl,
    tags: house.tags,
    images: house.images
      .sort((a, b) => a.order - b.order)
      .map((img) => ({ id: img.id, url: img.url, isCover: img.isCover, order: img.order })),
    documents: (house.documents ?? []).map((doc) => ({
      id: doc.id,
      url: doc.url,
      originalName: doc.originalName,
    })),
    viewsCount: house.viewsCount,
  };
}
