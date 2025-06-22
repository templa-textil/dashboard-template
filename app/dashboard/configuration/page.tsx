"use client";

import { useSession } from "next-auth/react";
import { UserProfile } from "@/components/configuration/user-profile";
import { AdminGuard } from "@/components/auth/admin-guard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/configuration/user-managment";

export default function ConfigurationPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user.role === "ADMIN";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">
          Maneje su perfil
          {isAdmin && " y administre los usuarios"}
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Mi Perfil</TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="users">Manejo de Usuarios</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <UserProfile />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="users" className="space-y-4">
            <AdminGuard>
              <UserManagement />
            </AdminGuard>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
