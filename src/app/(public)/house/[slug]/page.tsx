import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BedDouble,
  Car,
  Flame,
  MapPin,
  Ruler,
  ShowerHead,
  Waves,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { houseService } from "@/modules/houses/services/house.service";
import { HouseGallery } from "@/modules/houses/components/house-gallery";
import { HouseLocationMap } from "@/modules/houses/components/house-location-map";
import { HouseShareButton } from "@/modules/houses/components/house-share-button";
import { HouseRequestContactButton } from "@/modules/houses/components/house-request-contact-button";
import { FavoriteButton } from "@/modules/favorites/components/favorite-button";
import { HouseCard } from "@/modules/houses/components/house-card";
import { formatArea, formatCurrency, formatListingType } from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/house/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const house = await houseService.getBySlug(slug);
  if (!house) return {};
  return {
    title: house.title,
    description: house.description.slice(0, 160),
  };
}

export default async function HouseDetailPage({ params }: PageProps<"/house/[slug]">) {
  const { slug } = await params;
  const house = await houseService.getBySlug(slug, { trackView: true });
  if (!house) notFound();

  const similar = await houseService.similar({
    id: house.id,
    categoryId: house.category.id,
    neighborhood: house.neighborhood,
  });

  return (
    <Container className="py-10">
      <div className="mb-6 flex flex-col gap-2">
        <Badge className="w-fit bg-accent text-white">
          {formatListingType(house.listingType)}
        </Badge>
        <h1 className="font-heading text-3xl font-bold text-foreground">{house.title}</h1>
        <p className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          {house.address} — {house.neighborhood}, {house.city} - {house.state}
        </p>
      </div>

      <HouseGallery images={house.images} title={house.title} />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">Descrição</h2>
            <p className="mt-3 leading-relaxed whitespace-pre-line text-muted-foreground">
              {house.description}
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Características
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <FeatureItem icon={Ruler} label="Área construída" value={formatArea(house.builtArea)} />
              <FeatureItem icon={Ruler} label="Área total" value={formatArea(house.totalArea)} />
              <FeatureItem icon={BedDouble} label="Quartos" value={String(house.bedrooms)} />
              <FeatureItem icon={ShowerHead} label="Banheiros" value={String(house.bathrooms)} />
              <FeatureItem icon={Car} label="Vagas de garagem" value={String(house.garageSpaces)} />
              {house.hasPool && <FeatureItem icon={Waves} label="Piscina" value="Sim" />}
              {house.hasBarbecue && <FeatureItem icon={Flame} label="Churrasqueira" value="Sim" />}
            </div>

            {(house.condoFee || house.iptu) && (
              <div className="mt-6 flex flex-wrap gap-6 text-sm">
                {house.condoFee && (
                  <p>
                    <span className="text-muted-foreground">Condomínio: </span>
                    <span className="font-semibold">{formatCurrency(house.condoFee)}</span>
                  </p>
                )}
                {house.iptu && (
                  <p>
                    <span className="text-muted-foreground">IPTU: </span>
                    <span className="font-semibold">{formatCurrency(house.iptu)}</span>
                  </p>
                )}
              </div>
            )}

            {house.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {house.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </section>

          {house.videoUrl && (
            <>
              <Separator />
              <section>
                <h2 className="font-heading text-xl font-semibold text-foreground">Vídeo</h2>
                <div className="mt-4 aspect-video overflow-hidden rounded-2xl">
                  <iframe
                    src={house.videoUrl}
                    title="Vídeo do imóvel"
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </section>
            </>
          )}

          <Separator />

          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">Localização</h2>
            <div className="mt-4">
              <HouseLocationMap
                latitude={house.latitude}
                longitude={house.longitude}
                address={house.address}
              />
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-border p-6 lg:sticky lg:top-24">
          <p className="font-heading text-3xl font-bold text-primary">
            {formatCurrency(house.price)}
            {house.listingType === "RENT" && (
              <span className="text-base font-normal text-muted-foreground">/mês</span>
            )}
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <HouseRequestContactButton houseId={house.id} />
            <div className="flex gap-3">
              <HouseShareButton title={house.title} />
              <FavoriteButton houseId={house.id} variant="full" className="flex-1" />
            </div>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-heading text-2xl font-bold text-primary">
            Imóveis semelhantes
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((item) => (
              <HouseCard key={item.id} house={item} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}

function FeatureItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border p-3">
      <Icon className="size-5 text-accent" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
