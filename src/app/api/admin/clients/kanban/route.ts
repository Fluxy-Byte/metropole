import { clientService } from "@/modules/clients/services/client.service";
import { jsonOk, handleApiError } from "@/lib/api-response";
import { requirePermission } from "@/lib/session";

export async function GET() {
  try {
    await requirePermission("CLIENTS", "VIEW");
    const items = await clientService.listForKanban();
    return jsonOk({ items });
  } catch (error) {
    return handleApiError(error);
  }
}
