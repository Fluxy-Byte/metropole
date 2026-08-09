import type { Metadata } from "next";
import { Container } from "@/components/shared/container";

export const metadata: Metadata = {
  title: "Termos de Uso",
};

export default function TermsPage() {
  return (
    <Container className="max-w-3xl py-12">
      <h1 className="font-heading text-3xl font-bold text-primary">Termos de Uso</h1>
      <p className="mt-2 text-sm text-muted-foreground">Última atualização: agosto de 2026</p>

      <div className="mt-8 flex flex-col gap-6 text-muted-foreground">
        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">
            1. Aceitação dos termos
          </h2>
          <p className="mt-2">
            Ao acessar e utilizar o site da Metrópole Imóveis, você concorda com os termos e
            condições descritos nesta página. Caso não concorde com algum dos termos, recomendamos
            que não utilize nossos serviços digitais.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">
            2. Uso do site
          </h2>
          <p className="mt-2">
            As informações sobre imóveis disponibilizadas neste site têm caráter informativo e
            podem ser alteradas sem aviso prévio, incluindo disponibilidade, valores e condições
            de negociação. A Metrópole Imóveis se esforça para manter os dados atualizados, mas
            não garante a exatidão absoluta das informações exibidas a qualquer momento.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">
            3. Cadastro e atendimento
          </h2>
          <p className="mt-2">
            Ao preencher formulários de contato, você autoriza que nossa equipe entre em contato
            para dar seguimento ao seu atendimento. As informações fornecidas devem ser
            verdadeiras e atualizadas.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">
            4. Propriedade intelectual
          </h2>
          <p className="mt-2">
            Todo o conteúdo disponível neste site — textos, imagens, logotipo e identidade visual
            — pertence à Metrópole Imóveis ou a seus respectivos proprietários, sendo vedada a
            reprodução sem autorização prévia.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">
            5. Limitação de responsabilidade
          </h2>
          <p className="mt-2">
            A Metrópole Imóveis não se responsabiliza por decisões tomadas exclusivamente com base
            nas informações do site, recomendando sempre a confirmação de dados e condições
            diretamente com um de nossos consultores antes da formalização de qualquer negócio.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">
            6. Alterações destes termos
          </h2>
          <p className="mt-2">
            Estes Termos de Uso podem ser atualizados periodicamente. A versão vigente estará
            sempre disponível nesta página.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">7. Contato</h2>
          <p className="mt-2">
            Dúvidas sobre estes Termos de Uso podem ser enviadas para
            contato@metropoleimoveis.com.br.
          </p>
        </section>
      </div>
    </Container>
  );
}
