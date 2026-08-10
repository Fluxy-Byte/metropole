import { accessTypeService } from "@/modules/access/services/access-type.service";
import { updateAccessTypeSchema } from "@/modules/access/validators/access-type.validators";
import { jsonOk, jsonError, handleApiError } from "@/lib/api-response";
import { requirePermission } from "@/lib/session";
import { auditService } from "@/modules/audit/services/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

export async function GET(_request: Request, { params }: RouteContext<"/api/admin/access-types/[id]">) {
  try {
    await requirePermission("ACCESS", "MANAGE");
    const { id } = await params;
    const accessType = await accessTypeService.getById(id);
    if (!accessType) return jsonError("Tipo de acesso não encontrado", 404);
    return jsonOk({ accessType });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/access-types/[id]">) {
  try {
    const actor = await requirePermission("ACCESS", "MANAGE");
    const { id } = await params;
    const body = await request.json();
    const input = updateAccessTypeSchema.parse(body);
    const accessType = await accessTypeService.update(id, input);
    if (!accessType) return jsonError("Tipo de acesso não encontrado", 404);

    const meta = getRequestMeta(request);
    await auditService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      action: "UPDATE",
      entityType: "AccessType",
      entityId: id,
      ip: meta.ip,
      userAgent: meta.userAgent,
      device: meta.device,
    });

    return jsonOk({ accessType });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request, { params }: RouteContext<"/api/admin/access-types/[id]">) {
  try {
    const actor = await requirePermission("ACCESS", "MANAGE");
    const { id } = await params;
    await accessTypeService.remove(id);

    const meta = getRequestMeta(request);
    await auditService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      action: "DELETE",
      entityType: "AccessType",
      entityId: id,
      ip: meta.ip,
      userAgent: meta.userAgent,
      device: meta.device,
    });

    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
