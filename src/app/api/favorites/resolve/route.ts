import type { NextRequest } from "next/server";
import { favoriteService } from "@/modules/favorites/services/favorite.service";
import { favoriteIdsSchema } from "@/modules/favorites/validators/favorite.validators";
import { jsonOk, handleApiError } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = favoriteIdsSchema.parse(body);
    const items = await favoriteService.resolveHouses(ids);
    return jsonOk({ items });
  } catch (error) {
    return handleApiError(error);
  }
}
