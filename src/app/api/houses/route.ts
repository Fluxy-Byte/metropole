import type { NextRequest } from "next/server";
import { houseService } from "@/modules/houses/services/house.service";
import { houseFilterSchema } from "@/modules/houses/validators/house.validators";
import { jsonOk, handleApiError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const filters = houseFilterSchema.parse(params);
    const result = await houseService.listPublic(filters);
    return jsonOk(result);
  } catch (error) {
    return handleApiError(error);
  }
}
