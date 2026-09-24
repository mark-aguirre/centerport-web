"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { landingRoute } from "@/lib/roles";

/**
 * Role-based landing redirect.
 *
 * After login the app sends every user to `/dashboard` (see `app/page.tsx`).
 * Some roles cannot access the dashboard — the backend restricts
 * `/api/dashboard/**`, so those users only get 403s there. They are redirected
 * to their primary workspace instead (currently ACCOUNTING → `/sale`, via
 * {@link landingRoute}). ADMIN keeps the dashboard because ADMIN can access
 * every route.
 *
 * The redirect only fires on the dashboard landing route so it never fights
 * with intentional in-app navigation (a redirected user can still open other
 * pages they have access to).
 */
export function LandingRedirect() {
  const { user, roles } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user || pathname !== "/dashboard") {
      return;
    }
    const target = landingRoute(roles);
    if (target !== "/dashboard") {
      router.replace(target);
    }
  }, [user, roles, pathname, router]);

  return null;
}
