import type { NextRequest } from "next/server";
import { houseService } from "@/modules/houses/services/house.service";
import { jsonOk, handleApiError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const city = request.nextUrl.searchParams.get("city")?.trim() || undefined;
    const items = await houseService.neighborhoodsByCity(city);
    return jsonOk({ items });
  } catch (error) {
    return handleApiError(error);
  }
}
