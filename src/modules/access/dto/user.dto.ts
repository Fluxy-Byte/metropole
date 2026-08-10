import type { User, AccessType } from "@/generated/prisma/client";
import type { UserListItemDto } from "@/modules/access/types";

type UserWithAccessType = User & { accessType: Pick<AccessType, "id" | "name"> };

export function toUserListItemDto(user: UserWithAccessType): UserListItemDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    cpf: user.cpf,
    isActive: user.isActive,
    accessType: { id: user.accessType.id, name: user.accessType.name },
    createdAt: user.createdAt.toISOString(),
  };
}
