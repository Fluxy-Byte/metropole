import { houseService } from "@/modules/houses/services/house.service";
import { jsonOk, jsonError, handleApiError } from "@/lib/api-response";

export async function GET(_request: Request, { params }: RouteContext<"/api/houses/[slug]">) {
  try {
    const { slug } = await params;
    const house = await houseService.getBySlug(slug, { trackView: true });
    if (!house) return jsonError("Imóvel não encontrado", 404);

    const similar = await houseService.similar({
      id: house.id,
      categoryId: house.category.id,
      neighborhood: house.neighborhood,
    });

    return jsonOk({ house, similar });
  } catch (error) {
    return handleApiError(error);
  }
}
