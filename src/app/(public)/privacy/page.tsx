import type { Metadata } from "next";
import { Container } from "@/components/shared/container";

export const metadata: Metadata = {
  title: "Política de Privacidade",
};

export default function PrivacyPage() {
  return (
    <Container className="max-w-3xl py-12">
      <h1 className="font-heading text-3xl font-bold text-primary">Política de Privacidade</h1>
      <p className="mt-2 text-sm text-muted-foreground">Última atualização: agosto de 2026</p>

      <div className="prose prose-slate mt-8 flex max-w-none flex-col gap-6 text-muted-foreground">
        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">1. Introdução</h2>
          <p className="mt-2">
            A Metrópole Imóveis valoriza a privacidade e a proteção dos dados pessoais de seus
            clientes e visitantes. Esta Política de Privacidade explica como coletamos, usamos,
            armazenamos e protegemos as informações fornecidas em nosso site e canais de
            atendimento, em conformidade com a Lei Geral de Proteção de Dados (LGPD).
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">
            2. Dados que coletamos
          </h2>
          <p className="mt-2">Podemos coletar as seguintes informações:</p>
          <ul className="mt-2 list-disc pl-6">
            <li>Nome, telefone, e-mail e demais dados fornecidos em formulários de contato;</li>
            <li>Preferências de busca, imóveis visualizados e favoritados;</li>
            <li>Dados de navegação, como endereço IP, navegador e dispositivo utilizado;</li>
            <li>Histórico de conversas realizadas via WhatsApp com nossa equipe ou assistente virtual.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">
            3. Como usamos seus dados
          </h2>
          <p className="mt-2">Utilizamos os dados coletados para:</p>
          <ul className="mt-2 list-disc pl-6">
            <li>Viabilizar o atendimento e a comunicação sobre imóveis de seu interesse;</li>
            <li>Personalizar recomendações de imóveis compatíveis com seu perfil;</li>
            <li>Melhorar a experiência de navegação em nosso site;</li>
            <li>Cumprir obrigações legais e regulatórias.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">
            4. Compartilhamento de dados
          </h2>
          <p className="mt-2">
            Não vendemos seus dados pessoais. Podemos compartilhar informações com parceiros
            estritamente necessários à prestação do serviço, como instituições financeiras em
            processos de financiamento, sempre mediante autorização e conforme a finalidade
            informada.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">5. Seus direitos</h2>
          <p className="mt-2">
            Você pode solicitar, a qualquer momento, a confirmação da existência de tratamento,
            acesso, correção, anonimização ou exclusão dos seus dados pessoais, entrando em
            contato pelos canais disponíveis na página de Contato.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">
            6. Armazenamento e segurança
          </h2>
          <p className="mt-2">
            Adotamos medidas técnicas e organizacionais para proteger seus dados contra acessos
            não autorizados, perda, alteração ou destruição, incluindo criptografia de sessões,
            controle de acesso por perfil e registro de auditoria das operações realizadas em
            nossos sistemas.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">7. Contato</h2>
          <p className="mt-2">
            Em caso de dúvidas sobre esta Política de Privacidade, entre em contato conosco pelo
            e-mail contato@metropoleimoveis.com.br.
          </p>
        </section>
      </div>
    </Container>
  );
}
