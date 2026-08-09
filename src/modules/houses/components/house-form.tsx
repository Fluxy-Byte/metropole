"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { http } from "@/lib/http";
import { LISTING_TYPE_OPTIONS } from "@/modules/houses/validators/house-filter-options";
import type { HouseDetailDto } from "@/modules/houses/types";

interface Category {
  id: string;
  name: string;
}

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Rascunho" },
  { value: "PUBLISHED", label: "Publicado" },
  { value: "ARCHIVED", label: "Arquivado" },
  { value: "SOLD", label: "Vendido" },
  { value: "RENTED", label: "Alugado" },
] as const;

const houseFormSchema = z.object({
  title: z.string().trim().min(3, "Informe um título"),
  description: z.string().trim().min(10, "Descreva o imóvel com mais detalhes"),
  price: z.coerce.number().positive("Informe um valor válido"),
  listingType: z.enum(["SALE", "RENT"]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "SOLD", "RENTED"]),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  address: z.string().trim().min(3, "Informe o endereço"),
  neighborhood: z.string().trim().min(1, "Informe o bairro"),
  city: z.string().trim().min(1),
  state: z.string().trim().length(2, "UF com 2 letras"),
  zipCode: z.string().trim().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  builtArea: z.coerce.number().nonnegative(),
  totalArea: z.coerce.number().nonnegative(),
  bedrooms: z.coerce.number().int().nonnegative(),
  bathrooms: z.coerce.number().int().nonnegative(),
  garageSpaces: z.coerce.number().int().nonnegative(),
  hasPool: z.boolean(),
  hasBarbecue: z.boolean(),
  condoFee: z.coerce.number().nonnegative().optional(),
  iptu: z.coerce.number().nonnegative().optional(),
  videoUrl: z.string().trim().optional(),
  tagsText: z.string().trim().optional(),
});

type HouseFormValues = z.output<typeof houseFormSchema>;
type HouseFormInput = z.input<typeof houseFormSchema>;

function toDefaultValues(house?: HouseDetailDto): HouseFormInput {
  if (!house) {
    return {
      title: "",
      description: "",
      price: 0,
      listingType: "SALE",
      status: "DRAFT",
      categoryId: "",
      address: "",
      neighborhood: "",
      city: "Uberlândia",
      state: "MG",
      zipCode: "",
      latitude: undefined,
      longitude: undefined,
      builtArea: 0,
      totalArea: 0,
      bedrooms: 0,
      bathrooms: 0,
      garageSpaces: 0,
      hasPool: false,
      hasBarbecue: false,
      condoFee: undefined,
      iptu: undefined,
      videoUrl: "",
      tagsText: "",
    };
  }

  return {
    title: house.title,
    description: house.description,
    price: house.price,
    listingType: house.listingType as "SALE" | "RENT",
    status: house.status as HouseFormValues["status"],
    categoryId: house.category.id,
    address: house.address,
    neighborhood: house.neighborhood,
    city: house.city,
    state: house.state,
    zipCode: house.zipCode ?? "",
    latitude: house.latitude ?? undefined,
    longitude: house.longitude ?? undefined,
    builtArea: house.builtArea,
    totalArea: house.totalArea,
    bedrooms: house.bedrooms,
    bathrooms: house.bathrooms,
    garageSpaces: house.garageSpaces,
    hasPool: house.hasPool,
    hasBarbecue: house.hasBarbecue,
    condoFee: house.condoFee ?? undefined,
    iptu: house.iptu ?? undefined,
    videoUrl: house.videoUrl ?? "",
    tagsText: house.tags.join(", "),
  };
}

export function HouseForm({
  mode,
  house,
  categories,
}: {
  mode: "create" | "edit";
  house?: HouseDetailDto;
  categories: Category[];
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<HouseFormInput, unknown, HouseFormValues>({
    resolver: zodResolver(houseFormSchema),
    defaultValues: toDefaultValues(house),
  });

  const onSubmit = async (values: HouseFormValues) => {
    const payload = {
      ...values,
      tags: values.tagsText
        ? values.tagsText.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    };
    delete (payload as Partial<typeof payload>).tagsText;

    try {
      if (mode === "create") {
        const res = await http.post<{ house: HouseDetailDto }>("/admin/houses", payload);
        toast.success("Imóvel criado com sucesso");
        router.push(`/admin/houses/${res.data.house.id}`);
        router.refresh();
      } else if (house) {
        await http.patch(`/admin/houses/${house.id}`, payload);
        toast.success("Imóvel atualizado");
        router.refresh();
      }
    } catch {
      toast.error("Não foi possível salvar o imóvel");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={!!errors.title}>
              <FieldLabel htmlFor="title">Nome</FieldLabel>
              <Input id="title" {...register("title")} />
              {errors.title && <FieldError>{errors.title.message}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="description">Descrição</FieldLabel>
              <Textarea id="description" rows={5} {...register("description")} />
              {errors.description && <FieldError>{errors.description.message}</FieldError>}
            </Field>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field data-invalid={!!errors.price}>
                <FieldLabel htmlFor="price">Valor (R$)</FieldLabel>
                <Input id="price" type="number" step="0.01" {...register("price")} />
                {errors.price && <FieldError>{errors.price.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel>Finalidade</FieldLabel>
                <Controller
                  control={control}
                  name="listingType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {LISTING_TYPE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field>
                <FieldLabel>Status</FieldLabel>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </div>

            <Field data-invalid={!!errors.categoryId}>
              <FieldLabel>Categoria</FieldLabel>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && <FieldError>{errors.categoryId.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="tagsText">Tags (separadas por vírgula)</FieldLabel>
              <Input id="tagsText" placeholder="piscina, lazer, novo" {...register("tagsText")} />
            </Field>

            <Field>
              <FieldLabel htmlFor="videoUrl">Vídeo (URL de incorporação)</FieldLabel>
              <Input id="videoUrl" placeholder="https://www.youtube.com/embed/..." {...register("videoUrl")} />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Endereço e localização</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={!!errors.address}>
              <FieldLabel htmlFor="address">Endereço</FieldLabel>
              <Input id="address" {...register("address")} />
              {errors.address && <FieldError>{errors.address.message}</FieldError>}
            </Field>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field data-invalid={!!errors.neighborhood}>
                <FieldLabel htmlFor="neighborhood">Bairro</FieldLabel>
                <Input id="neighborhood" {...register("neighborhood")} />
                {errors.neighborhood && <FieldError>{errors.neighborhood.message}</FieldError>}
              </Field>
              <Field>
                <FieldLabel htmlFor="city">Cidade</FieldLabel>
                <Input id="city" {...register("city")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="state">UF</FieldLabel>
                <Input id="state" maxLength={2} {...register("state")} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="zipCode">CEP</FieldLabel>
                <Input id="zipCode" {...register("zipCode")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="latitude">Latitude</FieldLabel>
                <Input id="latitude" type="number" step="any" {...register("latitude")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="longitude">Longitude</FieldLabel>
                <Input id="longitude" type="number" step="any" {...register("longitude")} />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Características</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field>
                <FieldLabel htmlFor="builtArea">Área construída (m²)</FieldLabel>
                <Input id="builtArea" type="number" step="0.01" {...register("builtArea")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="totalArea">Área total (m²)</FieldLabel>
                <Input id="totalArea" type="number" step="0.01" {...register("totalArea")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="bedrooms">Quartos</FieldLabel>
                <Input id="bedrooms" type="number" {...register("bedrooms")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="bathrooms">Banheiros</FieldLabel>
                <Input id="bathrooms" type="number" {...register("bathrooms")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="garageSpaces">Vagas de garagem</FieldLabel>
                <Input id="garageSpaces" type="number" {...register("garageSpaces")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="condoFee">Condomínio (R$)</FieldLabel>
                <Input id="condoFee" type="number" step="0.01" {...register("condoFee")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="iptu">IPTU (R$)</FieldLabel>
                <Input id="iptu" type="number" step="0.01" {...register("iptu")} />
              </Field>
            </div>

            <div className="flex flex-wrap gap-8">
              <Controller
                control={control}
                name="hasPool"
                render={({ field }) => (
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                    Piscina
                  </label>
                )}
              />
              <Controller
                control={control}
                name="hasBarbecue"
                render={({ field }) => (
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                    Churrasqueira
                  </label>
                )}
              />
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 data-icon="inline-start" className="animate-spin" />}
          {mode === "create" ? "Criar imóvel" : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
