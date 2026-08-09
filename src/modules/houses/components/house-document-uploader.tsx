"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileText, FilePlus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { http } from "@/lib/http";

interface HouseDocument {
  id: string;
  url: string;
  originalName: string | null;
}

export function HouseDocumentUploader({
  houseId,
  documents,
}: {
  houseId: string;
  documents: HouseDocument[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    setUploading(true);
    try {
      await http.post(`/admin/houses/${houseId}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Documentos enviados");
      router.refresh();
    } catch {
      toast.error("Falha ao enviar documentos");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove(documentId: string) {
    setRemovingId(documentId);
    try {
      await http.delete(`/admin/houses/${houseId}/documents/${documentId}`);
      router.refresh();
    } catch {
      toast.error("Falha ao remover documento");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Documentos</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <FilePlus data-icon="inline-start" />}
          Enviar documento
        </Button>
        <input ref={inputRef} type="file" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum documento enviado ainda.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
              >
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-accent"
                >
                  <FileText className="size-4 shrink-0" />
                  <span className="line-clamp-1">{doc.originalName ?? "Documento"}</span>
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={removingId === doc.id}
                  onClick={() => handleRemove(doc.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
