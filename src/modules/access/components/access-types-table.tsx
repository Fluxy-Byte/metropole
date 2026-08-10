"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { http } from "@/lib/http";
import type { AccessTypeDto } from "@/modules/access/types";

export function AccessTypesTable({ accessTypes }: { accessTypes: AccessTypeDto[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!deleteId) return;
    setLoading(true);
    try {
      await http.delete(`/admin/access-types/${deleteId}`);
      toast.success("Tipo de acesso excluído");
      router.refresh();
    } catch {
      toast.error("Não foi possível excluir — verifique se ainda há usuários com este tipo");
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  }

  if (accessTypes.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <ShieldCheck />
        </EmptyMedia>
        <EmptyTitle>Nenhum tipo de acesso cadastrado</EmptyTitle>
        <EmptyDescription>Crie tipos de acesso para organizar as permissões da equipe.</EmptyDescription>
        <Button className="mt-2" nativeButton={false} render={<Link href="/admin/access-types/novo" />}>
          Novo tipo de acesso
        </Button>
      </Empty>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Usuários</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {accessTypes.map((accessType) => (
              <TableRow key={accessType.id}>
                <TableCell className="font-medium">{accessType.name}</TableCell>
                <TableCell className="text-muted-foreground">{accessType.description || "—"}</TableCell>
                <TableCell>{accessType.userCount}</TableCell>
                <TableCell>
                  <Badge variant={accessType.isSystem ? "secondary" : "outline"}>
                    {accessType.isSystem ? "Padrão do sistema" : "Personalizado"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
                      <MoreHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuItem render={<Link href={`/admin/access-types/${accessType.id}`} />}>
                          <Pencil data-icon="inline-start" /> {accessType.isSystem ? "Ver" : "Editar"}
                        </DropdownMenuItem>
                        {!accessType.isSystem && (
                          <DropdownMenuItem variant="destructive" onClick={() => setDeleteId(accessType.id)}>
                            <Trash2 data-icon="inline-start" /> Excluir
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir tipo de acesso</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Só é possível excluir tipos de acesso sem usuários
              vinculados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction disabled={loading} onClick={handleDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
