"use client";

import { Ship } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

/**
 * Blocks rendering of the authenticated app shell until the session is
 * confirmed.
 *
 * While `/api/me` is in flight (or the browser is being redirected to Keycloak
 * for login), a lightweight splash is shown. Once a user is loaded, children
 * render. If loading finished with no user (e.g. backend unreachable), a short
 * message is shown instead of a broken UI.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-background text-muted-foreground">
        <Ship className="h-8 w-8 animate-pulse" />
        <p className="text-sm">Signing you in…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-background text-muted-foreground">
        <Ship className="h-8 w-8" />
        <p className="text-sm">
          Unable to load your session. Please refresh to try again.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
