import type { NextRequest } from "next/server";
import { whatsappService } from "@/modules/whatsapp/services/whatsapp.service";
import { axelHistorySchema } from "@/modules/whatsapp/validators/whatsapp.validators";
import { jsonOk, jsonError, handleApiError } from "@/lib/api-response";
import { guardAxelRequest } from "@/lib/axel-guard";

export async function GET(request: NextRequest) {
  const guardResponse = await guardAxelRequest(request);
  if (guardResponse) return guardResponse;

  try {
    const { phone } = axelHistorySchema.parse({ phone: request.nextUrl.searchParams.get("phone") });
    const history = await whatsappService.getHistory(phone);
    if (!history) return jsonError("Cliente não encontrado", 404);
    return jsonOk({ history });
  } catch (error) {
    return handleApiError(error);
  }
}
