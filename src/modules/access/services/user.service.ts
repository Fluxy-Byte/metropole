import { hashPassword } from "better-auth/crypto";
import { userRepository } from "@/modules/access/repository/user.repository";
import { toUserListItemDto } from "@/modules/access/dto/user.dto";
import type { CreateUserInput, UpdateUserInput, UserFilterInput } from "@/modules/access/validators/user.validators";
import type { PaginatedResult, UserListItemDto } from "@/modules/access/types";

export const userService = {
  async list(filters: UserFilterInput): Promise<PaginatedResult<UserListItemDto>> {
    const { items, total } = await userRepository.findMany(filters);
    return {
      items: items.map(toUserListItemDto),
      total,
      page: filters.page,
      pageSize: filters.pageSize,
      totalPages: Math.max(1, Math.ceil(total / filters.pageSize)),
    };
  },

  async getById(id: string): Promise<UserListItemDto | null> {
    const user = await userRepository.findById(id);
    return user ? toUserListItemDto(user) : null;
  },

  async create(input: CreateUserInput): Promise<UserListItemDto> {
    const email = input.email.trim().toLowerCase();

    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) throw new Error("DUPLICATE_EMAIL");

    const cpf = input.cpf?.trim() || null;
    if (cpf) {
      const existingCpf = await userRepository.findByCpf(cpf);
      if (existingCpf) throw new Error("DUPLICATE_CPF");
    }

    const passwordHash = await hashPassword(input.password);
    const created = await userRepository.createWithCredentials(
      { name: input.name.trim(), email, cpf, accessTypeId: input.accessTypeId },
      passwordHash,
    );
    return toUserListItemDto(created);
  },

  async update(id: string, input: UpdateUserInput): Promise<UserListItemDto | null> {
    const existing = await userRepository.findById(id);
    if (!existing) return null;

    if (input.cpf) {
      const cpf = input.cpf.trim();
      const existingCpf = await userRepository.findByCpf(cpf);
      if (existingCpf && existingCpf.id !== id) throw new Error("DUPLICATE_CPF");
    }

    const updated = await userRepository.update(id, {
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      ...(input.cpf !== undefined ? { cpf: input.cpf?.trim() || null } : {}),
      ...(input.accessTypeId !== undefined ? { accessType: { connect: { id: input.accessTypeId } } } : {}),
    });
    return toUserListItemDto(updated);
  },

  async deactivate(id: string): Promise<UserListItemDto | null> {
    const existing = await userRepository.findById(id);
    if (!existing) return null;
    const updated = await userRepository.setActive(id, false);
    return toUserListItemDto(updated);
  },

  async reactivate(id: string): Promise<UserListItemDto | null> {
    const existing = await userRepository.findById(id);
    if (!existing) return null;
    const updated = await userRepository.setActive(id, true);
    return toUserListItemDto(updated);
  },
};
