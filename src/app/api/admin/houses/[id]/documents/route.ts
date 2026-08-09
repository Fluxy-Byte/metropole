import { houseMediaService } from "@/modules/houses/services/house-media.service";
import { jsonOk, jsonError, handleApiError } from "@/lib/api-response";
import { requireRole } from "@/lib/session";
import { auditService } from "@/modules/audit/services/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

export async function POST(request: Request, { params }: RouteContext<"/api/admin/houses/[id]/documents">) {
  try {
    const user = await requireRole("ADMIN", "AGENT");
    const { id } = await params;

    const formData = await request.formData();
    const files = formData.getAll("files").filter((f): f is File => f instanceof File);

    if (files.length === 0) return jsonError("Nenhum arquivo enviado", 400);
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) return jsonError(`Arquivo ${file.name} excede 20MB`, 400);
    }

    const documents = await houseMediaService.addDocuments(id, files);

    const meta = getRequestMeta(request);
    await auditService.record({
      actorId: user.id,
      actorEmail: user.email,
      action: "UPLOAD",
      entityType: "HouseDocument",
      entityId: id,
      ip: meta.ip,
      userAgent: meta.userAgent,
      device: meta.device,
      metadata: { count: documents.length },
    });

    return jsonOk({ documents }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
