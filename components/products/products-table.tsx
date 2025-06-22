"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Check, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import type { Product } from "@/types/api";
import dayjs from "dayjs";

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
}

export function ProductsTable({ products, isLoading }: ProductsTableProps) {
  const { data: session } = useSession();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    quantity: "",
    price: "",
  });
  const queryClient = useQueryClient();

  const isAdmin = session?.user.role === "ADMIN";

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Fallo al actualizar el producto");
      return response.json();
    },
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["recent-activity"] });
      setEditingId(null);
      toast.success("El producto ha sido actualizado", {
        description: `${updatedProduct.name} fue actualizado con éxito`,
      });
    },
    onError: (error) => {
      toast.error("Fallo al actualizar el producto", {
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Fallo al eliminar el producto");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["recent-activity"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("El producto ha sido eliminado", {
        description: "El producto ha sido eliminado con éxito de su inventario",
      });
    },
    onError: (error) => {
      toast.error("Fallo al eliminar el producto", {
        description: error.message,
      });
    },
  });

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      quantity: product.quantity.toString(),
      price: product.price.toString(),
    });
  };

  const saveEdit = () => {
    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        data: editForm,
      });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", quantity: "", price: "" });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos ({products.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Catidad</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead>Ultima Actualización</TableHead>
              {isAdmin && <TableHead>Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {editingId === product.id ? (
                    <Input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                  ) : (
                    product.name
                  )}
                </TableCell>
                <TableCell>
                  {editingId === product.id ? (
                    <Input
                      type="number"
                      value={editForm.quantity}
                      onChange={(e) =>
                        setEditForm({ ...editForm, quantity: e.target.value })
                      }
                    />
                  ) : (
                    product.quantity
                  )}
                </TableCell>

                <TableCell>
                  {editingId === product.id ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editForm.price}
                      onChange={(e) =>
                        setEditForm({ ...editForm, price: e.target.value })
                      }
                    />
                  ) : (
                    `$${product.price.toFixed(2)}`
                  )}
                </TableCell>
                <TableCell>
                  {dayjs(product.createdAt).format("HH:mm - DD/MM/YYYY")}
                </TableCell>
                <TableCell>
                  {dayjs(product.updatedAt).format("HH:mm - DD/MM/YYYY")}
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    {editingId === product.id ? (
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={saveEdit}
                          disabled={updateMutation.isPending}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEdit}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(product.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
