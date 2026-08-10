import type { NextRequest } from "next/server";
import { accessTypeService } from "@/modules/access/services/access-type.service";
import { accessTypeFilterSchema, createAccessTypeSchema } from "@/modules/access/validators/access-type.validators";
import { jsonOk, handleApiError } from "@/lib/api-response";
import { requirePermission } from "@/lib/session";
import { auditService } from "@/modules/audit/services/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

export async function GET(request: NextRequest) {
  try {
    await requirePermission("ACCESS", "MANAGE");
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const filters = accessTypeFilterSchema.parse(params);
    const result = await accessTypeService.list(filters);
    return jsonOk(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const actor = await requirePermission("ACCESS", "MANAGE");
    const body = await request.json();
    const input = createAccessTypeSchema.parse(body);
    const accessType = await accessTypeService.create(input);

    const meta = getRequestMeta(request);
    await auditService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      action: "CREATE",
      entityType: "AccessType",
      entityId: accessType.id,
      ip: meta.ip,
      userAgent: meta.userAgent,
      device: meta.device,
    });

    return jsonOk({ accessType }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
