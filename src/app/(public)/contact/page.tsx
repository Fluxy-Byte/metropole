import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { ContactForm } from "@/modules/clients/components/contact-form";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Metrópole Imóveis e receba atendimento personalizado.",
};

export default function ContactPage() {
  return (
    <Container className="py-10 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold tracking-wide text-accent uppercase">Fale conosco</p>
        <h1 className="mt-1 font-heading text-3xl font-bold text-primary sm:text-4xl">
          Vamos encontrar o imóvel certo para você
        </h1>
        <p className="mt-3 text-muted-foreground">
          Preencha o formulário e um de nossos consultores entrará em contato para entender
          suas necessidades e apresentar as melhores opções.
        </p>
      </div>

      <div className="mt-10 grid overflow-hidden rounded-3xl border border-border bg-background shadow-xl lg:grid-cols-2">
        <div className="relative min-h-64 bg-muted lg:min-h-full">
          <Image
            src="/ModalContatos.png"
            alt="Fale conosco"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-10">
          <ContactForm />
        </div>
      </div>
    </Container>
  );
}
