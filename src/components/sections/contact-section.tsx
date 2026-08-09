import Image from "next/image";
import { MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/shared/container";
import { ContactForm } from "@/modules/clients/components/contact-form";

export function ContactSection() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="grid overflow-hidden rounded-3xl border border-border bg-background shadow-xl lg:grid-cols-2">
          <div className="relative h-64 lg:h-auto">
            <Image
              src="/ModalContatos.png"
              alt="Fale conosco"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10">
            <p className="text-sm font-semibold tracking-wide text-accent uppercase">
              Fale conosco
            </p>
            <h2 className="mt-1 font-heading text-3xl font-bold text-primary">
              Seu próximo endereço começa aqui
            </h2>
            <p className="mt-3 text-muted-foreground">
              Preencha o formulário e um de nossos consultores entrará em contato para entender
              suas necessidades e apresentar as melhores opções.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-8">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Phone className="size-5" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">(34) 99999-0000</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <MessageCircle className="size-5" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <p className="font-medium">Atendimento rápido</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
