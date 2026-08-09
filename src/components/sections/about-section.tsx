import { Container } from "@/components/shared/container";

const STATS = [
  { label: "Anos de atuação em Uberlândia", value: "15+" },
  { label: "Imóveis negociados", value: "1.200+" },
  { label: "Clientes satisfeitos", value: "3.400+" },
  { label: "Bairros atendidos", value: "40+" },
];

export function AboutSection() {
  return (
    <section className="bg-secondary py-16 sm:py-24">
      <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">
            Sobre a Metrópole Imóveis
          </p>
          <h2 className="mt-1 font-heading text-3xl font-bold text-primary">
            Feita por quem entende de Uberlândia
          </h2>
          <div className="mt-4 flex flex-col gap-4 text-muted-foreground">
            <p>
              A Metrópole Imóveis nasceu da vontade de tornar a experiência de comprar, vender e
              alugar imóveis em Uberlândia mais simples, transparente e humana. Ao longo dos anos,
              construímos um relacionamento próximo com a cidade — conhecemos cada bairro, cada
              tendência de valorização e cada detalhe que faz diferença na hora de decidir.
            </p>
            <p>
              Nossa equipe une consultores especializados, tecnologia própria e um cuidado genuíno
              com cada cliente para conectar pessoas ao imóvel certo, seja o primeiro apartamento,
              a casa dos sonhos ou o próximo investimento. Trabalhamos com um portfólio
              cuidadosamente selecionado, sempre com foco em segurança jurídica e agilidade em
              cada etapa do processo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-background p-6 text-center shadow-sm"
            >
              <p className="font-heading text-3xl font-bold text-primary">{stat.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
