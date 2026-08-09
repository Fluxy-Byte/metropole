"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authClient } from "@/lib/auth-client";

const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "Informe seu nome completo"),
    cpf: z
      .string()
      .trim()
      .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "CPF inválido"),
    email: z.email("E-mail inválido"),
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) });

  const onSubmit = async (values: SignUpValues) => {
    setServerError(null);
    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      cpf: values.cpf,
    });

    if (error) {
      setServerError(error.message ?? "Não foi possível criar sua conta.");
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div>
      <h1 className="text-center font-heading text-2xl font-bold text-primary">
        Criar conta administrativa
      </h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        Cadastre-se para gerenciar imóveis e clientes
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
        <FieldGroup>
          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">Nome</FieldLabel>
            <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.cpf}>
            <FieldLabel htmlFor="cpf">CPF</FieldLabel>
            <Input id="cpf" placeholder="000.000.000-00" aria-invalid={!!errors.cpf} {...register("cpf")} />
            {errors.cpf && <FieldError>{errors.cpf.message}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">E-mail</FieldLabel>
            <Input id="email" type="email" aria-invalid={!!errors.email} {...register("email")} />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <Input
              id="password"
              type="password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password && <FieldError>{errors.password.message}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.confirmPassword}>
            <FieldLabel htmlFor="confirmPassword">Confirmar senha</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && <FieldError>{errors.confirmPassword.message}</FieldError>}
          </Field>

          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting && <Loader2 data-icon="inline-start" className="animate-spin" />}
            Criar conta
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Já tem uma conta?{" "}
        <Link href="/admin/signin" className="font-medium text-accent hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
