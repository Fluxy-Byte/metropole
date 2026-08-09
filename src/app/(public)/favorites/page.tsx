import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { FavoritesList } from "@/modules/favorites/components/favorites-list";

export const metadata: Metadata = {
  title: "Meus favoritos",
};

export default function FavoritesPage() {
  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-primary">Meus favoritos</h1>
        <p className="mt-1 text-muted-foreground">
          Os imóveis que você salvou ficam guardados aqui, mesmo se você fechar o navegador.
        </p>
      </div>

      <FavoritesList />
    </Container>
  );
}
