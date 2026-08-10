import { dashboardService } from "@/modules/dashboard/services/dashboard.service";
import { jsonOk, handleApiError } from "@/lib/api-response";
import { requireUser } from "@/lib/session";

export async function GET() {
  try {
    await requireUser();
    const summary = await dashboardService.getSummary();
    return jsonOk(summary);
  } catch (error) {
    return handleApiError(error);
  }
}
