export interface ClientListItemDto {
  id: string;
  name: string;
  phone: string;
  hasWhatsapp: boolean;
  interestsCount: number;
  createdAt: string;
}

export interface ClientDetailDto extends ClientListItemDto {
  email: string | null;
  notes: string | null;
  metadata: {
    incomeRange: string | null;
    maritalStatus: string | null;
    desiredPropertyType: string | null;
    desiredNeighborhood: string | null;
    observations: string | null;
    funnelStage: string;
    preferences: unknown;
    lastContactAt: string | null;
  } | null;
  favorites: { id: string; houseId: string; title: string; slug: string; coverImageUrl: string | null }[];
  interests: {
    id: string;
    houseId: string;
    title: string;
    slug: string;
    stage: string;
    source: string;
    createdAt: string;
  }[];
  activities: { id: string; type: string; payload: unknown; createdAt: string }[];
}
