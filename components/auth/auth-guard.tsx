"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { RedirectHandler } from "./redirect-handler";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
  fallbackTo?: string;
}

export function AuthGuard({
  children,
  requireAuth = true,
  requireAdmin = false,
  redirectTo = "/dashboard",
  fallbackTo = "/auth/signin",
}: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (requireAuth && status === "unauthenticated") {
      router.push(fallbackTo);
      return;
    }

    if (requireAdmin && session?.user.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }

    if (!requireAuth && status === "authenticated") {
      router.push(redirectTo);
      return;
    }
  }, [
    status,
    session,
    requireAuth,
    requireAdmin,
    router,
    redirectTo,
    fallbackTo,
  ]);

  if (status === "loading") {
    return <RedirectHandler loadingMessage="Checking authentication..." />;
  }

  if (requireAuth && status === "unauthenticated") {
    return (
      <RedirectHandler
        redirectTo={fallbackTo}
        loadingMessage="Redirigiendo a inicio de sesión..."
      />
    );
  }

  if (requireAdmin && session?.user.role !== "ADMIN") {
    return (
      <RedirectHandler
        redirectTo="/dashboard"
        loadingMessage="Permisos insuficientes..."
      />
    );
  }

  if (!requireAuth && status === "authenticated") {
    return (
      <RedirectHandler
        redirectTo={redirectTo}
        loadingMessage="Redirigiendo a la página principal..."
      />
    );
  }

  return <>{children}</>;
}
