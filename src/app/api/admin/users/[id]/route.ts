import { userService } from "@/modules/access/services/user.service";
import { updateUserSchema } from "@/modules/access/validators/user.validators";
import { jsonOk, jsonError, handleApiError } from "@/lib/api-response";
import { requirePermission } from "@/lib/session";
import { auditService } from "@/modules/audit/services/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

export async function GET(_request: Request, { params }: RouteContext<"/api/admin/users/[id]">) {
  try {
    await requirePermission("ACCESS", "MANAGE");
    const { id } = await params;
    const user = await userService.getById(id);
    if (!user) return jsonError("Acesso não encontrado", 404);
    return jsonOk({ user });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/users/[id]">) {
  try {
    const actor = await requirePermission("ACCESS", "MANAGE");
    const { id } = await params;
    const body = await request.json();
    const input = updateUserSchema.parse(body);
    const user = await userService.update(id, input);
    if (!user) return jsonError("Acesso não encontrado", 404);

    const meta = getRequestMeta(request);
    await auditService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      action: "UPDATE",
      entityType: "User",
      entityId: id,
      ip: meta.ip,
      userAgent: meta.userAgent,
      device: meta.device,
    });

    return jsonOk({ user });
  } catch (error) {
    return handleApiError(error);
  }
}
