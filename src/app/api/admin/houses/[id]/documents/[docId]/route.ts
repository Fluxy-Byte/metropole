import { houseMediaService } from "@/modules/houses/services/house-media.service";
import { jsonOk, jsonError, handleApiError } from "@/lib/api-response";
import { requirePermission } from "@/lib/session";
import { auditService } from "@/modules/audit/services/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

export async function DELETE(
  request: Request,
  { params }: RouteContext<"/api/admin/houses/[id]/documents/[docId]">,
) {
  try {
    const user = await requirePermission("HOUSES", "EDIT");
    const { id, docId } = await params;
    const document = await houseMediaService.removeDocument(id, docId);
    if (!document) return jsonError("Documento não encontrado", 404);

    const meta = getRequestMeta(request);
    await auditService.record({
      actorId: user.id,
      actorEmail: user.email,
      action: "DELETE",
      entityType: "HouseDocument",
      entityId: docId,
      ip: meta.ip,
      userAgent: meta.userAgent,
      device: meta.device,
    });

    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
