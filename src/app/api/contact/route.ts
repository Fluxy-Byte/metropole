import type { NextRequest } from "next/server";
import { clientService } from "@/modules/clients/services/client.service";
import { contactRequestSchema } from "@/modules/clients/validators/client.validators";
import { jsonOk, jsonError, handleApiError } from "@/lib/api-response";
import { identifierFromRequest, rateLimit } from "@/lib/rate-limit";
import { getRequestMeta } from "@/lib/request-meta";
import { auditService } from "@/modules/audit/services/audit.service";

export async function POST(request: NextRequest) {
  try {
    const { success } = await rateLimit(identifierFromRequest(request, "contact"), 10, 60);
    if (!success) return jsonError("Muitas tentativas. Tente novamente em instantes.", 429);

    const body = await request.json();
    const input = contactRequestSchema.parse(body);
    const client = await clientService.submitContactRequest(input);

    const meta = getRequestMeta(request);
    await auditService.record({
      action: "CREATE",
      entityType: "Client",
      entityId: client.id,
      ip: meta.ip,
      userAgent: meta.userAgent,
      device: meta.device,
      metadata: { source: "contact-form" },
    });

    return jsonOk({ client: { id: client.id, name: client.name } }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
