"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HouseGallery({
  images,
  title,
}: {
  images: { id: string; url: string }[];
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return <div className="aspect-video w-full rounded-2xl bg-muted" />;
  }

  const show = (i: number) => {
    setIndex((i + images.length) % images.length);
  };

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl">
        <button
          type="button"
          onClick={() => {
            setIndex(0);
            setOpen(true);
          }}
          className="relative col-span-4 row-span-2 aspect-video cursor-pointer sm:col-span-2 sm:row-span-2 sm:aspect-auto"
        >
          <Image src={images[0].url} alt={title} fill className="object-cover" priority />
        </button>
        {images.slice(1, 5).map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => {
              setIndex(i + 1);
              setOpen(true);
            }}
            className="relative hidden aspect-square cursor-pointer sm:block"
          >
            <Image src={img.url} alt={title} fill className="object-cover" />
            {i === 3 && images.length > 5 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-semibold text-white">
                +{images.length - 5}
              </span>
            )}
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl border-0 bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
            <Image src={images[index].url} alt={title} fill className="object-contain" />

            <Button
              variant="secondary"
              size="icon"
              className="absolute top-3 right-3"
              onClick={() => setOpen(false)}
            >
              <X />
            </Button>

            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-1/2 left-3 -translate-y-1/2"
                  onClick={() => show(index - 1)}
                >
                  <ChevronLeft />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-1/2 right-3 -translate-y-1/2"
                  onClick={() => show(index + 1)}
                >
                  <ChevronRight />
                </Button>
              </>
            )}
          </div>

          <div className="mt-3 flex justify-center gap-2">
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  "size-2 cursor-pointer rounded-full bg-white/50",
                  i === index && "bg-white",
                )}
                aria-label={`Imagem ${i + 1}`}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
