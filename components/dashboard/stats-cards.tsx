"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FileText, Users, Receipt } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

export function StatsCards() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total de Productos",
      value: stats?.totalProducts || 0,
      description:
        stats?.totalProducts === 0
          ? "No hay productos disponibles"
          : `${stats?.totalProducts} productos disponibles`,
      icon: Package,
    },
    {
      title: "Total de Plantillas",
      value: stats?.totalTemplates || 0,
      description:
        stats?.totalTemplates === 0
          ? "No hja plantillas disponibles"
          : `${stats?.totalTemplates} plantillas creadas`,
      icon: FileText,
    },
    {
      title: "Total de Facturas",
      value: stats?.totalInvoices || 0,
      description:
        stats?.totalInvoices === 0
          ? "No hay facturas disponibles"
          : `${stats?.totalInvoices} facturas creadas`,
      icon: Receipt,
    },
    {
      title: "Total de Usuarios",
      value: stats?.totalUsers || 0,
      description:
        stats?.totalUsers === 1
          ? "Administrador"
          : `${stats?.totalUsers} usuarios registrados`,
      icon: Users,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
