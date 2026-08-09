import { houseMediaService } from "@/modules/houses/services/house-media.service";
import { jsonOk, jsonError, handleApiError } from "@/lib/api-response";
import { requireRole } from "@/lib/session";
import { auditService } from "@/modules/audit/services/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(request: Request, { params }: RouteContext<"/api/admin/houses/[id]/images">) {
  try {
    const user = await requireRole("ADMIN", "AGENT");
    const { id } = await params;

    const formData = await request.formData();
    const files = formData.getAll("files").filter((f): f is File => f instanceof File);

    if (files.length === 0) return jsonError("Nenhum arquivo enviado", 400);
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) return jsonError(`Arquivo ${file.name} excede 10MB`, 400);
      if (!ALLOWED_TYPES.includes(file.type)) return jsonError(`Tipo de arquivo inválido: ${file.name}`, 400);
    }

    const images = await houseMediaService.addImages(id, files);

    const meta = getRequestMeta(request);
    await auditService.record({
      actorId: user.id,
      actorEmail: user.email,
      action: "UPLOAD",
      entityType: "HouseImage",
      entityId: id,
      ip: meta.ip,
      userAgent: meta.userAgent,
      device: meta.device,
      metadata: { count: images.length },
    });

    return jsonOk({ images }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
