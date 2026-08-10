import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome completo").max(160),
  email: z.email("E-mail inválido"),
  cpf: z
    .string()
    .trim()
    .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "CPF inválido")
    .optional()
    .or(z.literal(""))
    .nullable(),
  accessTypeId: z.string().min(1, "Selecione um tipo de acesso"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(2).max(160).optional(),
  cpf: z
    .string()
    .trim()
    .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "CPF inválido")
    .optional()
    .or(z.literal(""))
    .nullable(),
  accessTypeId: z.string().min(1).optional(),
});

export const userFilterSchema = z.object({
  search: z.string().trim().max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce
    .number()
    .int()
    .refine((v) => [10, 20, 50].includes(v))
    .catch(20),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserFilterInput = z.infer<typeof userFilterSchema>;
