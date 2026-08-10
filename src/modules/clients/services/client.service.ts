import type { Prisma } from "@/generated/prisma/client";
import { clientRepository } from "@/modules/clients/repository/client.repository";
import { toClientDetailDto, toClientListItemDto } from "@/modules/clients/dto/client.dto";
import type { ContactRequestInput, UpdateMetadataInput, UpdatePipelineInput } from "@/modules/clients/validators/client.validators";
import type { ClientDetailDto, ClientListItemDto } from "@/modules/clients/types";
import type { ClientFilterInput } from "@/modules/clients/validators/client.validators";
import { CACHE_KEYS, cacheDelByPrefix, cacheWrap } from "@/lib/redis";
import { sanitizeOptionalText, sanitizeText } from "@/lib/sanitize";
import { triggerWelcomeCampaign } from "@/lib/fluxy-agents";
import { createHash } from "crypto";
import type { PaginatedResult } from "@/modules/houses/types";

function hash(input: unknown) {
  return createHash("sha1").update(JSON.stringify(input)).digest("hex");
}

async function invalidateClientCaches(id?: string) {
  await cacheDelByPrefix(CACHE_KEYS.clientsListPrefix);
  await cacheDelByPrefix(CACHE_KEYS.dashboardPrefix);
  if (id) await cacheDelByPrefix(`${CACHE_KEYS.clientDetailPrefix}${id}`);
}

export const clientService = {
  async list(filters: ClientFilterInput): Promise<PaginatedResult<ClientListItemDto>> {
    const cacheKey = CACHE_KEYS.clientsList(hash(filters));
    return cacheWrap(cacheKey, 60, async () => {
      const { items, total } = await clientRepository.findMany(filters);
      return {
        items: items.map(toClientListItemDto),
        total,
        page: filters.page,
        pageSize: filters.pageSize,
        totalPages: Math.max(1, Math.ceil(total / filters.pageSize)),
      };
    });
  },

  /// Todos os clientes pros cards do Kanban de leads (/admin/clients) — sem
  /// paginação nem cache (o board precisa refletir o estado atual assim que
  /// um card é movido).
  async listForKanban(): Promise<ClientListItemDto[]> {
    const items = await clientRepository.findAllForKanban();
    return items.map(toClientListItemDto);
  },

  /// Move um lead entre as esteiras do Kanban. outcome só é aceito (e exigido
  /// pelo validator) quando o destino é DONE — sair de DONE sempre limpa o
  /// outcome, mesmo que o caller tenha mandado algo.
  async updatePipeline(id: string, input: UpdatePipelineInput): Promise<ClientListItemDto | null> {
    const existing = await clientRepository.findById(id);
    if (!existing) return null;

    const outcome = input.pipelineStage === "DONE" ? (input.outcome ?? null) : null;

    const updated = await clientRepository.update(id, {
      pipelineStage: input.pipelineStage,
      outcome,
    });
    await clientRepository.logActivity(id, "PIPELINE_UPDATE", { pipelineStage: input.pipelineStage, outcome });
    await invalidateClientCaches(id);
    return toClientListItemDto({ ...updated, _count: { interests: existing.interests?.length ?? 0 } });
  },

  async getById(id: string): Promise<ClientDetailDto | null> {
    const cacheKey = CACHE_KEYS.clientDetail(id);
    return cacheWrap(cacheKey, 60, async () => {
      const client = await clientRepository.findById(id);
      return client ? toClientDetailDto(client) : null;
    });
  },

  /**
   * Handles the /contact flow end-to-end: creates or updates the client
   * record by phone, migrates any locally-favorited houses into DB
   * Favorite rows, and creates an Interest for each of them.
   */
  async submitContactRequest(input: ContactRequestInput) {
    const name = sanitizeText(input.name);
    const notes = sanitizeOptionalText(input.notes);
    const email = input.email ? sanitizeText(input.email) : null;

    let client = await clientRepository.findByPhone(input.phone);
    const isNewClient = !client;

    if (client) {
      client = await clientRepository.update(client.id, {
        name,
        hasWhatsapp: input.hasWhatsapp,
        email: email || client.email,
        notes: notes ?? client.notes,
      });
    } else {
      client = await clientRepository.create({
        name,
        phone: input.phone,
        hasWhatsapp: input.hasWhatsapp,
        email,
        notes,
      });
    }

    if (isNewClient && input.hasWhatsapp) {
      void triggerWelcomeCampaign(input.phone, name);
    }

    if (input.favoriteHouseIds.length > 0) {
      await clientRepository.addFavorites(client.id, input.favoriteHouseIds);
      await Promise.all(
        input.favoriteHouseIds.map((houseId) =>
          clientRepository.upsertInterest(client!.id, houseId, "SITE"),
        ),
      );
    }

    await clientRepository.logActivity(client.id, "CONTACT_REQUEST", {
      favoritesCount: input.favoriteHouseIds.length,
    });

    await invalidateClientCaches(client.id);
    return client;
  },

  async findOrCreateByPhone(phone: string, name?: string) {
    const existing = await clientRepository.findByPhone(phone);
    if (existing) return existing;
    return clientRepository.create({
      name: name ? sanitizeText(name) : "Contato WhatsApp",
      phone,
      hasWhatsapp: true,
    });
  },

  async updateMetadata(clientId: string, input: UpdateMetadataInput) {
    const metadata = await clientRepository.upsertMetadata(clientId, {
      ...input,
      preferences: input.preferences as Prisma.InputJsonValue | undefined,
      lastContactAt: new Date(),
    });
    await clientRepository.logActivity(clientId, "METADATA_UPDATE", input);
    await invalidateClientCaches(clientId);
    return metadata;
  },

  async addInterest(clientId: string, houseId: string, notes?: string) {
    const interest = await clientRepository.upsertInterest(clientId, houseId, "WHATSAPP", notes);
    await clientRepository.logActivity(clientId, "INTEREST_ADDED", { houseId });
    await invalidateClientCaches(clientId);
    return interest;
  },
};
