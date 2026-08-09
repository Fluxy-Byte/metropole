import type { HouseFilterInput } from "@/modules/houses/validators/house.validators";

const CATEGORY_KEYWORDS: Record<string, string> = {
  casa: "casa",
  casas: "casa",
  apartamento: "apartamento",
  apartamentos: "apartamento",
  apto: "apartamento",
  cobertura: "cobertura",
  coberturas: "cobertura",
  terreno: "terreno",
  terrenos: "terreno",
  fazenda: "fazenda",
  fazendas: "fazenda",
  chacara: "chacara",
  chacaras: "chacara",
  galpao: "galpao",
  galpoes: "galpao",
  "sala comercial": "sala-comercial",
  "salas comerciais": "sala-comercial",
  loja: "loja",
  lojas: "loja",
  condominio: "condominio",
  "alto padrao": "alto-padrao",
  lancamento: "lancamentos",
  lancamentos: "lancamentos",
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function parsePriceRange(text: string): Pick<HouseFilterInput, "minPrice" | "maxPrice"> {
  const clean = (value: string) => Number(value.replace(/\./g, "").replace(",", "."));

  const between = text.match(/entre\s*r?\$?\s*([\d.,]+)\s*(?:e|a)\s*r?\$?\s*([\d.,]+)/);
  if (between) {
    return { minPrice: clean(between[1]), maxPrice: clean(between[2]) };
  }

  const max = text.match(/at[eé]\s*r?\$?\s*([\d.,]+)/);
  if (max) return { maxPrice: clean(max[1]) };

  const min = text.match(/(?:a partir de|acima de|desde|mais de)\s*r?\$?\s*([\d.,]+)/);
  if (min) return { minPrice: clean(min[1]) };

  return {};
}

function parseCategorySlugs(normalizedText: string): string[] {
  const found = new Set<string>();
  for (const [keyword, slug] of Object.entries(CATEGORY_KEYWORDS)) {
    if (normalizedText.includes(keyword)) found.add(slug);
  }
  return Array.from(found);
}

function parseListingType(normalizedText: string): HouseFilterInput["listingType"] | undefined {
  if (/\balugar\b|\baluguel\b|\blocacao\b/.test(normalizedText)) return "RENT";
  if (/\bcomprar\b|\bvenda\b|\bcompra\b/.test(normalizedText)) return "SALE";
  return undefined;
}

function parseNeighborhood(originalText: string): string | undefined {
  const match = originalText.match(/\b(?:no|em|bairro)\s+([\p{L}\s]{3,40})/iu);
  if (!match) return undefined;
  return match[1].split(/,|\.| com /i)[0].trim();
}

function parseBedrooms(normalizedText: string): number | undefined {
  const match = normalizedText.match(/(\d+)\s*(?:quartos?|dormitorios?)/);
  return match ? Number(match[1]) : undefined;
}

function parseFeatures(normalizedText: string): Pick<HouseFilterInput, "hasPool"> {
  return normalizedText.includes("piscina") ? { hasPool: true } : {};
}

/**
 * Rule-based parser that turns a free-text WhatsApp query from Axel into
 * structured house filters. Intentionally simple: Axel (the LLM agent)
 * handles the actual conversational understanding upstream; this only
 * needs to catch common patterns like "casas até R$ 500.000 no Centro".
 */
export function parseNaturalLanguageQuery(
  query: string,
): Partial<HouseFilterInput> {
  const normalized = normalize(query);

  return {
    ...parsePriceRange(normalized),
    ...parseFeatures(normalized),
    categorySlugs: parseCategorySlugs(normalized).length ? parseCategorySlugs(normalized) : undefined,
    listingType: parseListingType(normalized),
    neighborhood: parseNeighborhood(query),
    bedrooms: parseBedrooms(normalized),
  };
}
