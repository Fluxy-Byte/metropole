import { categoryRepository } from "@/modules/houses/repository/category.repository";
import { CACHE_KEYS, cacheDel, cacheWrap } from "@/lib/redis";

export const categoryService = {
  async list() {
    return cacheWrap(CACHE_KEYS.categories, 60 * 60, () => categoryRepository.findAll());
  },

  async invalidate() {
    await cacheDel(CACHE_KEYS.categories);
  },
};
