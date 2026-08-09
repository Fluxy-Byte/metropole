"use client";

import { useState } from "react";
import useSWR from "swr";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHousesQuery } from "@/modules/houses/hooks/use-houses-query";
import { LISTING_TYPE_OPTIONS, SORT_OPTIONS } from "@/modules/houses/validators/house-filter-options";
import { MG_CITIES } from "@/lib/mg-cities";

const CITY_ITEMS = [
  { value: "all", label: "Todas as cidades" },
  ...MG_CITIES.map((city) => ({ value: city, label: city })),
];

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function HousesFilters({ categories }: { categories: Category[] }) {
  const { searchParams, setParams } = useHousesQuery();

  const currentCategories = searchParams.get("categorySlugs")?.split(",").filter(Boolean) ?? [];
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const cityParam = searchParams.get("city") ?? "";
  const neighborhoodParam = searchParams.get("neighborhood") ?? "";

  const { data: neighborhoodsData } = useSWR<{ items: string[] }>(
    cityParam ? `/houses/neighborhoods?city=${encodeURIComponent(cityParam)}` : "/houses/neighborhoods",
  );
  const neighborhoods = neighborhoodsData?.items ?? [];

  function toggleCategory(slug: string) {
    const next = currentCategories.includes(slug)
      ? currentCategories.filter((s) => s !== slug)
      : [...currentCategories, slug];
    setParams({ categorySlugs: next });
  }

  return (
    <aside className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Label className="text-sm font-semibold">Buscar</Label>
        <Input
          placeholder="Buscar por título, bairro..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") setParams({ search });
          }}
          onBlur={() => setParams({ search })}
        />
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <Label className="text-sm font-semibold">Ordenar por</Label>
        <Select
          items={SORT_OPTIONS}
          value={searchParams.get("sort") ?? "recent"}
          onValueChange={(value) => setParams({ sort: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <Label className="mb-2 text-sm font-semibold">Finalidade</Label>
        <ToggleGroup
          variant="outline"
          className="w-full"
          value={searchParams.get("listingType") ? [searchParams.get("listingType") as string] : []}
          onValueChange={(value: string[]) => setParams({ listingType: value[0] || null })}
        >
          {LISTING_TYPE_OPTIONS.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value} className="flex-1">
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <Separator />

      <div>
        <Label className="mb-3 text-sm font-semibold">Categoria</Label>
        <div className="flex flex-col gap-2.5">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={currentCategories.includes(category.slug)}
                onCheckedChange={() => toggleCategory(category.slug)}
              />
              {category.name}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <Label className="text-sm font-semibold">Localização</Label>
        <Select
          items={CITY_ITEMS}
          value={cityParam || "all"}
          onValueChange={(value) =>
            setParams({ city: value === "all" ? null : value, neighborhood: null })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Cidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {CITY_ITEMS.map((city) => (
                <SelectItem key={city.value} value={city.value}>
                  {city.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          items={[
            { value: "all", label: "Todos os bairros" },
            ...neighborhoods.map((neighborhood) => ({ value: neighborhood, label: neighborhood })),
          ]}
          value={neighborhoodParam || "all"}
          onValueChange={(value) => setParams({ neighborhood: value === "all" ? null : value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Bairro" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Todos os bairros</SelectItem>
              {neighborhoods.map((neighborhood) => (
                <SelectItem key={neighborhood} value={neighborhood}>
                  {neighborhood}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <Label className="text-sm font-semibold">Faixa de preço</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Mínimo"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={() => setParams({ minPrice })}
          />
          <Input
            type="number"
            placeholder="Máximo"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={() => setParams({ maxPrice })}
          />
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-3 gap-2">
        {(
          [
            { key: "bedrooms", label: "Quartos" },
            { key: "bathrooms", label: "Banheiros" },
            { key: "garageSpaces", label: "Vagas" },
          ] as const
        ).map((field) => (
          <div key={field.key} className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">{field.label}</Label>
            <select
              className="h-10 rounded-md border border-input bg-background px-2 text-sm"
              value={searchParams.get(field.key) ?? ""}
              onChange={(e) => setParams({ [field.key]: e.target.value || null })}
            >
              <option value="">Todos</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}+
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <Separator />

      <label className="flex items-center justify-between text-sm font-medium">
        Piscina
        <Switch
          checked={searchParams.get("hasPool") === "true"}
          onCheckedChange={(checked) => setParams({ hasPool: checked ? "true" : null })}
        />
      </label>

      <Button
        variant="ghost"
        onClick={() =>
          setParams({
            listingType: null,
            categorySlugs: null,
            city: null,
            neighborhood: null,
            minPrice: null,
            maxPrice: null,
            bedrooms: null,
            bathrooms: null,
            garageSpaces: null,
            hasPool: null,
            search: null,
            sort: null,
            pageSize: null,
          })
        }
      >
        Limpar filtros
      </Button>
    </aside>
  );
}
