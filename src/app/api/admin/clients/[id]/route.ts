import { clientService } from "@/modules/clients/services/client.service";
import { jsonOk, jsonError, handleApiError } from "@/lib/api-response";
import { requirePermission } from "@/lib/session";
import { auditService } from "@/modules/audit/services/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

export async function GET(request: Request, { params }: RouteContext<"/api/admin/clients/[id]">) {
  try {
    const user = await requirePermission("CLIENTS", "VIEW");
    const { id } = await params;
    const client = await clientService.getById(id);
    if (!client) return jsonError("Cliente não encontrado", 404);

    const meta = getRequestMeta(request);
    await auditService.record({
      actorId: user.id,
      actorEmail: user.email,
      action: "VIEW",
      entityType: "Client",
      entityId: id,
      ip: meta.ip,
      userAgent: meta.userAgent,
      device: meta.device,
    });

    return jsonOk({ client });
  } catch (error) {
    return handleApiError(error);
  }
}
