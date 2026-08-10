import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function jsonOk<T>(data: T, init?: number) {
  return NextResponse.json(data, { status: init ?? 200 });
}

export function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return jsonError("Dados inválidos", 422, error.flatten());
  }
  if (error instanceof Error) {
    if (error.message === "UNAUTHENTICATED") return jsonError("Não autenticado", 401);
    if (error.message === "FORBIDDEN") return jsonError("Acesso negado", 403);
    if (error.message === "DUPLICATE_EMAIL") return jsonError("Já existe um acesso com este e-mail", 409);
    if (error.message === "DUPLICATE_CPF") return jsonError("Já existe um acesso com este CPF", 409);
    if (error.message === "ACCESS_TYPE_IS_SYSTEM")
      return jsonError("Este tipo de acesso é padrão do sistema e não pode ser alterado", 400);
    if (error.message === "ACCESS_TYPE_IN_USE")
      return jsonError("Existem usuários com este tipo de acesso — reatribua-os antes de excluir", 409);
    if (error.message === "ACCESS_TYPE_NAME_TAKEN")
      return jsonError("Já existe um tipo de acesso com este nome", 409);
    console.error(error);
    return jsonError("Erro interno", 500);
  }
  console.error(error);
  return jsonError("Erro interno", 500);
}
