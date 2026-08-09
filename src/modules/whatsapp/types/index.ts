import type { HouseFilterInput } from "@/modules/houses/validators/house.validators";
import type { HouseListItemDto, PaginatedResult } from "@/modules/houses/types";

export interface AxelSearchResponse extends PaginatedResult<HouseListItemDto> {
  interpretedFilters: Partial<HouseFilterInput>;
}
