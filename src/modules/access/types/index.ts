import type { PermissionMatrix } from "@/modules/access/permissions";

export interface AccessTypeDto {
  id: string;
  name: string;
  description: string | null;
  permissions: PermissionMatrix;
  isSystem: boolean;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserListItemDto {
  id: string;
  name: string;
  email: string;
  cpf: string | null;
  isActive: boolean;
  accessType: { id: string; name: string };
  createdAt: string;
}

export type UserDetailDto = UserListItemDto;

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
