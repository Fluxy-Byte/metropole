"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  houses: { label: "Novos imóveis", color: "var(--chart-1)" },
  interests: { label: "Interesses", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function DashboardChart({ data }: { data: { month: string; houses: number; interests: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desempenho dos últimos 6 meses</CardTitle>
        <CardDescription>Novos imóveis cadastrados e interesses gerados por mês</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={32} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="houses" fill="var(--color-houses)" radius={4} />
            <Bar dataKey="interests" fill="var(--color-interests)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
