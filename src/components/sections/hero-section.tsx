import Image from "next/image";
import { Container } from "@/components/shared/container";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary">
      <Image
        src="/Imagem capa home.jpg"
        alt="Vista aérea de Uberlândia"
        fill
        priority
        className="object-cover opacity-25"
      />

      <div className="absolute inset-0 bg-neutral-600/50" aria-hidden="true" />

      <Container className="relative flex flex-col items-center gap-4 py-20 text-center sm:py-28">
        <span className="rounded-full bg-accent px-4 py-1 text-xs font-medium tracking-wide text-white uppercase">
          Uberlândia - MG
        </span>
        <h1 className="max-w-3xl font-heading text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
          Encontre o imóvel certo para o seu próximo capítulo
        </h1>
        <p className="max-w-xl text-base text-white/80 sm:text-lg">
          Casas, apartamentos e imóveis comerciais selecionados com atendimento humanizado, do
          primeiro contato às chaves na mão.
        </p>
      </Container>
    </section>
  );
}
