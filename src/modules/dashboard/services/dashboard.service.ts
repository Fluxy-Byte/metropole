import { prisma } from "@/lib/prisma";
import { houseRepository } from "@/modules/houses/repository/house.repository";
import { clientRepository } from "@/modules/clients/repository/client.repository";
import { CACHE_KEYS, cacheWrap } from "@/lib/redis";

function monthsAgo(n: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - n);
  return date;
}

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setDate(1);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

async function monthlySeries() {
  const months: { label: string; start: Date; end: Date }[] = [];
  for (let i = 5; i >= 0; i--) {
    const start = startOfDay(monthsAgo(i));
    const end = i === 0 ? new Date() : startOfDay(monthsAgo(i - 1));
    months.push({
      label: start.toLocaleDateString("pt-BR", { month: "short" }),
      start,
      end,
    });
  }

  const series = await Promise.all(
    months.map(async ({ label, start, end }) => {
      const [houses, interests] = await Promise.all([
        prisma.house.count({ where: { createdAt: { gte: start, lt: end } } }),
        prisma.interest.count({ where: { createdAt: { gte: start, lt: end } } }),
      ]);
      return { month: label, houses, interests };
    }),
  );

  return series;
}

export const dashboardService = {
  async getSummary() {
    return cacheWrap(CACHE_KEYS.dashboard("summary"), 120, async () => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const [totalHouses, totalClients, newClients, newHouses, totalInterests, conversions, chart] =
        await Promise.all([
          houseRepository.countAll(),
          clientRepository.countAll(),
          clientRepository.countCreatedSince(thirtyDaysAgo),
          houseRepository.countCreatedSince(thirtyDaysAgo),
          prisma.interest.count(),
          prisma.interest.count({ where: { stage: "WON" } }),
          monthlySeries(),
        ]);

      return {
        totalHouses,
        totalClients,
        newClients,
        newHouses,
        totalInterests,
        conversions,
        conversionRate: totalInterests > 0 ? Number(((conversions / totalInterests) * 100).toFixed(1)) : 0,
        chart,
      };
    });
  },
};
