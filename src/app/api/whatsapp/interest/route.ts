import { whatsappService } from "@/modules/whatsapp/services/whatsapp.service";
import { axelInterestSchema } from "@/modules/whatsapp/validators/whatsapp.validators";
import { jsonOk, handleApiError } from "@/lib/api-response";
import { guardAxelRequest } from "@/lib/axel-guard";

export async function POST(request: Request) {
  const guardResponse = await guardAxelRequest(request);
  if (guardResponse) return guardResponse;

  try {
    const body = await request.json();
    const { phone, name, houseId, notes } = axelInterestSchema.parse(body);
    const interest = await whatsappService.addInterest(phone, name, houseId, notes);
    return jsonOk({ interest }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
