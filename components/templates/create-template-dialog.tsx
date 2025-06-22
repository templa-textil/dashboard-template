"use client";

import type React from "react";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface SelectedProduct {
  productId: string;
  name: string;
  quantity: number;
}

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTemplateDialog({
  open,
  onOpenChange,
}: CreateTemplateDialogProps) {
  const [templateName, setTemplateName] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );
  const queryClient = useQueryClient();

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Fallo al obtener los productos");
      return response.json();
    },
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Fallo al crear la plantilla");
      return response.json();
    },
    onSuccess: (newTemplate) => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      queryClient.invalidateQueries({ queryKey: ["recent-activity"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setTemplateName("");
      setSelectedProducts([]);
      onOpenChange(false);
      toast.success("La plantilla ha sido creada con éxito", {
        description: `${newTemplate.name} fue actualizada con ${selectedProducts.length} productos`,
      });
    },
    onError: (error) => {
      toast.error("Fallo al crear la plantilla", {
        description: error.message,
      });
    },
  });

  const addProduct = (product: Product) => {
    const existing = selectedProducts.find((p) => p.productId === product.id);
    if (existing) {
      setSelectedProducts((prev) =>
        prev.map((p) =>
          p.productId === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setSelectedProducts((prev) => [
        ...prev,
        { productId: product.id, name: product.name, quantity: 1 },
      ]);
    }
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.filter((p) => p.productId !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeProduct(productId);
    } else {
      setSelectedProducts((prev) =>
        prev.map((p) => (p.productId === productId ? { ...p, quantity } : p))
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (templateName && selectedProducts.length > 0) {
      createMutation.mutate({
        name: templateName,
        products: selectedProducts,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Plantilla</DialogTitle>
          <DialogDescription>
            Cree una nueva plantilla seleccionando productos y la cantidad que
            desee
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex justify-start items-center gap-4">
              <Label
                htmlFor="name"
                className="whitespace-nowrap w-[180px] text-right"
              >
                Nombre de la Plantilla
              </Label>
              <Input
                id="name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Productos disponibles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                  {products?.map((product: Product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Stock: {product.quantity}
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addProduct(product)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Productos seleccionados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedProducts.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No hay productos seleccionados
                    </p>
                  ) : (
                    selectedProducts.map((product) => (
                      <div
                        key={product.productId}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{product.name}</div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Label className="text-xs">Cantidad:</Label>
                            <Input
                              type="number"
                              min="1"
                              value={product.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  product.productId,
                                  Number.parseInt(e.target.value) || 0
                                )
                              }
                              className="w-16 h-6 text-xs"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => removeProduct(product.productId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-[150px]"
              disabled={
                createMutation.isPending ||
                !templateName ||
                selectedProducts.length === 0
              }
            >
              {createMutation.isPending ? "Creando..." : "Crear Plantilla"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
