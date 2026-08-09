import { auditRepository } from "@/modules/audit/repository/audit.repository";
import type { AuditListFilters, RecordAuditInput } from "@/modules/audit/types";

export const auditService = {
  async record(input: RecordAuditInput) {
    try {
      await auditRepository.create(input);
    } catch (error) {
      // Auditing must never break the primary request flow.
      console.error("[audit] failed to record entry", error);
    }
  },

  async list(filters: AuditListFilters) {
    const result = await auditRepository.list(filters);
    return {
      ...result,
      items: result.items.map((entry) => ({
        ...entry,
        createdAt: entry.createdAt.toISOString(),
      })),
    };
  },
};
