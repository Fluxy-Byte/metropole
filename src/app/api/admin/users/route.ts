import type { NextRequest } from "next/server";
import { userService } from "@/modules/access/services/user.service";
import { userFilterSchema, createUserSchema } from "@/modules/access/validators/user.validators";
import { jsonOk, handleApiError } from "@/lib/api-response";
import { requirePermission } from "@/lib/session";
import { auditService } from "@/modules/audit/services/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

export async function GET(request: NextRequest) {
  try {
    await requirePermission("ACCESS", "MANAGE");
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const filters = userFilterSchema.parse(params);
    const result = await userService.list(filters);
    return jsonOk(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const actor = await requirePermission("ACCESS", "MANAGE");
    const body = await request.json();
    const input = createUserSchema.parse(body);
    const user = await userService.create(input);

    const meta = getRequestMeta(request);
    await auditService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      action: "CREATE",
      entityType: "User",
      entityId: user.id,
      ip: meta.ip,
      userAgent: meta.userAgent,
      device: meta.device,
    });

    return jsonOk({ user }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
