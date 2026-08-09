import {
  LayoutDashboard,
  Building2 as HouseIcon,
  Users,
  ScrollText,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  adminOnly?: boolean;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/houses", label: "Imóveis", icon: HouseIcon },
  { href: "/admin/clients", label: "Clientes", icon: Users },
  { href: "/admin/audit", label: "Auditoria", icon: ScrollText, adminOnly: true },
];
