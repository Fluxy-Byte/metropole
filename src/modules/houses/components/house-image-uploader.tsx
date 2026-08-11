"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImagePlus, Star, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { http } from "@/lib/http";

interface HouseImage {
  id: string;
  url: string;
  isCover: boolean;
}

export function HouseImageUploader({ houseId, images }: { houseId: string; images: HouseImage[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [settingCoverId, setSettingCoverId] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    setUploading(true);
    try {
      await http.post(`/admin/houses/${houseId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Imagens enviadas");
      router.refresh();
    } catch {
      toast.error("Falha ao enviar imagens");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove(imageId: string) {
    setRemovingId(imageId);
    try {
      await http.delete(`/admin/houses/${houseId}/images/${imageId}`);
      router.refresh();
    } catch {
      toast.error("Falha ao remover imagem");
    } finally {
      setRemovingId(null);
    }
  }

  async function handleSetCover(imageId: string) {
    setSettingCoverId(imageId);
    try {
      await http.patch(`/admin/houses/${houseId}/images/${imageId}`);
      toast.success("Foto de capa atualizada");
      router.refresh();
    } catch {
      toast.error("Falha ao definir a foto de capa");
    } finally {
      setSettingCoverId(null);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Imagens</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <ImagePlus data-icon="inline-start" />}
          Enviar imagens
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma imagem enviada ainda.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((image) => (
              <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
                <Image src={image.url} alt="" fill className="object-cover" />
                {image.isCover ? (
                  <span className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                    <Star className="size-3 fill-current" /> Capa
                  </span>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute top-1.5 left-1.5 h-7 gap-1 px-2 text-[11px] opacity-0 transition-opacity group-hover:opacity-100"
                    disabled={settingCoverId === image.id}
                    onClick={() => handleSetCover(image.id)}
                  >
                    {settingCoverId === image.id ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      <Star className="size-3" />
                    )}
                    Tornar capa
                  </Button>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1.5 right-1.5 size-7 opacity-0 transition-opacity group-hover:opacity-100"
                  disabled={removingId === image.id}
                  onClick={() => handleRemove(image.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
