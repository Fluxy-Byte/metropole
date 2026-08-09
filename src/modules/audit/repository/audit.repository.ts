import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { AuditListFilters, RecordAuditInput } from "@/modules/audit/types";

export const auditRepository = {
  create(input: RecordAuditInput) {
    return prisma.audit.create({
      data: {
        actorId: input.actorId ?? null,
        actorEmail: input.actorEmail ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        ip: input.ip ?? null,
        userAgent: input.userAgent ?? null,
        device: input.device ?? null,
        metadata: (input.metadata as Prisma.InputJsonValue) ?? undefined,
      },
    });
  },

  async list(filters: AuditListFilters) {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 20;

    const where = {
      ...(filters.action ? { action: filters.action } : {}),
      ...(filters.entityType ? { entityType: filters.entityType } : {}),
      ...(filters.actorId ? { actorId: filters.actorId } : {}),
      ...(filters.search
        ? {
            OR: [
              { entityType: { contains: filters.search, mode: "insensitive" as const } },
              { actorEmail: { contains: filters.search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.audit.findMany({
        where,
        include: { actor: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.audit.count({ where }),
    ]);

    return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
  },
};
