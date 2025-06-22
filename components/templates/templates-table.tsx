"use client";

import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Template } from "@/types/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { EditTemplateDialog } from "./edit-template-dialog";
import dayjs from "dayjs";

interface TemplatesTableProps {
  templates: Template[];
  isLoading: boolean;
}

export function TemplatesTable({ templates, isLoading }: TemplatesTableProps) {
  const { data: session } = useSession();

  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const isAdmin = session?.user.role === "ADMIN";

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/templates/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Fallo al eliminar plantilla");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      queryClient.invalidateQueries({ queryKey: ["recent-activity"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("La plantilla ha sido eliminada", {
        description: "Se ha eliminado la plantilla con éxito",
      });
    },
    onError: (error) => {
      toast.error("Fallo al eliminar la plantilla", {
        description: error.message,
      });
    },
  });

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = (open: boolean) => {
    setEditDialogOpen(open);
    if (!open) {
      setEditingTemplate(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Plantillas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  console.log(templates);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Plantillas ({templates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Fecha de creación</TableHead>
                <TableHead>Última modificación</TableHead>
                {isAdmin && <TableHead>Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      {template.templateProducts.map((tp) => (
                        <div key={tp.product.id} className="text-sm">
                          {tp.product.name} (x{tp.quantity})
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {dayjs(template.createdAt).format("HH:mm - DD/MM/YYYY")}
                  </TableCell>
                  <TableCell>
                    {dayjs(template.updatedAt).format("HH:mm - DD/MM/YYYY")}
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(template)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(template.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditTemplateDialog
        open={editDialogOpen}
        onOpenChange={handleEditDialogClose}
        template={editingTemplate}
      />
    </>
  );
}
