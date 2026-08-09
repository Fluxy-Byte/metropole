export const LISTING_TYPE_OPTIONS = [
  { value: "SALE", label: "Venda" },
  { value: "RENT", label: "Aluguel" },
] as const;

export const SORT_OPTIONS = [
  { value: "recent", label: "Mais recentes" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
] as const;

export const PAGE_SIZE_OPTIONS = [
  { value: "10", label: "10 por página" },
  { value: "20", label: "20 por página" },
  { value: "50", label: "50 por página" },
] as const;
