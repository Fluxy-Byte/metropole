import { accessTypeRepository } from "@/modules/access/repository/access-type.repository";
import { toAccessTypeDto } from "@/modules/access/dto/access-type.dto";
import { CACHE_KEYS, cacheDel, cacheDelByPrefix, cacheWrap } from "@/lib/redis";
import type {
  CreateAccessTypeInput,
  UpdateAccessTypeInput,
  AccessTypeFilterInput,
} from "@/modules/access/validators/access-type.validators";
import type { AccessTypeDto, PaginatedResult } from "@/modules/access/types";
import type { PermissionMatrix } from "@/modules/access/permissions";

async function invalidateAccessTypeCaches(id?: string) {
  await cacheDelByPrefix(CACHE_KEYS.accessTypesListPrefix);
  if (id) await cacheDel(CACHE_KEYS.accessTypePermissions(id));
}

export const accessTypeService = {
  async list(filters: AccessTypeFilterInput): Promise<PaginatedResult<AccessTypeDto>> {
    const { items, total } = await accessTypeRepository.findMany(filters);
    return {
      items: items.map(toAccessTypeDto),
      total,
      page: filters.page,
      pageSize: filters.pageSize,
      totalPages: Math.max(1, Math.ceil(total / filters.pageSize)),
    };
  },

  async listAll(): Promise<AccessTypeDto[]> {
    const items = await accessTypeRepository.findAll();
    return items.map(toAccessTypeDto);
  },

  async getById(id: string): Promise<AccessTypeDto | null> {
    const accessType = await accessTypeRepository.findById(id);
    return accessType ? toAccessTypeDto(accessType) : null;
  },

  async getPermissions(accessTypeId: string): Promise<PermissionMatrix> {
    return cacheWrap(CACHE_KEYS.accessTypePermissions(accessTypeId), 300, async () => {
      const accessType = await accessTypeRepository.findById(accessTypeId);
      return (accessType?.permissions as PermissionMatrix) ?? {};
    });
  },

  async create(input: CreateAccessTypeInput): Promise<AccessTypeDto> {
    const existing = await accessTypeRepository.findByName(input.name);
    if (existing) throw new Error("ACCESS_TYPE_NAME_TAKEN");

    const created = await accessTypeRepository.create({
      name: input.name,
      description: input.description || null,
      permissions: input.permissions,
    });
    await invalidateAccessTypeCaches();
    return toAccessTypeDto(created);
  },

  async update(id: string, input: UpdateAccessTypeInput): Promise<AccessTypeDto | null> {
    const existing = await accessTypeRepository.findById(id);
    if (!existing) return null;
    if (existing.isSystem) throw new Error("ACCESS_TYPE_IS_SYSTEM");

    if (input.name && input.name !== existing.name) {
      const nameTaken = await accessTypeRepository.findByName(input.name);
      if (nameTaken) throw new Error("ACCESS_TYPE_NAME_TAKEN");
    }

    const updated = await accessTypeRepository.update(id, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined ? { description: input.description || null } : {}),
      ...(input.permissions !== undefined ? { permissions: input.permissions } : {}),
    });
    await invalidateAccessTypeCaches(id);
    return toAccessTypeDto(updated);
  },

  async remove(id: string): Promise<void> {
    const existing = await accessTypeRepository.findById(id);
    if (!existing) return;
    if (existing.isSystem) throw new Error("ACCESS_TYPE_IS_SYSTEM");

    const userCount = await accessTypeRepository.countUsers(id);
    if (userCount > 0) throw new Error("ACCESS_TYPE_IN_USE");

    await accessTypeRepository.delete(id);
    await invalidateAccessTypeCaches(id);
  },
};
