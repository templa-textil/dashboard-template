"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { TemplatesTable } from "@/components/templates/templates-table";
import { CreateTemplateDialog } from "@/components/templates/create-template-dialog";
import { Plus } from "lucide-react";

export default function TemplatesPage() {
  const { data: session } = useSession();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: templates, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const response = await fetch("/api/templates");
      if (!response.ok) throw new Error("Fallo al obtener plantillas");
      return response.json();
    },
  });

  const isAdmin = session?.user.role === "ADMIN";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Plantillas</h2>
          <p className="text-muted-foreground">
            Administre sus plantillas de productos
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Crear plantilla
          </Button>
        )}
      </div>

      <TemplatesTable templates={templates || []} isLoading={isLoading} />

      <CreateTemplateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
