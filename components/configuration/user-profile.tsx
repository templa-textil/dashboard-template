"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Calendar, Shield } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export function UserProfile() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user.name || "");
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await fetch(`/api/users/${session?.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Fallo al actualizar el perfil");
      return response.json();
    },
    onSuccess: (updatedUser) => {
      // Update the session
      update({ name: updatedUser.name });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsEditing(false);
      toast.success("Perfil actualizado correctamente", {
        description: "El perfil ha sido actualizado con éxito",
      });
    },
    onError: (error) => {
      toast.error("Fallo al actualizar el perfil", {
        description: error.message,
      });
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate({ name });
  };

  const handleCancel = () => {
    setName(session?.user.name || "");
    setIsEditing(false);
  };

  if (!session?.user) {
    return <div>Cargando...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Mi Perfil
        </CardTitle>
        <CardDescription>
          Maneje su información de personal y la configuración de su cuenta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={session.user.image || ""}
              alt={session.user.name || ""}
            />
            <AvatarFallback className="text-lg">
              {session.user.name
                ? session.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : session.user.email?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">
              {session.user.name || "No name set"}
            </h3>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  session.user.role === "ADMIN" ? "default" : "secondary"
                }
              >
                <Shield className="h-3 w-3 mr-1" />
                {session.user.role}
              </Badge>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre completo</Label>
            {isEditing ? (
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            ) : (
              <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{session.user.name || "No name set"}</span>
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Dirección de correo</Label>
            <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{session.user.email}</span>
              <Badge variant="outline" className="ml-auto">
                Verified
              </Badge>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Cuenta creada</Label>
            <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Miembro desde {format(new Date(), "MMMM yyyy")}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending
                  ? "Guardando..."
                  : " Guardar cambios"}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
