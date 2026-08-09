import { z } from "zod";

const booleanParam = z
  .union([z.literal("true"), z.literal("false"), z.literal("1"), z.literal("0"), z.boolean()])
  .transform((v) => v === "true" || v === "1" || v === true)
  .optional();

const csvParam = z
  .union([
    z.string().transform((v) => v.split(",").map((s) => s.trim()).filter(Boolean)),
    z.array(z.string()),
  ])
  .optional();

export const houseFilterSchema = z.object({
  listingType: z.enum(["SALE", "RENT"]).optional(),
  categorySlugs: csvParam,
  neighborhood: z.string().trim().min(1).optional(),
  city: z.string().trim().min(1).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  bedrooms: z.coerce.number().int().nonnegative().optional(),
  bathrooms: z.coerce.number().int().nonnegative().optional(),
  garageSpaces: z.coerce.number().int().nonnegative().optional(),
  hasPool: booleanParam,
  minBuiltArea: z.coerce.number().nonnegative().optional(),
  maxBuiltArea: z.coerce.number().nonnegative().optional(),
  minTotalArea: z.coerce.number().nonnegative().optional(),
  maxTotalArea: z.coerce.number().nonnegative().optional(),
  search: z.string().trim().max(200).optional(),
  sort: z.enum(["recent", "price_asc", "price_desc"]).default("recent"),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce
    .number()
    .int()
    .refine((v) => [10, 20, 50].includes(v))
    .catch(10),
});

export type HouseFilterInput = z.infer<typeof houseFilterSchema>;

const decimalField = z.coerce.number().nonnegative();

// Base field schemas with NO .default() — shared between create (defaults
// applied explicitly below) and update (left fully optional so omitted
// keys are left untouched instead of being reset to a default value).
const houseBaseFields = {
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().min(10).max(5000),
  price: decimalField,
  listingType: z.enum(["SALE", "RENT"]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "SOLD", "RENTED"]),
  categoryId: z.string().min(1),
  address: z.string().trim().min(3).max(255),
  neighborhood: z.string().trim().min(1).max(120),
  city: z.string().trim().min(1).max(120),
  state: z.string().trim().length(2),
  zipCode: z.string().trim().max(12).optional().nullable(),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  builtArea: decimalField,
  totalArea: decimalField,
  bedrooms: z.coerce.number().int().nonnegative(),
  bathrooms: z.coerce.number().int().nonnegative(),
  garageSpaces: z.coerce.number().int().nonnegative(),
  hasPool: z.boolean(),
  hasBarbecue: z.boolean(),
  condoFee: decimalField.optional().nullable(),
  iptu: decimalField.optional().nullable(),
  videoUrl: z.url().optional().nullable().or(z.literal("")),
  tags: z.array(z.string().trim().min(1).max(40)).max(20),
};

export const createHouseSchema = z.object({
  ...houseBaseFields,
  status: houseBaseFields.status.default("DRAFT"),
  city: houseBaseFields.city.default("Uberlândia"),
  state: houseBaseFields.state.default("MG"),
  builtArea: houseBaseFields.builtArea.default(0),
  totalArea: houseBaseFields.totalArea.default(0),
  bedrooms: houseBaseFields.bedrooms.default(0),
  bathrooms: houseBaseFields.bathrooms.default(0),
  garageSpaces: houseBaseFields.garageSpaces.default(0),
  hasPool: houseBaseFields.hasPool.default(false),
  hasBarbecue: houseBaseFields.hasBarbecue.default(false),
  tags: houseBaseFields.tags.default([]),
});

export const updateHouseSchema = z.object(houseBaseFields).partial();

export type CreateHouseInput = z.infer<typeof createHouseSchema>;
export type UpdateHouseInput = z.infer<typeof updateHouseSchema>;
