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
    console.error(error);
    return jsonError("Erro interno", 500);
  }
  console.error(error);
  return jsonError("Erro interno", 500);
}
