"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/houses", label: "Imóveis" },
  { href: "/contact", label: "Contato" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const favoritesCount = useAppSelector((state) => state.favorites.houseIds.length);

  return (
    <header className="sticky top-0 z-9 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-accent",
                  active ? "text-accent" : "text-foreground/80",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            nativeButton={false}
            render={<Link href="/favorites" aria-label="Favoritos" />}
          >
            <Heart data-icon="inline-start" />
            {favoritesCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 min-w-5 justify-center rounded-full px-1 text-[10px]">
                {favoritesCount}
              </Badge>
            )}
          </Button>

          <Button
            className="hidden bg-accent text-white hover:bg-accent/90 sm:inline-flex"
            nativeButton={false}
            render={<Link href="/houses" />}
          >
            Encontrar imóvel
          </Button>

          <Sheet>
            <SheetTrigger render={<Button variant="outline" size="icon" className="md:hidden" />}>
              <Menu />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/favorites"
                  className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  Favoritos {favoritesCount > 0 ? `(${favoritesCount})` : ""}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
