import { whatsappService } from "@/modules/whatsapp/services/whatsapp.service";
import { axelSearchSchema } from "@/modules/whatsapp/validators/whatsapp.validators";
import { jsonOk, handleApiError } from "@/lib/api-response";
import { guardAxelRequest } from "@/lib/axel-guard";

export async function POST(request: Request) {
  const guardResponse = await guardAxelRequest(request);
  if (guardResponse) return guardResponse;

  try {
    const body = await request.json();
    const { query, limit } = axelSearchSchema.parse(body);
    const result = await whatsappService.searchHouses(query, limit);
    return jsonOk(result);
  } catch (error) {
    return handleApiError(error);
  }
}
