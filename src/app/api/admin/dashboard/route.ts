import { dashboardService } from "@/modules/dashboard/services/dashboard.service";
import { jsonOk, handleApiError } from "@/lib/api-response";
import { requireRole } from "@/lib/session";

export async function GET() {
  try {
    await requireRole("ADMIN", "AGENT");
    const summary = await dashboardService.getSummary();
    return jsonOk(summary);
  } catch (error) {
    return handleApiError(error);
  }
}
