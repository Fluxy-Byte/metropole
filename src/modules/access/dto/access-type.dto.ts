import type { AccessType } from "@/generated/prisma/client";
import type { AccessTypeDto } from "@/modules/access/types";
import type { PermissionMatrix } from "@/modules/access/permissions";

type AccessTypeWithUserCount = AccessType & { _count: { users: number } };

export function toAccessTypeDto(accessType: AccessTypeWithUserCount): AccessTypeDto {
  return {
    id: accessType.id,
    name: accessType.name,
    description: accessType.description,
    permissions: (accessType.permissions as PermissionMatrix) ?? {},
    isSystem: accessType.isSystem,
    userCount: accessType._count.users,
    createdAt: accessType.createdAt.toISOString(),
    updatedAt: accessType.updatedAt.toISOString(),
  };
}
