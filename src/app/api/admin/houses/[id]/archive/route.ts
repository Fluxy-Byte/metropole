import { houseService } from "@/modules/houses/services/house.service";
import { jsonOk, handleApiError } from "@/lib/api-response";
import { requirePermission } from "@/lib/session";
import { auditService } from "@/modules/audit/services/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

export async function POST(request: Request, { params }: RouteContext<"/api/admin/houses/[id]/archive">) {
  try {
    const user = await requirePermission("HOUSES", "EDIT");
    const { id } = await params;
    const house = await houseService.archive(id);

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
      metadata: { archived: true },
    });

    return jsonOk({ house });
  } catch (error) {
    return handleApiError(error);
  }
}
