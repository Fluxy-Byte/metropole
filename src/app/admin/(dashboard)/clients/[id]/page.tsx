import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { clientService } from "@/modules/clients/services/client.service";

export const metadata: Metadata = { title: "Cliente" };

const STAGE_LABELS: Record<string, string> = {
  LEAD: "Lead",
  QUALIFIED: "Qualificado",
  VISIT_SCHEDULED: "Visita agendada",
  PROPOSAL: "Proposta",
  NEGOTIATION: "Negociação",
  WON: "Convertido",
  LOST: "Perdido",
};

const ACTIVITY_LABELS: Record<string, string> = {
  MESSAGE: "Mensagem",
  HOUSE_SENT: "Imóvel enviado",
  METADATA_UPDATE: "Atualização de perfil",
  INTEREST_ADDED: "Interesse adicionado",
  CONTACT_REQUEST: "Solicitação de contato",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR");
}

export default async function AdminClientDetailPage({ params }: PageProps<"/admin/clients/[id]">) {
  const { id } = await params;
  const client = await clientService.getById(id);
  if (!client) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">{client.name}</h1>
        <p className="text-sm text-muted-foreground">
          Cliente desde {new Date(client.createdAt).toLocaleDateString("pt-BR")}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Dados pessoais</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-muted-foreground" /> {client.phone}
            </div>
            {client.hasWhatsapp && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="size-4" /> Possui WhatsApp
              </div>
            )}
            {client.email && (
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" /> {client.email}
              </div>
            )}
            {client.notes && (
              <div>
                <p className="mt-2 text-xs font-medium text-muted-foreground uppercase">
                  Observações
                </p>
                <p className="mt-1">{client.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadados do WhatsApp</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            {client.metadata ? (
              <>
                <MetaRow label="Etapa do funil">
                  <Badge>{STAGE_LABELS[client.metadata.funnelStage] ?? client.metadata.funnelStage}</Badge>
                </MetaRow>
                <MetaRow label="Faixa de renda" value={client.metadata.incomeRange} />
                <MetaRow label="Estado civil" value={client.metadata.maritalStatus} />
                <MetaRow label="Tipo de imóvel desejado" value={client.metadata.desiredPropertyType} />
                <MetaRow label="Bairro de interesse" value={client.metadata.desiredNeighborhood} />
                <MetaRow
                  label="Último contato"
                  value={client.metadata.lastContactAt ? formatDateTime(client.metadata.lastContactAt) : null}
                />
                {client.metadata.observations && (
                  <div>
                    <p className="mt-2 text-xs font-medium text-muted-foreground uppercase">
                      Observações do Axel
                    </p>
                    <p className="mt-1">{client.metadata.observations}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">Nenhum dado do WhatsApp ainda.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interesses ({client.interests.length})</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            {client.interests.length === 0 && (
              <p className="text-muted-foreground">Nenhum imóvel de interesse ainda.</p>
            )}
            {client.interests.map((interest) => (
              <Link
                key={interest.id}
                href={`/house/${interest.slug}`}
                target="_blank"
                className="flex items-center justify-between rounded-lg border border-border p-3 hover:border-accent"
              >
                <span className="line-clamp-1">{interest.title}</span>
                <Badge variant="outline">{STAGE_LABELS[interest.stage] ?? interest.stage}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de atividades</CardTitle>
        </CardHeader>
        <CardContent>
          {client.activities.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma atividade registrada.</p>
          ) : (
            <div className="flex flex-col">
              {client.activities.map((activity, index) => (
                <div key={activity.id}>
                  <div className="flex items-center justify-between py-3 text-sm">
                    <span className="font-medium">
                      {ACTIVITY_LABELS[activity.type] ?? activity.type}
                    </span>
                    <span className="text-muted-foreground">{formatDateTime(activity.createdAt)}</span>
                  </div>
                  {index < client.activities.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MetaRow({ label, value, children }: { label: string; value?: string | null; children?: React.ReactNode }) {
  if (!value && !children) return null;
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      {children ?? <span className="font-medium">{value}</span>}
    </div>
  );
}
