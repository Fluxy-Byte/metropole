import { z } from "zod";

export const axelSearchSchema = z.object({
  query: z.string().trim().min(2).max(300),
  limit: z.coerce.number().int().positive().max(20).default(5),
});

export const axelIdentitySchema = z.object({
  phone: z.string().trim().min(8).max(20),
  name: z.string().trim().min(2).max(120).optional(),
});

export const axelMetadataSchema = axelIdentitySchema.extend({
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

export const axelInterestSchema = axelIdentitySchema.extend({
  houseId: z.string().min(1),
  notes: z.string().trim().max(500).optional(),
});

export const axelHistorySchema = z.object({
  phone: z.string().trim().min(8).max(20),
});
