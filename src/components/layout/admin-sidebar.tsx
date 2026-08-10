"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { hasPermission, type PermissionMatrix } from "@/modules/access/permissions";
import { ADMIN_NAV_ITEMS } from "@/components/layout/admin-nav-items";

export function AdminSidebar({ permissions }: { permissions: PermissionMatrix }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-background lg:flex">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {ADMIN_NAV_ITEMS.filter(
          (item) => !item.permission || hasPermission(permissions, item.permission.resource, item.permission.action),
        ).map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="size-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <button
          type="button"
          onClick={async () => {
            await authClient.signOut();
            router.push("/admin/signin");
            router.refresh();
          }}
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4.5" />
          Sair
        </button>
      </div>
    </aside>
  );
}
