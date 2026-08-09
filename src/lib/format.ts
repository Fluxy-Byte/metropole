export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatArea(value: number): string {
  return `${new Intl.NumberFormat("pt-BR").format(value)} m²`;
}

export function formatListingType(type: string): string {
  return type === "RENT" ? "Aluguel" : "Venda";
}

export const LISTING_PRICE_SUFFIX: Record<string, string> = {
  RENT: "/mês",
  SALE: "",
};
