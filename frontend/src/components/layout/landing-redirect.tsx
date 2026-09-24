"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

/**
 * Role-based landing redirect.
 *
 * After login the app sends every user to `/dashboard` (see `app/page.tsx`).
 * Some roles have no dashboard access and should instead land on their primary
 * workspace. Currently this applies to ACCOUNTING users, who are redirected to
 * the sales/POS screen (`/sale`).
 *
 * The redirect only fires on the dashboard landing route so it never fights
 * with intentional in-app navigation (an ACCOUNTING user can still open other
 * pages they have access to). ADMIN keeps the dashboard because ADMIN can
 * access every route.
 */
export function LandingRedirect() {
  const { user, roles } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      return;
    }
    const isAdmin = roles.includes("ADMIN");
    const isAccounting = roles.includes("ACCOUNTING");

    if (!isAdmin && isAccounting && pathname === "/dashboard") {
      router.replace("/sale");
    }
  }, [user, roles, pathname, router]);

  return null;
}
