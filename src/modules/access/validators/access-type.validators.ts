import { z } from "zod";
import { PERMISSION_RESOURCES, RESOURCE_ACTIONS } from "@/modules/access/permissions";

const permissionsShape = Object.fromEntries(
  PERMISSION_RESOURCES.map((resource) => [
    resource,
    z
      .object(Object.fromEntries(RESOURCE_ACTIONS[resource].map((action) => [action, z.boolean()])))
      .partial()
      .optional(),
  ]),
);

export const permissionsSchema = z.object(permissionsShape).partial();

export const createAccessTypeSchema = z.object({
  name: z.string().trim().min(2, "Informe um nome").max(80),
  description: z.string().trim().max(255).optional().nullable(),
  permissions: permissionsSchema.default({}),
});

export const updateAccessTypeSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  description: z.string().trim().max(255).optional().nullable(),
  permissions: permissionsSchema.optional(),
});

export const accessTypeFilterSchema = z.object({
  search: z.string().trim().max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce
    .number()
    .int()
    .refine((v) => [10, 20, 50].includes(v))
    .catch(20),
});

export type CreateAccessTypeInput = z.infer<typeof createAccessTypeSchema>;
export type UpdateAccessTypeInput = z.infer<typeof updateAccessTypeSchema>;
export type AccessTypeFilterInput = z.infer<typeof accessTypeFilterSchema>;
