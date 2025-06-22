"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth/auth-guard";

function SignInContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (result?.ok && !result?.error) {
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        console.error("El inicio de sesión fallo:", result?.error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("El inicio de sesión fallo:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Bienvenido</CardTitle>
          <CardDescription>Ingrese con su cuenta de Google</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleSignIn}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Ingresando..." : "Login con Google"}
          </Button>
          {isLoading && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Espere mientras lo redireccionamos...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignIn() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/dashboard">
      <SignInContent />
    </AuthGuard>
  );
}
