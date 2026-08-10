export const PERMISSION_RESOURCES = ["HOUSES", "CLIENTS", "AUDIT", "ACCESS"] as const;
export type PermissionResource = (typeof PERMISSION_RESOURCES)[number];

export const PERMISSION_ACTIONS = ["VIEW", "CREATE", "EDIT", "DELETE", "MANAGE"] as const;
export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

export const RESOURCE_ACTIONS: Record<PermissionResource, PermissionAction[]> = {
  HOUSES: ["VIEW", "CREATE", "EDIT", "DELETE"],
  CLIENTS: ["VIEW"],
  AUDIT: ["VIEW"],
  ACCESS: ["MANAGE"],
};

export const RESOURCE_LABELS: Record<PermissionResource, string> = {
  HOUSES: "Imóveis",
  CLIENTS: "Clientes",
  AUDIT: "Auditoria",
  ACCESS: "Acessos",
};

export const ACTION_LABELS: Record<PermissionAction, string> = {
  VIEW: "Ver",
  CREATE: "Criar",
  EDIT: "Editar",
  DELETE: "Excluir",
  MANAGE: "Gerenciar",
};

export type PermissionMatrix = Partial<Record<PermissionResource, Partial<Record<PermissionAction, boolean>>>>;

export function hasPermission(
  matrix: PermissionMatrix | null | undefined,
  resource: PermissionResource,
  action: PermissionAction,
): boolean {
  return matrix?.[resource]?.[action] === true;
}
