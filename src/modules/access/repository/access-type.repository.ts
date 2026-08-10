import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { AccessTypeFilterInput } from "@/modules/access/validators/access-type.validators";

const withUserCount = {
  _count: { select: { users: true } },
};

export const accessTypeRepository = {
  async findMany(filters: AccessTypeFilterInput) {
    const where: Prisma.AccessTypeWhereInput = filters.search
      ? { name: { contains: filters.search, mode: "insensitive" } }
      : {};

    const [items, total] = await Promise.all([
      prisma.accessType.findMany({
        where,
        include: withUserCount,
        orderBy: { name: "asc" },
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
      }),
      prisma.accessType.count({ where }),
    ]);

    return { items, total };
  },

  findAll() {
    return prisma.accessType.findMany({ include: withUserCount, orderBy: { name: "asc" } });
  },

  findById(id: string) {
    return prisma.accessType.findUnique({ where: { id }, include: withUserCount });
  },

  findByName(name: string) {
    return prisma.accessType.findUnique({ where: { name } });
  },

  create(data: Prisma.AccessTypeCreateInput) {
    return prisma.accessType.create({ data, include: withUserCount });
  },

  update(id: string, data: Prisma.AccessTypeUpdateInput) {
    return prisma.accessType.update({ where: { id }, data, include: withUserCount });
  },

  delete(id: string) {
    return prisma.accessType.delete({ where: { id } });
  },

  countUsers(id: string) {
    return prisma.user.count({ where: { accessTypeId: id } });
  },
};
