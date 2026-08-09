import type { NextRequest } from "next/server";
import { houseService } from "@/modules/houses/services/house.service";
import { houseFilterSchema, createHouseSchema } from "@/modules/houses/validators/house.validators";
import { jsonOk, handleApiError } from "@/lib/api-response";
import { requireRole } from "@/lib/session";
import { auditService } from "@/modules/audit/services/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

export async function GET(request: NextRequest) {
  try {
    await requireRole("ADMIN", "AGENT");
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const filters = houseFilterSchema.parse(params);
    const status = request.nextUrl.searchParams.get("status") ?? undefined;
    const result = await houseService.listAdmin({ ...filters, status });
    return jsonOk(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole("ADMIN", "AGENT");
    const body = await request.json();
    const input = createHouseSchema.parse(body);
    const house = await houseService.create(input);

    const meta = getRequestMeta(request);
    await auditService.record({
      actorId: user.id,
      actorEmail: user.email,
      action: "CREATE",
      entityType: "House",
      entityId: house.id,
      ip: meta.ip,
      userAgent: meta.userAgent,
      device: meta.device,
    });

    return jsonOk({ house }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
