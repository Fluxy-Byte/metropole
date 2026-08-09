"use client";

import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import { addFavorite } from "@/store/slices/favorites-slice";

export function HouseRequestContactButton({ houseId }: { houseId: string }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return (
    <Button
      size="lg"
      className="w-full"
      onClick={() => {
        dispatch(addFavorite(houseId));
        router.push("/contact");
      }}
    >
      <MessageCircle data-icon="inline-start" />
      Solicitar atendimento
    </Button>
  );
}
