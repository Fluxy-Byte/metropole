import Link from "next/link";
import { MessageCircle } from "lucide-react";
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
import { Users } from "lucide-react";
import type { ClientListItemDto } from "@/modules/clients/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function ClientsTable({ clients }: { clients: ClientListItemDto[] }) {
  if (clients.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <Users />
        </EmptyMedia>
        <EmptyTitle>Nenhum cliente encontrado</EmptyTitle>
        <EmptyDescription>Ajuste a busca ou aguarde novos contatos chegarem.</EmptyDescription>
      </Empty>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>Interesses</TableHead>
            <TableHead>Cadastrado em</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id} className="cursor-pointer">
              <TableCell className="font-medium">
                <Link href={`/admin/clients/${client.id}`} className="hover:text-accent">
                  {client.name}
                </Link>
              </TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>
                {client.hasWhatsapp ? (
                  <Badge variant="secondary" className="gap-1">
                    <MessageCircle className="size-3" /> Sim
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">Não</span>
                )}
              </TableCell>
              <TableCell>{client.interestsCount}</TableCell>
              <TableCell>{formatDate(client.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
