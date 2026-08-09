"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authClient } from "@/lib/auth-client";

const signInSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string().min(1, "Informe sua senha"),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });

  const onSubmit = async (values: SignInValues) => {
    setServerError(null);
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setServerError(error.message ?? "Não foi possível entrar. Verifique seus dados.");
      return;
    }

    router.push(searchParams.get("callbackUrl") || "/admin");
    router.refresh();
  };

  return (
    <div>
      <h1 className="text-center font-heading text-2xl font-bold text-primary">
        Acessar painel administrativo
      </h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        Entre com seu e-mail e senha para continuar
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
        <FieldGroup>
          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

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

          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting && <Loader2 data-icon="inline-start" className="animate-spin" />}
            Entrar
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Ainda não tem uma conta?{" "}
        <Link href="/admin/signup" className="font-medium text-accent hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
