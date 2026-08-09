"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { http } from "@/lib/http";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearFavorites, markMigrated } from "@/store/slices/favorites-slice";

const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo"),
  phone: z
    .string()
    .trim()
    .min(8, "Informe um telefone válido")
    .regex(/^[0-9()+\-\s]+$/, "Telefone inválido"),
  hasWhatsapp: z.boolean(),
  email: z.email("E-mail inválido").optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((state) => state.favorites.houseIds);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", phone: "", hasWhatsapp: true, email: "", notes: "" },
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      await http.post("/contact", { ...values, favoriteHouseIds: favoriteIds });
      dispatch(markMigrated());
      dispatch(clearFavorites());
      setSubmitted(true);
    } catch {
      toast.error("Não foi possível enviar sua solicitação. Tente novamente.");
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border p-10 text-center">
        <CheckCircle2 className="size-10 text-accent" />
        <h2 className="font-heading text-xl font-semibold">Recebemos sua solicitação!</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Um de nossos consultores entrará em contato em breve pelo telefone informado.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Nome</FieldLabel>
          <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.phone}>
          <FieldLabel htmlFor="phone">Telefone</FieldLabel>
          <Input
            id="phone"
            placeholder="(34) 99999-0000"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
          {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
        </Field>

        <Field orientation="horizontal">
          <Checkbox
            id="hasWhatsapp"
            checked={watch("hasWhatsapp")}
            onCheckedChange={(checked) => setValue("hasWhatsapp", checked === true)}
          />
          <FieldLabel htmlFor="hasWhatsapp" className="font-normal">
            Este número possui WhatsApp
          </FieldLabel>
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">E-mail (opcional)</FieldLabel>
          <Input id="email" type="email" aria-invalid={!!errors.email} {...register("email")} />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="notes">Observação (opcional)</FieldLabel>
          <Textarea id="notes" rows={4} {...register("notes")} />
        </Field>

        {favoriteIds.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {favoriteIds.length} imóvel(is) favoritado(s) serão vinculados ao seu contato.
          </p>
        )}

        <Button type="submit" size="lg" className="h-10" disabled={isSubmitting}>
          {isSubmitting && <Loader2 data-icon="inline-start" className="animate-spin" />}
          Solicitar atendimento
        </Button>
      </FieldGroup>
    </form>
  );
}
