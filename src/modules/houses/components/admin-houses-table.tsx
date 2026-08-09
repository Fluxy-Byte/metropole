"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MoreHorizontal, Pencil, Archive, Trash2, Home } from "lucide-react";
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
import { formatCurrency, formatListingType } from "@/lib/format";
import type { HouseListItemDto } from "@/modules/houses/types";

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Rascunho",
  PUBLISHED: "Publicado",
  ARCHIVED: "Arquivado",
  SOLD: "Vendido",
  RENTED: "Alugado",
};

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "outline"> = {
  DRAFT: "outline",
  PUBLISHED: "default",
  ARCHIVED: "secondary",
  SOLD: "secondary",
  RENTED: "secondary",
};

export function AdminHousesTable({ houses }: { houses: HouseListItemDto[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleArchive(id: string) {
    try {
      await http.post(`/admin/houses/${id}/archive`);
      toast.success("Imóvel arquivado");
      router.refresh();
    } catch {
      toast.error("Não foi possível arquivar o imóvel");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setLoading(true);
    try {
      await http.delete(`/admin/houses/${deleteId}`);
      toast.success("Imóvel excluído");
      router.refresh();
    } catch {
      toast.error("Não foi possível excluir o imóvel");
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  }

  if (houses.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <Home />
        </EmptyMedia>
        <EmptyTitle>Nenhum imóvel cadastrado</EmptyTitle>
        <EmptyDescription>Comece cadastrando o primeiro imóvel da imobiliária.</EmptyDescription>
        <Button className="mt-2" nativeButton={false} render={<Link href="/admin/houses/novo" />}>
          Cadastrar imóvel
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
              <TableHead>Imóvel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Finalidade</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Bairro</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {houses.map((house) => (
              <TableRow key={house.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                      {house.coverImageUrl && (
                        <Image src={house.coverImageUrl} alt={house.title} fill className="object-cover" />
                      )}
                    </div>
                    <Link
                      href={`/admin/houses/${house.id}`}
                      className="line-clamp-1 font-medium hover:text-accent"
                    >
                      {house.title}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANTS[house.status] ?? "outline"}>
                    {STATUS_LABELS[house.status] ?? house.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatListingType(house.listingType)}</TableCell>
                <TableCell>{formatCurrency(house.price)}</TableCell>
                <TableCell>{house.neighborhood}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
                      <MoreHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuItem render={<Link href={`/admin/houses/${house.id}`} />}>
                          <Pencil data-icon="inline-start" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleArchive(house.id)}>
                          <Archive data-icon="inline-start" /> Arquivar
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={() => setDeleteId(house.id)}>
                          <Trash2 data-icon="inline-start" /> Excluir
                        </DropdownMenuItem>
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
            <AlertDialogTitle>Excluir imóvel</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O imóvel e todas as suas imagens e documentos
              serão excluídos permanentemente.
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
