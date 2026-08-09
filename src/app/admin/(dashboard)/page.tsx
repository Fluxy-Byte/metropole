import type { Metadata } from "next";
import { dashboardService } from "@/modules/dashboard/services/dashboard.service";
import { DashboardKpis } from "@/modules/dashboard/components/dashboard-kpis";
import { DashboardChart } from "@/modules/dashboard/components/dashboard-chart";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const summary = await dashboardService.getSummary();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral da operação da Metrópole Imóveis</p>
      </div>

      <DashboardKpis data={summary} />
      <DashboardChart data={summary.chart} />
    </div>
  );
}
