import { isValidAxelRequest } from "@/lib/api-key";
import { identifierFromRequest, rateLimit } from "@/lib/rate-limit";
import { jsonError } from "@/lib/api-response";

export async function guardAxelRequest(request: Request) {
  if (!isValidAxelRequest(request)) {
    return jsonError("Não autorizado", 401);
  }
  const { success } = await rateLimit(identifierFromRequest(request, "axel"), 60, 60);
  if (!success) {
    return jsonError("Limite de requisições excedido", 429);
  }
  return null;
}
