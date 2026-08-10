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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { http } from "@/lib/http";
import { permissionsSchema } from "@/modules/access/validators/access-type.validators";
import {
  PERMISSION_RESOURCES,
  RESOURCE_ACTIONS,
  RESOURCE_LABELS,
  ACTION_LABELS,
  type PermissionMatrix,
} from "@/modules/access/permissions";
import type { AccessTypeDto } from "@/modules/access/types";

const accessTypeFormSchema = z.object({
  name: z.string().trim().min(2, "Informe um nome").max(80),
  description: z.string().trim().optional(),
  permissions: permissionsSchema,
});

type AccessTypeFormValues = z.infer<typeof accessTypeFormSchema>;

function buildDefaultPermissions(accessType?: AccessTypeDto): PermissionMatrix {
  const result: PermissionMatrix = {};
  for (const resource of PERMISSION_RESOURCES) {
    result[resource] = {};
    for (const action of RESOURCE_ACTIONS[resource]) {
      result[resource]![action] = accessType?.permissions?.[resource]?.[action] === true;
    }
  }
  return result;
}

export function AccessTypeForm({
  mode,
  accessType,
}: {
  mode: "create" | "edit";
  accessType?: AccessTypeDto;
}) {
  const router = useRouter();
  const readOnly = mode === "edit" && !!accessType?.isSystem;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AccessTypeFormValues>({
    resolver: zodResolver(accessTypeFormSchema),
    defaultValues: {
      name: accessType?.name ?? "",
      description: accessType?.description ?? "",
      permissions: buildDefaultPermissions(accessType),
    },
  });

  const onSubmit = async (values: AccessTypeFormValues) => {
    try {
      if (mode === "create") {
        await http.post("/admin/access-types", values);
        toast.success("Tipo de acesso criado com sucesso");
      } else if (accessType) {
        await http.patch(`/admin/access-types/${accessType.id}`, values);
        toast.success("Tipo de acesso atualizado");
      }
      router.push("/admin/access-types");
      router.refresh();
    } catch {
      toast.error("Não foi possível salvar o tipo de acesso");
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
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Nome</FieldLabel>
              <Input id="name" disabled={readOnly} {...register("name")} />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Descrição (opcional)</FieldLabel>
              <Textarea id="description" rows={2} disabled={readOnly} {...register("description")} />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Permissões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col divide-y divide-border">
            {PERMISSION_RESOURCES.map((resource) => (
              <div key={resource} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
                <p className="text-sm font-medium text-foreground">{RESOURCE_LABELS[resource]}</p>
                <div className="flex flex-wrap gap-6">
                  {RESOURCE_ACTIONS[resource].map((action) => (
                    <Controller
                      key={action}
                      control={control}
                      name={`permissions.${resource}.${action}`}
                      render={({ field }) => (
                        <label className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Checkbox
                            checked={field.value === true}
                            onCheckedChange={field.onChange}
                            disabled={readOnly}
                          />
                          {ACTION_LABELS[action]}
                        </label>
                      )}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {!readOnly && (
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting && <Loader2 data-icon="inline-start" className="animate-spin" />}
            {mode === "create" ? "Criar tipo de acesso" : "Salvar alterações"}
          </Button>
        </div>
      )}
    </form>
  );
}
