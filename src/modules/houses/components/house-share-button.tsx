"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function HouseShareButton({ title }: { title: string }) {
  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        return;
      }
    }

    await navigator.clipboard.writeText(url);
    toast.success("Link copiado para a área de transferência");
  }

  return (
    <Button variant="outline" onClick={handleShare}>
      <Share2 data-icon="inline-start" />
      Compartilhar
    </Button>
  );
}
