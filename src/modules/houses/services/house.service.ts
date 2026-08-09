import { createHash } from "crypto";
import { houseRepository } from "@/modules/houses/repository/house.repository";
import { toHouseDetailDto, toHouseListItemDto, toHouseMapItemDto } from "@/modules/houses/dto/house.dto";
import type { HouseFilterInput } from "@/modules/houses/validators/house.validators";
import type { CreateHouseInput, UpdateHouseInput } from "@/modules/houses/validators/house.validators";
import { CACHE_KEYS, cacheDelByPrefix, cacheWrap } from "@/lib/redis";
import type {
  HouseDetailDto,
  HouseListItemDto,
  HouseMapItemDto,
  PaginatedResult,
} from "@/modules/houses/types";

function hashFilters(filters: Record<string, unknown>): string {
  return createHash("sha1").update(JSON.stringify(filters)).digest("hex");
}

async function invalidateHouseCaches(id?: string) {
  await cacheDelByPrefix(CACHE_KEYS.housesListPrefix);
  await cacheDelByPrefix(CACHE_KEYS.dashboardPrefix);
  if (id) {
    await cacheDelByPrefix(`${CACHE_KEYS.houseDetailPrefix}${id}`);
  }
}

export const houseService = {
  async listPublic(filters: HouseFilterInput): Promise<PaginatedResult<HouseListItemDto>> {
    const cacheKey = CACHE_KEYS.housesList(hashFilters(filters));
    return cacheWrap(cacheKey, 60, async () => {
      const { items, total } = await houseRepository.findPublicMany(filters);
      return {
        items: items.map(toHouseListItemDto),
        total,
        page: filters.page,
        pageSize: filters.pageSize,
        totalPages: Math.max(1, Math.ceil(total / filters.pageSize)),
      };
    });
  },

  async forMap(): Promise<HouseMapItemDto[]> {
    return cacheWrap(`${CACHE_KEYS.housesListPrefix}map`, 300, async () => {
      const items = await houseRepository.findAllWithCoordinates();
      return items.map(toHouseMapItemDto);
    });
  },

  async listAdmin(filters: HouseFilterInput & { status?: string }): Promise<PaginatedResult<HouseListItemDto>> {
    const { items, total } = await houseRepository.findAdminMany(filters);
    return {
      items: items.map(toHouseListItemDto),
      total,
      page: filters.page,
      pageSize: filters.pageSize,
      totalPages: Math.max(1, Math.ceil(total / filters.pageSize)),
    };
  },

  async latest(limit = 8): Promise<HouseListItemDto[]> {
    return cacheWrap(`${CACHE_KEYS.housesListPrefix}latest:${limit}`, 60, async () => {
      const items = await houseRepository.findLatestPublished(limit);
      return items.map(toHouseListItemDto);
    });
  },

  async getBySlug(slug: string, opts: { trackView?: boolean } = {}): Promise<HouseDetailDto | null> {
    const cacheKey = CACHE_KEYS.houseDetail(slug);
    const house = await cacheWrap(cacheKey, 120, async () => {
      const found = await houseRepository.findBySlug(slug);
      return found ? toHouseDetailDto(found) : null;
    });

    if (house && opts.trackView) {
      await houseRepository.incrementViews(house.id);
    }

    return house;
  },

  async getById(id: string) {
    const house = await houseRepository.findById(id);
    return house ? toHouseDetailDto(house) : null;
  },

  async getManyByIds(ids: string[]): Promise<HouseListItemDto[]> {
    const items = await houseRepository.findByIds(ids);
    return items.map(toHouseListItemDto);
  },

  async similar(house: { id: string; categoryId: string; neighborhood: string }) {
    const items = await houseRepository.findSimilar(house);
    return items.map(toHouseListItemDto);
  },

  async create(input: CreateHouseInput) {
    const slug = await this.generateUniqueSlug(input.title);
    const created = await houseRepository.create({
      title: input.title,
      slug,
      description: input.description,
      price: input.price,
      listingType: input.listingType,
      status: input.status,
      address: input.address,
      neighborhood: input.neighborhood,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode ?? null,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      builtArea: input.builtArea,
      totalArea: input.totalArea,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      garageSpaces: input.garageSpaces,
      hasPool: input.hasPool,
      hasBarbecue: input.hasBarbecue,
      condoFee: input.condoFee ?? null,
      iptu: input.iptu ?? null,
      videoUrl: input.videoUrl || null,
      tags: input.tags,
      publishedAt: input.status === "PUBLISHED" ? new Date() : null,
      category: { connect: { id: input.categoryId } },
    });
    await invalidateHouseCaches();
    return toHouseDetailDto(created);
  },

  async update(id: string, input: UpdateHouseInput) {
    const existing = await houseRepository.findById(id);
    if (!existing) return null;

    const data: Record<string, unknown> = { ...input };
    delete data.categoryId;

    if (input.categoryId) {
      data.category = { connect: { id: input.categoryId } };
    }
    if (input.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
      data.publishedAt = new Date();
    }
    if (input.videoUrl === "") {
      data.videoUrl = null;
    }

    const updated = await houseRepository.update(id, data);
    await invalidateHouseCaches(existing.slug);
    return toHouseDetailDto(updated);
  },

  async archive(id: string) {
    const house = await houseRepository.archive(id);
    await invalidateHouseCaches(house.slug);
    return house;
  },

  async remove(id: string) {
    const existing = await houseRepository.findById(id);
    if (!existing) return null;
    await houseRepository.delete(id);
    await invalidateHouseCaches(existing.slug);
    return existing;
  },

  async neighborhoodsByCity(city?: string): Promise<string[]> {
    const trimmed = city?.trim();
    const cacheKey = `${CACHE_KEYS.housesListPrefix}neighborhoods:${trimmed?.toLowerCase() || "__all__"}`;
    return cacheWrap(cacheKey, 300, () => houseRepository.distinctNeighborhoodsByCity(trimmed));
  },

  async generateUniqueSlug(title: string): Promise<string> {
    const base = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    let slug = base;
    let attempt = 1;
    while (await houseRepository.findBySlug(slug)) {
      attempt += 1;
      slug = `${base}-${attempt}`;
    }
    return slug;
  },
};
