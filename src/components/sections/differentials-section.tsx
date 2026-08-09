import { HeartHandshake, MessageCircle, Home, Banknote, Landmark, Star } from "lucide-react";
import { Container } from "@/components/shared/container";

const DIFFERENTIALS = [
  {
    icon: HeartHandshake,
    title: "Atendimento Humanizado",
    description: "Consultores dedicados que acompanham você em cada etapa, sem pressa e sem letras miúdas.",
  },
  {
    icon: MessageCircle,
    title: "Atendimento via WhatsApp",
    description: "Fale com a Metrópole quando quiser: nossa assistente virtual está sempre disponível.",
  },
  {
    icon: Home,
    title: "Compra",
    description: "Ajudamos você a encontrar e negociar o imóvel ideal com segurança do início ao fim.",
  },
  {
    icon: Banknote,
    title: "Venda",
    description: "Estratégia de divulgação e precificação para vender seu imóvel no melhor prazo e valor.",
  },
  {
    icon: Landmark,
    title: "Financiamento",
    description: "Parceria com as principais instituições financeiras para facilitar sua conquista.",
  },
  {
    icon: Star,
    title: "Imóveis Exclusivos",
    description: "Portfólio selecionado com oportunidades que você não encontra em qualquer lugar.",
  },
];

export function DifferentialsSection() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">Diferenciais</p>
          <h2 className="mt-1 font-heading text-3xl font-bold text-primary">
            Por que escolher a Metrópole Imóveis
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DIFFERENTIALS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <item.icon className="size-6" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
