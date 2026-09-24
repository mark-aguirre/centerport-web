"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Ship } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { landingRoute } from "@/lib/roles";

/**
 * Access gate for the dashboard page.
 *
 * The dashboard's widgets (stats strip, recent visits, recent activity) fetch
 * from `/api/dashboard/**`, `/api/visits/**` and the activity feed as soon as
 * they mount. The backend restricts those to ADMIN, INFORMATION, PSYCHOLOGY,
 * LABORATORY and RELEASING, so for any other role (e.g. ACCOUNTING) they return
 * 403 and the dashboard shows "unavailable" everywhere.
 *
 * This gate short-circuits that: a user who cannot access `/dashboard` never
 * renders the widgets (so no 403s are fired) and is redirected to their proper
 * landing route ({@link landingRoute}). The redirect also runs in
 * {@link LandingRedirect} at the layout level, but gating here is what actually
 * stops the child fetches from mounting, and keeps the page correct even if it
 * is reached by direct navigation rather than the post-login landing.
 *
 * While auth is resolving, or while the redirect is in flight, a lightweight
 * splash is shown instead of the dashboard.
 */
export function DashboardGate({ children }: { children: React.ReactNode }) {
  const { loading, roles, canRoute } = useAuth();
  const router = useRouter();

  const allowed = canRoute("/dashboard");

  useEffect(() => {
    if (loading || allowed) {
      return;
    }
    router.replace(landingRoute(roles));
  }, [loading, allowed, roles, router]);

  if (loading || !allowed) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
        <Ship className="h-8 w-8 animate-pulse" />
        <p className="text-sm">Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}
