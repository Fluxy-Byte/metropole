import type { NextRequest } from "next/server";
import { clientService } from "@/modules/clients/services/client.service";
import { clientFilterSchema } from "@/modules/clients/validators/client.validators";
import { jsonOk, handleApiError } from "@/lib/api-response";
import { requireRole } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    await requireRole("ADMIN", "AGENT");
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const filters = clientFilterSchema.parse(params);
    const result = await clientService.list(filters);
    return jsonOk(result);
  } catch (error) {
    return handleApiError(error);
  }
}
