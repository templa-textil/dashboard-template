"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, FileText, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function QuickActions() {
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session?.user.role === "ADMIN";

  const actions = [
    {
      title: "Productos",
      description: "Maneje su inventario de productos",
      icon: Package,
      buttonText: isAdmin ? "Agregar Producto" : "Ver Productos",
      onClick: () => router.push("/dashboard/products"),
    },
    {
      title: "Plantillas",
      description: "Cree plantillas reusables de productos",
      icon: FileText,
      buttonText: isAdmin ? "Crear Plantilla" : "Ver Plantillas",
      onClick: () => router.push("/dashboard/templates"),
    },
    {
      title: "Facturación",
      description: "Genere y maneje sus facturas",
      icon: Receipt,
      buttonText: "Generar Factura",
      onClick: () => router.push("/dashboard/facturation"),
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {actions.map((action) => (
        <Card key={action.title}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <action.icon className="h-5 w-5" />
              {action.title}
            </CardTitle>
            <CardDescription>{action.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={action.onClick}>
              <Plus className="mr-2 h-4 w-4" />
              {action.buttonText}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
