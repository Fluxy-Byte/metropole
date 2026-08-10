import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  "Casa",
  "Apartamento",
  "Cobertura",
  "Terreno",
  "Fazenda",
  "Chácara",
  "Galpão",
  "Sala Comercial",
  "Loja",
  "Condomínio",
  "Alto Padrão",
  "Lançamentos",
] as const;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const NEIGHBORHOODS = [
  "Santa Mônica",
  "Umuarama",
  "Tibery",
  "Centro",
  "Jardim Karaíba",
  "Segismundo Pereira",
  "Morada da Colina",
  "Nossa Senhora das Graças",
  "Cidade Jardim",
];

const DEMO_HOUSES = [
  {
    title: "Casa moderna com piscina em condomínio fechado",
    categorySlug: "casa",
    listingType: "SALE" as const,
    price: 890000,
    bedrooms: 4,
    bathrooms: 3,
    garageSpaces: 3,
    builtArea: 280,
    totalArea: 400,
    hasPool: true,
    hasBarbecue: true,
    neighborhood: "Santa Mônica",
  },
  {
    title: "Apartamento amplo com varanda gourmet",
    categorySlug: "apartamento",
    listingType: "SALE" as const,
    price: 520000,
    bedrooms: 3,
    bathrooms: 2,
    garageSpaces: 2,
    builtArea: 120,
    totalArea: 120,
    hasPool: false,
    hasBarbecue: true,
    neighborhood: "Umuarama",
  },
  {
    title: "Cobertura duplex com vista panorâmica",
    categorySlug: "cobertura",
    listingType: "SALE" as const,
    price: 1250000,
    bedrooms: 4,
    bathrooms: 4,
    garageSpaces: 3,
    builtArea: 310,
    totalArea: 310,
    hasPool: true,
    hasBarbecue: true,
    neighborhood: "Tibery",
  },
  {
    title: "Terreno plano em condomínio residencial",
    categorySlug: "terreno",
    listingType: "SALE" as const,
    price: 260000,
    bedrooms: 0,
    bathrooms: 0,
    garageSpaces: 0,
    builtArea: 0,
    totalArea: 450,
    hasPool: false,
    hasBarbecue: false,
    neighborhood: "Morada da Colina",
  },
  {
    title: "Chácara com sede completa e área de lazer",
    categorySlug: "chacara",
    listingType: "SALE" as const,
    price: 780000,
    bedrooms: 3,
    bathrooms: 2,
    garageSpaces: 4,
    builtArea: 180,
    totalArea: 5000,
    hasPool: true,
    hasBarbecue: true,
    neighborhood: "Cidade Jardim",
  },
  {
    title: "Apartamento para alugar próximo ao shopping",
    categorySlug: "apartamento",
    listingType: "RENT" as const,
    price: 2400,
    bedrooms: 2,
    bathrooms: 1,
    garageSpaces: 1,
    builtArea: 68,
    totalArea: 68,
    hasPool: false,
    hasBarbecue: false,
    neighborhood: "Jardim Karaíba",
  },
  {
    title: "Sala comercial em edifício corporativo",
    categorySlug: "sala-comercial",
    listingType: "RENT" as const,
    price: 3200,
    bedrooms: 0,
    bathrooms: 1,
    garageSpaces: 1,
    builtArea: 45,
    totalArea: 45,
    hasPool: false,
    hasBarbecue: false,
    neighborhood: "Centro",
  },
  {
    title: "Casa de alto padrão com projeto assinado",
    categorySlug: "alto-padrao",
    listingType: "SALE" as const,
    price: 2450000,
    bedrooms: 5,
    bathrooms: 5,
    garageSpaces: 4,
    builtArea: 420,
    totalArea: 600,
    hasPool: true,
    hasBarbecue: true,
    neighborhood: "Santa Mônica",
  },
  {
    title: "Lançamento: apartamentos 2 e 3 quartos",
    categorySlug: "lancamentos",
    listingType: "SALE" as const,
    price: 410000,
    bedrooms: 3,
    bathrooms: 2,
    garageSpaces: 2,
    builtArea: 75,
    totalArea: 75,
    hasPool: true,
    hasBarbecue: true,
    neighborhood: "Segismundo Pereira",
  },
];

async function seedAccessTypes() {
  console.log("Seeding default access types...");
  await prisma.accessType.upsert({
    where: { name: "Administrador" },
    update: {},
    create: {
      name: "Administrador",
      isSystem: true,
      permissions: {
        HOUSES: { VIEW: true, CREATE: true, EDIT: true, DELETE: true },
        CLIENTS: { VIEW: true },
        AUDIT: { VIEW: true },
        ACCESS: { MANAGE: true },
      },
    },
  });
  await prisma.accessType.upsert({
    where: { name: "Corretor" },
    update: {},
    create: {
      name: "Corretor",
      isSystem: true,
      permissions: {
        HOUSES: { VIEW: true, CREATE: true, EDIT: true, DELETE: false },
        CLIENTS: { VIEW: true },
        AUDIT: { VIEW: false },
        ACCESS: { MANAGE: false },
      },
    },
  });
}

async function main() {
  await seedAccessTypes();

  console.log("Seeding categories...");
  const categories = await Promise.all(
    CATEGORIES.map((name, index) =>
      prisma.category.upsert({
        where: { slug: slugify(name) },
        update: { order: index },
        create: { name, slug: slugify(name), order: index },
      }),
    ),
  );
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

  console.log("Seeding demo houses...");
  for (const [index, demo] of DEMO_HOUSES.entries()) {
    const category = categoryBySlug.get(demo.categorySlug);
    if (!category) continue;

    const slug = `${slugify(demo.title)}-${index}`;
    const existing = await prisma.house.findUnique({ where: { slug } });
    if (existing) continue;

    const house = await prisma.house.create({
      data: {
        title: demo.title,
        slug,
        description:
          "Imóvel com excelente localização, acabamento de qualidade e infraestrutura completa. Agende uma visita e conheça de perto todos os diferenciais deste imóvel em Uberlândia - MG.",
        price: demo.price,
        listingType: demo.listingType,
        status: "PUBLISHED",
        address: `Rua Exemplo, ${100 + index}`,
        neighborhood: demo.neighborhood,
        city: "Uberlândia",
        state: "MG",
        zipCode: "38400-000",
        latitude: -18.9186 + index * 0.01,
        longitude: -48.2772 + index * 0.01,
        builtArea: demo.builtArea,
        totalArea: demo.totalArea,
        bedrooms: demo.bedrooms,
        bathrooms: demo.bathrooms,
        garageSpaces: demo.garageSpaces,
        hasPool: demo.hasPool,
        hasBarbecue: demo.hasBarbecue,
        condoFee: demo.categorySlug === "apartamento" ? 450 : null,
        iptu: 120,
        tags: demo.hasPool ? ["piscina", "lazer"] : [],
        publishedAt: new Date(),
        categoryId: category.id,
        images: {
          create: [0, 1, 2].map((i) => ({
            key: `demo/${slug}-${i}.jpg`,
            url: `https://picsum.photos/seed/${slug}-${i}/1200/800`,
            isCover: i === 0,
            order: i,
            type: "image/jpeg",
          })),
        },
      },
    });
    console.log(`Created house: ${house.title}`);
  }

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
