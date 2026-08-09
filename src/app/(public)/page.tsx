import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/hero-section";
import { LatestHousesSection } from "@/components/sections/latest-houses-section";
import { ContactSection } from "@/components/sections/contact-section";
import { HousesMapSection } from "@/components/sections/houses-map-section";
import { AboutSection } from "@/components/sections/about-section";
import { DifferentialsSection } from "@/components/sections/differentials-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { houseService } from "@/modules/houses/services/house.service";

export const metadata: Metadata = {
  description:
    "Metrópole Imóveis: casas, apartamentos e imóveis comerciais em Uberlândia - MG. Compre, venda ou alugue com atendimento humanizado.",
};

export default async function HomePage() {
  const [houses, mapHouses] = await Promise.all([
    houseService.latest(8),
    houseService.forMap(),
  ]);

  return (
    <>
      <HeroSection />
      <LatestHousesSection houses={houses} />
      <ContactSection />
      <HousesMapSection houses={mapHouses} />
      <AboutSection />
      <DifferentialsSection />
      <TestimonialsSection />
    </>
  );
}
