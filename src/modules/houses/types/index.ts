import type { Category, House, HouseDocument, HouseImage } from "@/generated/prisma/client";

export type HouseWithRelations = House & {
  category: Category;
  images: HouseImage[];
  documents?: HouseDocument[];
};

export interface HouseListItemDto {
  id: string;
  title: string;
  slug: string;
  price: number;
  listingType: string;
  status: string;
  neighborhood: string;
  city: string;
  builtArea: number;
  totalArea: number;
  bedrooms: number;
  bathrooms: number;
  garageSpaces: number;
  hasPool: boolean;
  coverImageUrl: string | null;
  category: { id: string; name: string; slug: string };
  createdAt: string;
}

export interface HouseDetailDto extends HouseListItemDto {
  description: string;
  address: string;
  state: string;
  zipCode: string | null;
  latitude: number | null;
  longitude: number | null;
  hasBarbecue: boolean;
  condoFee: number | null;
  iptu: number | null;
  videoUrl: string | null;
  tags: string[];
  images: { id: string; url: string; isCover: boolean; order: number }[];
  documents: { id: string; url: string; originalName: string | null }[];
  viewsCount: number;
}

export interface HouseMapItemDto {
  id: string;
  title: string;
  slug: string;
  price: number;
  listingType: string;
  neighborhood: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  latitude: number;
  longitude: number;
  coverImageUrl: string | null;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type HouseSort = "recent" | "price_asc" | "price_desc";
