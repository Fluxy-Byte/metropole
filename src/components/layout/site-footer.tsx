import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { Separator } from "@/components/ui/separator";
import { FacebookIcon, InstagramIcon } from "@/components/shared/social-icons";

const SITE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/houses", label: "Imóveis" },
  { href: "/contact", label: "Contato" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Política de Privacidade" },
  { href: "/terms", label: "Termos de Uso" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Logo dark />
          <p className="text-sm text-primary-foreground/70">
            Há anos ajudando famílias e investidores a encontrar o imóvel certo em Uberlândia e
            região, com atendimento humanizado e imóveis selecionados.
          </p>
          <div className="flex gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent"
            >
              <FacebookIcon className="size-4" />
            </a>
            <a
              href="https://www.instagram.com/metropole.udi/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent"
            >
              <InstagramIcon className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary-foreground/60">
            Navegação
          </h3>
          <ul className="flex flex-col gap-3 text-sm">
            {SITE_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-primary-foreground/80 hover:text-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary-foreground/60">
            Institucional
          </h3>
          <ul className="flex flex-col gap-3 text-sm">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-primary-foreground/80 hover:text-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary-foreground/60">
            Contato
          </h3>
          <ul className="flex flex-col gap-3 text-sm text-primary-foreground/80">
            <li className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0" /> Uberlândia - MG
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" /> (34) 99999-0000
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0" /> contato@metropoleimoveis.com.br
            </li>
          </ul>
        </div>
      </Container>

      <Separator className="bg-white/10" />

      <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-primary-foreground/60 sm:flex-row">
        <p>© {new Date().getFullYear()} Metrópole Imóveis. Todos os direitos reservados.</p>
        <p>CRECI 00000-J · Uberlândia - MG</p>
      </Container>
    </footer>
  );
}
