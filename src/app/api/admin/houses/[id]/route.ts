import { houseService } from "@/modules/houses/services/house.service";
import { updateHouseSchema } from "@/modules/houses/validators/house.validators";
import { jsonOk, jsonError, handleApiError } from "@/lib/api-response";
import { requireRole } from "@/lib/session";
import { auditService } from "@/modules/audit/services/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

export async function GET(_request: Request, { params }: RouteContext<"/api/admin/houses/[id]">) {
  try {
    await requireRole("ADMIN", "AGENT");
    const { id } = await params;
    const house = await houseService.getById(id);
    if (!house) return jsonError("Imóvel não encontrado", 404);
    return jsonOk({ house });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/houses/[id]">) {
  try {
    const user = await requireRole("ADMIN", "AGENT");
    const { id } = await params;
    const body = await request.json();
    const input = updateHouseSchema.parse(body);
    const house = await houseService.update(id, input);
    if (!house) return jsonError("Imóvel não encontrado", 404);

    const meta = getRequestMeta(request);
    await auditService.record({
      actorId: user.id,
      actorEmail: user.email,
      action: "UPDATE",
      entityType: "House",
      entityId: id,
      ip: meta.ip,
      userAgent: meta.userAgent,
      device: meta.device,
    });

    return jsonOk({ house });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request, { params }: RouteContext<"/api/admin/houses/[id]">) {
  try {
    const user = await requireRole("ADMIN");
    const { id } = await params;
    const removed = await houseService.remove(id);
    if (!removed) return jsonError("Imóvel não encontrado", 404);

    const meta = getRequestMeta(request);
    await auditService.record({
      actorId: user.id,
      actorEmail: user.email,
      action: "DELETE",
      entityType: "House",
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
