import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { ClientFilterInput } from "@/modules/clients/validators/client.validators";

export const clientRepository = {
  async findMany(filters: ClientFilterInput) {
    const where: Prisma.ClientWhereInput = filters.search
      ? {
          OR: [
            { name: { contains: filters.search, mode: "insensitive" } },
            { phone: { contains: filters.search, mode: "insensitive" } },
            { email: { contains: filters.search, mode: "insensitive" } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.client.findMany({
        where,
        include: { _count: { select: { interests: true } } },
        orderBy: { createdAt: "desc" },
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
      }),
      prisma.client.count({ where }),
    ]);

    return { items, total };
  },

  findById(id: string) {
    return prisma.client.findUnique({
      where: { id },
      include: {
        metadata: true,
        favorites: { include: { house: { select: { id: true, title: true, slug: true, images: true } } } },
        interests: {
          include: { house: { select: { id: true, title: true, slug: true } } },
          orderBy: { createdAt: "desc" },
        },
        activities: { orderBy: { createdAt: "desc" }, take: 50 },
      },
    });
  },

  findByPhone(phone: string) {
    return prisma.client.findUnique({ where: { phone } });
  },

  create(data: Prisma.ClientCreateInput) {
    return prisma.client.create({ data });
  },

  update(id: string, data: Prisma.ClientUpdateInput) {
    return prisma.client.update({ where: { id }, data });
  },

  upsertMetadata(
    clientId: string,
    data: Omit<Prisma.MetadataUpdateInput & Prisma.MetadataCreateInput, "client">,
  ) {
    return prisma.metadata.upsert({
      where: { clientId },
      update: data,
      create: { ...data, client: { connect: { id: clientId } } },
    });
  },

  addFavorites(clientId: string, houseIds: string[]) {
    if (houseIds.length === 0) return Promise.resolve();
    return prisma.favorite.createMany({
      data: houseIds.map((houseId) => ({ clientId, houseId })),
      skipDuplicates: true,
    });
  },

  upsertInterest(clientId: string, houseId: string, source: "SITE" | "WHATSAPP" | "ADMIN", notes?: string) {
    return prisma.interest.upsert({
      where: { clientId_houseId: { clientId, houseId } },
      update: { notes: notes ?? undefined },
      create: { clientId, houseId, source, notes },
    });
  },

  logActivity(clientId: string, type: Prisma.ClientActivityCreateInput["type"], payload?: unknown) {
    return prisma.clientActivity.create({
      data: { clientId, type, payload: payload ? (payload as Prisma.InputJsonValue) : undefined },
    });
  },

  countAll() {
    return prisma.client.count();
  },

  countCreatedSince(date: Date) {
    return prisma.client.count({ where: { createdAt: { gte: date } } });
  },
};
