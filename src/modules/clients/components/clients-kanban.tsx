"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Users } from "lucide-react";
import { http } from "@/lib/http";
import type { ClientListItemDto } from "@/modules/clients/types";

const STAGES = [
  { value: "START", label: "Início Atendimento" },
  { value: "IN_PROGRESS", label: "Em Atendimento" },
  { value: "NEGOTIATION", label: "Em Negociação" },
  { value: "DONE", label: "Concluído" },
] as const;

type StageValue = (typeof STAGES)[number]["value"];

const OUTCOME_LABELS: Record<string, string> = {
  SOLD: "Vendido",
  LOST: "Perdido",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function ClientsKanban({ clients }: { clients: ClientListItemDto[] }) {
  const router = useRouter();
  const [items, setItems] = useState(clients);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<StageValue | null>(null);
  const [pendingOutcome, setPendingOutcome] = useState<{ clientId: string; previousStage: StageValue } | null>(null);
  const [outcomeChoice, setOutcomeChoice] = useState<"SOLD" | "LOST" | null>(null);
  const [saving, setSaving] = useState(false);

  const byStage = useMemo(() => {
    const grouped: Record<StageValue, ClientListItemDto[]> = { START: [], IN_PROGRESS: [], NEGOTIATION: [], DONE: [] };
    for (const client of items) {
      const stage = (client.pipelineStage as StageValue) in grouped ? (client.pipelineStage as StageValue) : "START";
      grouped[stage].push(client);
    }
    return grouped;
  }, [items]);

  async function persistMove(clientId: string, stage: StageValue, outcome: "SOLD" | "LOST" | null, previousStage: StageValue) {
    setSaving(true);
    try {
      await http.patch(`/admin/clients/${clientId}/pipeline`, { pipelineStage: stage, outcome: outcome ?? undefined });
      toast.success("Etapa do lead atualizada");
      router.refresh();
    } catch {
      toast.error("Não foi possível mover o lead");
      setItems((prev) =>
        prev.map((c) => (c.id === clientId ? { ...c, pipelineStage: previousStage, outcome: c.outcome } : c)),
      );
    } finally {
      setSaving(false);
    }
  }

  function moveLocally(clientId: string, stage: StageValue, outcome: "SOLD" | "LOST" | null) {
    setItems((prev) => prev.map((c) => (c.id === clientId ? { ...c, pipelineStage: stage, outcome } : c)));
  }

  function handleDrop(targetStage: StageValue) {
    setDragOverStage(null);
    const clientId = dragId;
    setDragId(null);
    if (!clientId) return;

    const client = items.find((c) => c.id === clientId);
    if (!client || client.pipelineStage === targetStage) return;

    const previousStage = client.pipelineStage as StageValue;

    if (targetStage === "DONE") {
      setPendingOutcome({ clientId, previousStage });
      setOutcomeChoice(null);
      return;
    }

    moveLocally(clientId, targetStage, null);
    void persistMove(clientId, targetStage, null, previousStage);
  }

  function confirmOutcome() {
    if (!pendingOutcome || !outcomeChoice) return;
    const { clientId, previousStage } = pendingOutcome;
    moveLocally(clientId, "DONE", outcomeChoice);
    void persistMove(clientId, "DONE", outcomeChoice, previousStage);
    setPendingOutcome(null);
    setOutcomeChoice(null);
  }

  if (items.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <Users />
        </EmptyMedia>
        <EmptyTitle>Nenhum cliente encontrado</EmptyTitle>
        <EmptyDescription>Aguarde novos contatos chegarem.</EmptyDescription>
      </Empty>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {STAGES.map((stage) => (
          <div
            key={stage.value}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverStage(stage.value);
            }}
            onDragLeave={() => setDragOverStage((current) => (current === stage.value ? null : current))}
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(stage.value);
            }}
            className={`flex min-h-[200px] flex-col gap-3 rounded-xl border border-border bg-muted/30 p-3 transition-colors ${
              dragOverStage === stage.value ? "border-accent bg-accent/10" : ""
            }`}
          >
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-foreground">{stage.label}</h3>
              <Badge variant="outline">{byStage[stage.value].length}</Badge>
            </div>

            <div className="flex flex-col gap-2">
              {byStage[stage.value].map((client) => (
                <div
                  key={client.id}
                  draggable={!saving}
                  onDragStart={() => setDragId(client.id)}
                  onDragEnd={() => setDragId(null)}
                  className="cursor-grab rounded-lg border border-border bg-background p-3 text-sm shadow-sm active:cursor-grabbing"
                >
                  <Link href={`/admin/clients/${client.id}`} className="font-medium hover:text-accent">
                    {client.name}
                  </Link>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{client.phone}</span>
                    {client.hasWhatsapp && <MessageCircle className="size-3.5" />}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary">{client.interestsCount} interesse(s)</Badge>
                    {client.outcome && (
                      <Badge variant={client.outcome === "SOLD" ? "default" : "destructive"}>
                        {OUTCOME_LABELS[client.outcome] ?? client.outcome}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">Desde {formatDate(client.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={pendingOutcome !== null} onOpenChange={(open) => !open && setPendingOutcome(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Concluir atendimento</DialogTitle>
            <DialogDescription>
              Antes de mover pra &ldquo;Concluído&rdquo;, diga o resultado deste lead.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={outcomeChoice === "SOLD" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setOutcomeChoice("SOLD")}
            >
              Vendido
            </Button>
            <Button
              type="button"
              variant={outcomeChoice === "LOST" ? "destructive" : "outline"}
              className="flex-1"
              onClick={() => setOutcomeChoice("LOST")}
            >
              Perdido
            </Button>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setPendingOutcome(null)}>
              Cancelar
            </Button>
            <Button type="button" disabled={!outcomeChoice} onClick={confirmOutcome}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
