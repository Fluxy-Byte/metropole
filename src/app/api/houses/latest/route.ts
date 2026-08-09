import type { NextRequest } from "next/server";
import { houseService } from "@/modules/houses/services/house.service";
import { jsonOk, handleApiError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const limit = Number(request.nextUrl.searchParams.get("limit") ?? 8);
    const items = await houseService.latest(limit);
    return jsonOk({ items });
  } catch (error) {
    return handleApiError(error);
  }
}
