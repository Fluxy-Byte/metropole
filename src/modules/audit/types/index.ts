import type { AuditAction } from "@/generated/prisma/enums";

export interface RecordAuditInput {
  actorId?: string | null;
  actorEmail?: string | null;
  action: AuditAction;
  entityType: string;
  entityId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  device?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface AuditListFilters {
  page?: number;
  pageSize?: number;
  action?: AuditAction;
  entityType?: string;
  actorId?: string;
  search?: string;
}
