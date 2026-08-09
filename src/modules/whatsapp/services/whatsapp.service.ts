import { houseService } from "@/modules/houses/services/house.service";
import { houseFilterSchema } from "@/modules/houses/validators/house.validators";
import { clientService } from "@/modules/clients/services/client.service";
import { clientRepository } from "@/modules/clients/repository/client.repository";
import { parseNaturalLanguageQuery } from "@/modules/whatsapp/services/query-parser";
import type { UpdateMetadataInput } from "@/modules/clients/validators/client.validators";

export const whatsappService = {
  async searchHouses(query: string, limit: number) {
    const parsed = parseNaturalLanguageQuery(query);
    const filters = houseFilterSchema.parse({
      ...parsed,
      pageSize: limit,
      page: 1,
    });
    const result = await houseService.listPublic(filters);
    return { interpretedFilters: parsed, ...result };
  },

  async updateClientMetadata(phone: string, name: string | undefined, input: UpdateMetadataInput) {
    const client = await clientService.findOrCreateByPhone(phone, name);
    return clientService.updateMetadata(client.id, input);
  },

  async addInterest(phone: string, name: string | undefined, houseId: string, notes?: string) {
    const client = await clientService.findOrCreateByPhone(phone, name);
    await clientRepository.logActivity(client.id, "HOUSE_SENT", { houseId });
    return clientService.addInterest(client.id, houseId, notes);
  },

  async getHistory(phone: string) {
    const client = await clientRepository.findByPhone(phone);
    if (!client) return null;
    return clientService.getById(client.id);
  },
};
