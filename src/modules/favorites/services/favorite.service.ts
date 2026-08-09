import { houseService } from "@/modules/houses/services/house.service";

export const favoriteService = {
  async resolveHouses(ids: string[]) {
    return houseService.getManyByIds(ids);
  },
};
