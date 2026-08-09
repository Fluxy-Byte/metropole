import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const email = process.argv[2];
if (!email) {
  console.error("Usage: tsx scripts/promote-admin.ts <email>");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

prisma.user
  .update({ where: { email }, data: { role: "ADMIN" } })
  .then((u) => console.log("promoted", u.email, u.role))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
