import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { UserFilterInput } from "@/modules/access/validators/user.validators";

const userInclude = {
  accessType: { select: { id: true, name: true } },
};

export const userRepository = {
  async findMany(filters: UserFilterInput) {
    const where: Prisma.UserWhereInput = filters.search
      ? {
          OR: [
            { name: { contains: filters.search, mode: "insensitive" } },
            { email: { contains: filters.search, mode: "insensitive" } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: userInclude,
        orderBy: { createdAt: "desc" },
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
      }),
      prisma.user.count({ where }),
    ]);

    return { items, total };
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id }, include: userInclude });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findByCpf(cpf: string) {
    return prisma.user.findUnique({ where: { cpf } });
  },

  async createWithCredentials(
    data: { name: string; email: string; cpf?: string | null; accessTypeId: string },
    passwordHash: string,
  ) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          cpf: data.cpf || null,
          accessTypeId: data.accessTypeId,
          emailVerified: false,
          isActive: true,
        },
        include: userInclude,
      });
      await tx.account.create({
        data: {
          userId: user.id,
          providerId: "credential",
          accountId: user.id,
          password: passwordHash,
        },
      });
      return user;
    });
  },

  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data, include: userInclude });
  },

  async setActive(id: string, isActive: boolean) {
    const user = await prisma.user.update({ where: { id }, data: { isActive }, include: userInclude });
    if (!isActive) {
      await prisma.session.deleteMany({ where: { userId: id } });
    }
    return user;
  },
};
