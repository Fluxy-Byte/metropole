import type { NextRequest } from "next/server";
import { auditService } from "@/modules/audit/services/audit.service";
import { jsonOk, handleApiError } from "@/lib/api-response";
import { requirePermission } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    await requirePermission("AUDIT", "VIEW");
    const params = request.nextUrl.searchParams;
    const result = await auditService.list({
      page: Number(params.get("page") ?? 1),
      pageSize: Number(params.get("pageSize") ?? 20),
      action: (params.get("action") as never) ?? undefined,
      entityType: params.get("entityType") ?? undefined,
      search: params.get("search") ?? undefined,
    });
    return jsonOk(result);
  } catch (error) {
    return handleApiError(error);
  }
}
