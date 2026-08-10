"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import type { AppUser } from "@/lib/session";
import { hasPermission, type PermissionMatrix } from "@/modules/access/permissions";
import { ADMIN_NAV_ITEMS } from "@/components/layout/admin-nav-items";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function AdminTopbar({
  user,
  accessTypeName,
  permissions,
}: {
  user: AppUser;
  accessTypeName: string;
  permissions: PermissionMatrix;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:px-8">
      <Sheet>
        <SheetTrigger render={<Button variant="outline" size="icon" className="lg:hidden" />}>
          <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle>
              <Logo />
            </SheetTitle>
          </SheetHeader>
          <nav className="mt-4 flex flex-col gap-1 px-4">
            {ADMIN_NAV_ITEMS.filter(
              (item) => !item.permission || hasPermission(permissions, item.permission.resource, item.permission.action),
            ).map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  <item.icon className="size-4.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium leading-none">{user.name}</p>
          <p className="text-xs text-muted-foreground">{accessTypeName}</p>
        </div>
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initials(user.name)}
          </AvatarFallback>
        </Avatar>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={async () => {
            await authClient.signOut();
            router.push("/admin/signin");
            router.refresh();
          }}
        >
          <LogOut />
        </Button>
      </div>
    </header>
  );
}
