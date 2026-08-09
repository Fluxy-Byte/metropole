import { Building2, Users, UserPlus, Home, Heart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KpiData {
  totalHouses: number;
  totalClients: number;
  newClients: number;
  newHouses: number;
  totalInterests: number;
  conversionRate: number;
}

export function DashboardKpis({ data }: { data: KpiData }) {
  const items = [
    { label: "Total de imóveis", value: data.totalHouses, icon: Building2 },
    { label: "Clientes", value: data.totalClients, icon: Users },
    { label: "Novos clientes (30d)", value: data.newClients, icon: UserPlus },
    { label: "Novos imóveis (30d)", value: data.newHouses, icon: Home },
    { label: "Interesses", value: data.totalInterests, icon: Heart },
    { label: "Taxa de conversão", value: `${data.conversionRate}%`, icon: TrendingUp },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {item.label}
            </CardTitle>
            <item.icon className="size-4 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-bold text-primary">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
