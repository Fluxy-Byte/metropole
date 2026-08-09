import { Star } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Card } from "@/components/ui/card";

const TESTIMONIALS = [
  {
    name: "Fernanda Aquino",
    role: "Compradora - Santa Mônica",
    quote:
      "A equipe da Metrópole entendeu exatamente o que eu procurava. Em poucas semanas encontramos o apartamento perfeito, sem nenhuma dor de cabeça com a documentação.",
  },
  {
    name: "Ricardo Nascimento",
    role: "Vendedor - Tibery",
    quote:
      "Vendi minha casa em tempo recorde e pelo valor que eu esperava. A transparência durante toda a negociação fez toda a diferença.",
  },
  {
    name: "Juliana e Marcos Prado",
    role: "Locatários - Umuarama",
    quote:
      "Atendimento pelo WhatsApp foi rápido e muito atencioso. Conseguimos agendar visitas no mesmo dia e fechar contrato em menos de uma semana.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-secondary py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">Depoimentos</p>
          <h2 className="mt-1 font-heading text-3xl font-bold text-primary">
            Quem confiou, recomenda
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <Card key={testimonial.name} className="p-6">
              <div className="flex gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground italic">“{testimonial.quote}”</p>
              <div className="mt-6">
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
