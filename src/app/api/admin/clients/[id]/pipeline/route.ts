import { clientService } from "@/modules/clients/services/client.service";
import { updatePipelineSchema } from "@/modules/clients/validators/client.validators";
import { jsonOk, jsonError, handleApiError } from "@/lib/api-response";
import { requirePermission } from "@/lib/session";
import { auditService } from "@/modules/audit/services/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/clients/[id]/pipeline">) {
  try {
    const user = await requirePermission("CLIENTS", "EDIT");
    const { id } = await params;
    const body = await request.json();
    const input = updatePipelineSchema.parse(body);

    const client = await clientService.updatePipeline(id, input);
    if (!client) return jsonError("Cliente não encontrado", 404);

    const meta = getRequestMeta(request);
    await auditService.record({
      actorId: user.id,
      actorEmail: user.email,
      action: "UPDATE",
      entityType: "Client",
      entityId: id,
      ip: meta.ip,
      userAgent: meta.userAgent,
      device: meta.device,
      metadata: { pipelineStage: input.pipelineStage, outcome: input.outcome ?? null },
    });

    return jsonOk({ client });
  } catch (error) {
    return handleApiError(error);
  }
}
