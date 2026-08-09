import { categoryService } from "@/modules/houses/services/category.service";
import { jsonOk, handleApiError } from "@/lib/api-response";

export async function GET() {
  try {
    const categories = await categoryService.list();
    return jsonOk({ items: categories });
  } catch (error) {
    return handleApiError(error);
  }
}
