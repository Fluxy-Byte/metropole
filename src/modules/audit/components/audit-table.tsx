import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ScrollText } from "lucide-react";

const ACTION_LABELS: Record<string, string> = {
  LOGIN: "Login",
  LOGOUT: "Logout",
  CREATE: "Cadastro",
  UPDATE: "Alteração",
  DELETE: "Exclusão",
  VIEW: "Visualização",
  UPLOAD: "Upload",
};

const ACTION_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  LOGIN: "secondary",
  LOGOUT: "outline",
  CREATE: "default",
  UPDATE: "secondary",
  DELETE: "destructive",
  VIEW: "outline",
  UPLOAD: "secondary",
};

interface AuditEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  ip: string | null;
  userAgent: string | null;
  device: string | null;
  createdAt: string;
  actorEmail: string | null;
  actor: { id: string; name: string; email: string } | null;
}

export function AuditTable({ entries }: { entries: AuditEntry[] }) {
  if (entries.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <ScrollText />
        </EmptyMedia>
        <EmptyTitle>Nenhum registro encontrado</EmptyTitle>
        <EmptyDescription>Ajuste os filtros ou aguarde novas ações no sistema.</EmptyDescription>
      </Empty>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Ação</TableHead>
            <TableHead>Entidade</TableHead>
            <TableHead>IP</TableHead>
            <TableHead>Dispositivo</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.actor?.name ?? entry.actorEmail ?? "Sistema"}</TableCell>
              <TableCell>
                <Badge variant={ACTION_VARIANTS[entry.action] ?? "outline"}>
                  {ACTION_LABELS[entry.action] ?? entry.action}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {entry.entityType}
                {entry.entityId ? ` #${entry.entityId.slice(0, 8)}` : ""}
              </TableCell>
              <TableCell className="text-muted-foreground">{entry.ip ?? "—"}</TableCell>
              <TableCell className="text-muted-foreground">
                {entry.device ?? "—"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(entry.createdAt).toLocaleString("pt-BR")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
