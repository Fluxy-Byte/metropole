import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { HouseFilterInput } from "@/modules/houses/validators/house.validators";

const houseInclude = {
  category: true,
  images: { orderBy: { order: "asc" as const } },
};

function buildWhere(filters: HouseFilterInput): Prisma.HouseWhereInput {
  const where: Prisma.HouseWhereInput = {};

  if (filters.listingType) where.listingType = filters.listingType;
  if (filters.categorySlugs?.length) {
    where.category = { slug: { in: filters.categorySlugs } };
  }
  if (filters.neighborhood) {
    where.neighborhood = { contains: filters.neighborhood, mode: "insensitive" };
  }
  if (filters.city) {
    where.city = { contains: filters.city, mode: "insensitive" };
  }
  if (filters.minPrice || filters.maxPrice) {
    where.price = {
      ...(filters.minPrice ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice ? { lte: filters.maxPrice } : {}),
    };
  }
  if (filters.bedrooms) where.bedrooms = { gte: filters.bedrooms };
  if (filters.bathrooms) where.bathrooms = { gte: filters.bathrooms };
  if (filters.garageSpaces) where.garageSpaces = { gte: filters.garageSpaces };
  if (filters.hasPool) where.hasPool = true;
  if (filters.minBuiltArea || filters.maxBuiltArea) {
    where.builtArea = {
      ...(filters.minBuiltArea ? { gte: filters.minBuiltArea } : {}),
      ...(filters.maxBuiltArea ? { lte: filters.maxBuiltArea } : {}),
    };
  }
  if (filters.minTotalArea || filters.maxTotalArea) {
    where.totalArea = {
      ...(filters.minTotalArea ? { gte: filters.minTotalArea } : {}),
      ...(filters.maxTotalArea ? { lte: filters.maxTotalArea } : {}),
    };
  }
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { neighborhood: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return where;
}

function buildOrderBy(sort: HouseFilterInput["sort"]): Prisma.HouseOrderByWithRelationInput {
  switch (sort) {
    case "price_asc":
      return { price: "asc" };
    case "price_desc":
      return { price: "desc" };
    default:
      return { createdAt: "desc" };
  }
}

export const houseRepository = {
  async findPublicMany(filters: HouseFilterInput) {
    const where: Prisma.HouseWhereInput = { ...buildWhere(filters), status: "PUBLISHED" };
    const [items, total] = await Promise.all([
      prisma.house.findMany({
        where,
        include: houseInclude,
        orderBy: buildOrderBy(filters.sort),
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
      }),
      prisma.house.count({ where }),
    ]);
    return { items, total };
  },

  async findAdminMany(
    filters: HouseFilterInput & { status?: string },
  ) {
    const where: Prisma.HouseWhereInput = buildWhere(filters);
    if (filters.status) where.status = filters.status as Prisma.EnumHouseStatusFilter["equals"];

    const [items, total] = await Promise.all([
      prisma.house.findMany({
        where,
        include: houseInclude,
        orderBy: buildOrderBy(filters.sort),
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
      }),
      prisma.house.count({ where }),
    ]);
    return { items, total };
  },

  findBySlug(slug: string) {
    return prisma.house.findUnique({
      where: { slug },
      include: { ...houseInclude, documents: true },
    });
  },

  findById(id: string) {
    return prisma.house.findUnique({
      where: { id },
      include: { ...houseInclude, documents: true },
    });
  },

  async findSimilar(house: { id: string; categoryId: string; neighborhood: string }, limit = 4) {
    return prisma.house.findMany({
      where: {
        id: { not: house.id },
        status: "PUBLISHED",
        OR: [{ categoryId: house.categoryId }, { neighborhood: house.neighborhood }],
      },
      include: houseInclude,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  findAllWithCoordinates() {
    return prisma.house.findMany({
      where: {
        status: "PUBLISHED",
        latitude: { not: null },
        longitude: { not: null },
      },
      include: houseInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  findByIds(ids: string[]) {
    if (ids.length === 0) return Promise.resolve([]);
    return prisma.house.findMany({
      where: { id: { in: ids }, status: "PUBLISHED" },
      include: houseInclude,
    });
  },

  findLatestPublished(limit = 8) {
    return prisma.house.findMany({
      where: { status: "PUBLISHED" },
      include: houseInclude,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  create(data: Prisma.HouseCreateInput) {
    return prisma.house.create({ data, include: { ...houseInclude, documents: true } });
  },

  update(id: string, data: Prisma.HouseUpdateInput) {
    return prisma.house.update({ where: { id }, data, include: { ...houseInclude, documents: true } });
  },

  archive(id: string) {
    return prisma.house.update({ where: { id }, data: { status: "ARCHIVED" } });
  },

  delete(id: string) {
    return prisma.house.delete({ where: { id } });
  },

  incrementViews(id: string) {
    return prisma.house.update({ where: { id }, data: { viewsCount: { increment: 1 } } });
  },

  countByStatus() {
    return prisma.house.groupBy({ by: ["status"], _count: true });
  },

  countAll() {
    return prisma.house.count();
  },

  countCreatedSince(date: Date) {
    return prisma.house.count({ where: { createdAt: { gte: date } } });
  },

  async distinctNeighborhoodsByCity(city?: string) {
    const rows = await prisma.house.findMany({
      where: {
        status: "PUBLISHED",
        ...(city ? { city: { equals: city, mode: "insensitive" } } : {}),
      },
      select: { neighborhood: true },
      distinct: ["neighborhood"],
      orderBy: { neighborhood: "asc" },
    });
    return rows.map((row) => row.neighborhood);
  },
};
