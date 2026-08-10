"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MoreHorizontal, Pencil, UserX, UserCheck, KeyRound } from "lucide-react";
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
import type { UserListItemDto } from "@/modules/access/types";

export function AdminUsersTable({ users }: { users: UserListItemDto[] }) {
  const router = useRouter();
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleReactivate(id: string) {
    try {
      await http.post(`/admin/users/${id}/reactivate`);
      toast.success("Acesso reativado");
      router.refresh();
    } catch {
      toast.error("Não foi possível reativar o acesso");
    }
  }

  async function handleDeactivate() {
    if (!deactivateId) return;
    setLoading(true);
    try {
      await http.post(`/admin/users/${deactivateId}/deactivate`);
      toast.success("Acesso desativado");
      router.refresh();
    } catch {
      toast.error("Não foi possível desativar o acesso");
    } finally {
      setLoading(false);
      setDeactivateId(null);
    }
  }

  if (users.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <KeyRound />
        </EmptyMedia>
        <EmptyTitle>Nenhum acesso cadastrado</EmptyTitle>
        <EmptyDescription>Crie o primeiro acesso para a equipe.</EmptyDescription>
        <Button className="mt-2" nativeButton={false} render={<Link href="/admin/users/novo" />}>
          Criar acesso
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
              <TableHead>E-mail</TableHead>
              <TableHead>Tipo de acesso</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.accessType.name}</TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? "Ativo" : "Desativado"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
                      <MoreHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuItem render={<Link href={`/admin/users/${user.id}`} />}>
                          <Pencil data-icon="inline-start" /> Editar
                        </DropdownMenuItem>
                        {user.isActive ? (
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setDeactivateId(user.id)}
                          >
                            <UserX data-icon="inline-start" /> Desativar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleReactivate(user.id)}>
                            <UserCheck data-icon="inline-start" /> Reativar
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

      <AlertDialog open={!!deactivateId} onOpenChange={(open) => !open && setDeactivateId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desativar acesso</AlertDialogTitle>
            <AlertDialogDescription>
              A pessoa não conseguirá mais entrar no painel administrativo até que o acesso seja
              reativado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction disabled={loading} onClick={handleDeactivate}>
              Desativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
