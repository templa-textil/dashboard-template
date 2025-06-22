"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TemplateProduct } from "@/types/api";

interface Template {
  id: string;
  name: string;
  templateProducts: Array<{
    quantity: number;
    product: {
      id: string;
      name: string;
      price: number;
    };
  }>;
}

export default function FacturationPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  const { data: templates } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const response = await fetch("/api/templates");
      if (!response.ok) throw new Error("Fallo al obtener plantillas");
      return response.json();
    },
  });

  const selectedTemplate = templates?.find(
    (t: Template) => t.id === selectedTemplateId
  );

  const calculateTotal = (template: Template) => {
    return template.templateProducts.reduce((total, tp) => {
      return total + tp.product.price * tp.quantity;
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Facturación</h2>
        <p className="text-muted-foreground">
          Genere facturas desde sus plantillas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seleccione una plantilla</CardTitle>
          <CardDescription>
            Seleccione una plantilla para calcular su precio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedTemplateId}
            onValueChange={setSelectedTemplateId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione una plantilla" />
            </SelectTrigger>
            <SelectContent>
              {templates?.map((template: Template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>Previsualización de la Plantilla</CardTitle>
            <CardDescription>
              Plantilla: {selectedTemplate.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Productos:</h4>
              {selectedTemplate.templateProducts.map((tp: TemplateProduct) => (
                <div
                  key={tp.product.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center space-x-2">
                    <span>{tp.product.name}</span>
                    <Badge variant="secondary">x{tp.quantity}</Badge>
                  </div>
                  <div className="text-right">
                    <div>${tp.product.price.toFixed(2)} cada uno</div>
                    <div className="font-semibold">
                      ${(tp.product.price * tp.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${calculateTotal(selectedTemplate).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
