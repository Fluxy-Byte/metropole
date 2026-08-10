"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
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
import type { AccessTypeDto, UserListItemDto } from "@/modules/access/types";

function buildUserFormSchema(mode: "create" | "edit") {
  return z.object({
    name: z.string().trim().min(2, "Informe o nome completo"),
    email: z.string().trim().optional(),
    cpf: z.string().trim().optional(),
    accessTypeId: z.string().min(1, "Selecione um tipo de acesso"),
    password: z.string().optional(),
  }).superRefine((data, ctx) => {
    if (mode !== "create") return;
    if (!data.email || !z.email().safeParse(data.email).success) {
      ctx.addIssue({ code: "custom", path: ["email"], message: "E-mail inválido" });
    }
    if (!data.password || data.password.length < 8) {
      ctx.addIssue({ code: "custom", path: ["password"], message: "A senha deve ter no mínimo 8 caracteres" });
    }
  });
}

type UserFormValues = z.infer<ReturnType<typeof buildUserFormSchema>>;

export function UserForm({
  mode,
  user,
  accessTypes,
}: {
  mode: "create" | "edit";
  user?: UserListItemDto;
  accessTypes: AccessTypeDto[];
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(buildUserFormSchema(mode)),
    defaultValues: {
      name: user?.name ?? "",
      email: "",
      cpf: user?.cpf ?? "",
      accessTypeId: user?.accessType.id ?? "",
      password: "",
    },
  });

  const onSubmit = async (values: UserFormValues) => {
    try {
      if (mode === "create") {
        await http.post("/admin/users", {
          name: values.name,
          email: values.email,
          cpf: values.cpf || undefined,
          accessTypeId: values.accessTypeId,
          password: values.password,
        });
        toast.success("Acesso criado com sucesso");
        router.push("/admin/users");
        router.refresh();
      } else if (user) {
        await http.patch(`/admin/users/${user.id}`, {
          name: values.name,
          cpf: values.cpf || undefined,
          accessTypeId: values.accessTypeId,
        });
        toast.success("Acesso atualizado");
        router.push("/admin/users");
        router.refresh();
      }
    } catch {
      toast.error("Não foi possível salvar o acesso");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === "create" ? "Novo acesso" : "Dados do acesso"}</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Nome</FieldLabel>
              <Input id="name" {...register("name")} />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            {mode === "create" && (
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
              </Field>
            )}

            <Field data-invalid={!!errors.cpf}>
              <FieldLabel htmlFor="cpf">CPF (opcional)</FieldLabel>
              <Input id="cpf" placeholder="000.000.000-00" {...register("cpf")} />
              {errors.cpf && <FieldError>{errors.cpf.message}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.accessTypeId}>
              <FieldLabel>Tipo de acesso</FieldLabel>
              <Controller
                control={control}
                name="accessTypeId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de acesso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {accessTypes.map((accessType) => (
                          <SelectItem key={accessType.id} value={accessType.id}>
                            {accessType.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.accessTypeId && <FieldError>{errors.accessTypeId.message}</FieldError>}
            </Field>

            {mode === "create" && (
              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <PasswordInput id="password" {...register("password")} />
                {errors.password && <FieldError>{errors.password.message}</FieldError>}
              </Field>
            )}
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 data-icon="inline-start" className="animate-spin" />}
          {mode === "create" ? "Criar acesso" : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
