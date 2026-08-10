import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 font-heading text-lg font-bold tracking-tight",
        dark ? "text-white" : "text-primary",
        className,
      )}
    >
      <Image
        src="/Icone Marca.png"
        alt="Metrópole"
        width={372}
        height={367}
        priority
        unoptimized
        className="size-9"
      />
      <span className="leading-tight">
        Metrópole
        <span className="block text-xs font-medium tracking-widest uppercase opacity-70">
          Imóveis
        </span>
      </span>
    </Link>
  );
}
