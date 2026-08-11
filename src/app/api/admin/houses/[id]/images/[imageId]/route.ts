import { houseMediaService } from "@/modules/houses/services/house-media.service";
import { jsonOk, jsonError, handleApiError } from "@/lib/api-response";
import { requirePermission } from "@/lib/session";
import { auditService } from "@/modules/audit/services/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

export async function PATCH(
  request: Request,
  { params }: RouteContext<"/api/admin/houses/[id]/images/[imageId]">,
) {
  try {
    const user = await requirePermission("HOUSES", "EDIT");
    const { id, imageId } = await params;
    const image = await houseMediaService.setCoverImage(id, imageId);
    if (!image) return jsonError("Imagem não encontrada", 404);

    const meta = getRequestMeta(request);
    await auditService.record({
      actorId: user.id,
      actorEmail: user.email,
      action: "UPDATE",
      entityType: "HouseImage",
      entityId: imageId,
      ip: meta.ip,
      userAgent: meta.userAgent,
      device: meta.device,
      metadata: { isCover: true },
    });

    return jsonOk({ image });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext<"/api/admin/houses/[id]/images/[imageId]">,
) {
  try {
    const user = await requirePermission("HOUSES", "EDIT");
    const { id, imageId } = await params;
    const image = await houseMediaService.removeImage(id, imageId);
    if (!image) return jsonError("Imagem não encontrada", 404);

    const meta = getRequestMeta(request);
    await auditService.record({
      actorId: user.id,
      actorEmail: user.email,
      action: "DELETE",
      entityType: "HouseImage",
      entityId: imageId,
      ip: meta.ip,
      userAgent: meta.userAgent,
      device: meta.device,
    });

    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
