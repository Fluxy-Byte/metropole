import { z } from "zod";

export const contactRequestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .min(8)
    .max(20)
    .regex(/^[0-9()+\-\s]+$/, "Telefone inválido"),
  hasWhatsapp: z.boolean().default(false),
  email: z.email().optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  favoriteHouseIds: z.array(z.string()).max(100).default([]),
});

export type ContactRequestInput = z.infer<typeof contactRequestSchema>;

export const clientFilterSchema = z.object({
  search: z.string().trim().max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export type ClientFilterInput = z.infer<typeof clientFilterSchema>;

export const updateMetadataSchema = z.object({
  incomeRange: z.string().trim().max(60).optional(),
  maritalStatus: z.string().trim().max(60).optional(),
  desiredPropertyType: z.string().trim().max(60).optional(),
  desiredNeighborhood: z.string().trim().max(120).optional(),
  observations: z.string().trim().max(2000).optional(),
  funnelStage: z
    .enum(["LEAD", "QUALIFIED", "VISIT_SCHEDULED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"])
    .optional(),
  preferences: z.record(z.string(), z.unknown()).optional(),
});

export type UpdateMetadataInput = z.infer<typeof updateMetadataSchema>;

export const addInterestSchema = z.object({
  houseId: z.string().min(1),
  notes: z.string().trim().max(1000).optional(),
});

export const clientIdentitySchema = z.object({
  phone: z.string().trim().min(8).max(20),
  name: z.string().trim().min(2).max(120).optional(),
});

export const updatePipelineSchema = z
  .object({
    pipelineStage: z.enum(["START", "IN_PROGRESS", "NEGOTIATION", "DONE"]),
    outcome: z.enum(["SOLD", "LOST"]).optional(),
  })
  .refine((data) => data.pipelineStage !== "DONE" || !!data.outcome, {
    message: "Informe Vendido ou Perdido para concluir o atendimento.",
    path: ["outcome"],
  });

export type UpdatePipelineInput = z.infer<typeof updatePipelineSchema>;
