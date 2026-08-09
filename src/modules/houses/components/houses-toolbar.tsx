"use client";

import { SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useHousesQuery } from "@/modules/houses/hooks/use-houses-query";
import { PAGE_SIZE_OPTIONS } from "@/modules/houses/validators/house-filter-options";
import { HousesFilters } from "@/modules/houses/components/houses-filters";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function HousesToolbar({ total, categories }: { total: number; categories: Category[] }) {
  const { searchParams, setParams } = useHousesQuery();

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{total}</span> imóveis encontrados
      </p>

      <div className="flex items-center gap-2">
        <Select
          items={PAGE_SIZE_OPTIONS}
          value={searchParams.get("pageSize") ?? "10"}
          onValueChange={(value) => setParams({ pageSize: value })}
        >
          <SelectTrigger className="w-40 min-w-0 shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {PAGE_SIZE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Sheet>
          <SheetTrigger render={<Button variant="outline" size="icon" className="lg:hidden" />}>
            <SlidersHorizontal />
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-8">
              <HousesFilters categories={categories} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
