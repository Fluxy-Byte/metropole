import type { Client, ClientActivity, Favorite, House, Interest, Metadata } from "@/generated/prisma/client";
import type { ClientDetailDto, ClientListItemDto } from "@/modules/clients/types";

type ClientForList = Client & { _count: { interests: number } };

export function toClientListItemDto(client: ClientForList): ClientListItemDto {
  return {
    id: client.id,
    name: client.name,
    phone: client.phone,
    hasWhatsapp: client.hasWhatsapp,
    interestsCount: client._count.interests,
    createdAt: client.createdAt.toISOString(),
    pipelineStage: client.pipelineStage,
    outcome: client.outcome,
  };
}

type ClientForDetail = Client & {
  metadata: Metadata | null;
  favorites: (Favorite & { house: Pick<House, "id" | "title" | "slug"> & { images: { url: string; isCover: boolean }[] } })[];
  interests: (Interest & { house: Pick<House, "id" | "title" | "slug"> })[];
  activities: ClientActivity[];
};

export function toClientDetailDto(client: ClientForDetail): ClientDetailDto {
  return {
    id: client.id,
    name: client.name,
    phone: client.phone,
    hasWhatsapp: client.hasWhatsapp,
    email: client.email,
    notes: client.notes,
    interestsCount: client.interests.length,
    createdAt: client.createdAt.toISOString(),
    pipelineStage: client.pipelineStage,
    outcome: client.outcome,
    metadata: client.metadata
      ? {
          incomeRange: client.metadata.incomeRange,
          maritalStatus: client.metadata.maritalStatus,
          desiredPropertyType: client.metadata.desiredPropertyType,
          desiredNeighborhood: client.metadata.desiredNeighborhood,
          observations: client.metadata.observations,
          funnelStage: client.metadata.funnelStage,
          preferences: client.metadata.preferences,
          lastContactAt: client.metadata.lastContactAt?.toISOString() ?? null,
        }
      : null,
    favorites: client.favorites.map((f) => ({
      id: f.id,
      houseId: f.house.id,
      title: f.house.title,
      slug: f.house.slug,
      coverImageUrl: f.house.images.find((i) => i.isCover)?.url ?? f.house.images[0]?.url ?? null,
    })),
    interests: client.interests.map((i) => ({
      id: i.id,
      houseId: i.house.id,
      title: i.house.title,
      slug: i.house.slug,
      stage: i.stage,
      source: i.source,
      createdAt: i.createdAt.toISOString(),
    })),
    activities: client.activities.map((a) => ({
      id: a.id,
      type: a.type,
      payload: a.payload,
      createdAt: a.createdAt.toISOString(),
    })),
  };
}
