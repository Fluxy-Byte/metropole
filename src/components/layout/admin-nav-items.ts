import {
  LayoutDashboard,
  Building2 as HouseIcon,
  Users,
  ScrollText,
  KeyRound,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { PermissionAction, PermissionResource } from "@/modules/access/permissions";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  permission?: { resource: PermissionResource; action: PermissionAction };
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/houses", label: "Imóveis", icon: HouseIcon, permission: { resource: "HOUSES", action: "VIEW" } },
  { href: "/admin/clients", label: "Clientes", icon: Users, permission: { resource: "CLIENTS", action: "VIEW" } },
  { href: "/admin/audit", label: "Auditoria", icon: ScrollText, permission: { resource: "AUDIT", action: "VIEW" } },
  { href: "/admin/users", label: "Acessos", icon: KeyRound, permission: { resource: "ACCESS", action: "MANAGE" } },
  {
    href: "/admin/access-types",
    label: "Tipos de Acesso",
    icon: ShieldCheck,
    permission: { resource: "ACCESS", action: "MANAGE" },
  },
];
