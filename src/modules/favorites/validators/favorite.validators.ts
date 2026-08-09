import { z } from "zod";

export const favoriteIdsSchema = z.object({
  ids: z.array(z.string().min(1)).max(200).default([]),
});

export type FavoriteIdsInput = z.infer<typeof favoriteIdsSchema>;
