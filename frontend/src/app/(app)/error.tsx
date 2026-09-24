"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, TriangleAlert } from "lucide-react";
import { ApiError } from "@/lib/http-client";
import { Button } from "@/components/ui/button";

/**
 * Error boundary for the authenticated `(app)` route group.
 *
 * Its primary job is to turn a backend authorization failure into a calm,
 * on-brand screen instead of an uncaught `ApiError` in the console. The backend
 * is the source of truth for access control and returns **403 Forbidden** when
 * a user hits a module endpoint their roles don't cover (e.g. a non-ACCOUNTING
 * user reaching a billing page via a direct URL or a stale nav link). The
 * frontend role map in `lib/roles.ts` hides those nav items, but this boundary
 * is the safety net for any path that slips through.
 *
 * A 403 is treated as "not authorized" (no retry — retrying can't grant a role;
 * we offer a way back to the dashboard). Any other error keeps the generic
 * "something went wrong" affordance with a retry, per the Next.js convention.
 *
 * @see error.js file convention (Next.js 16 App Router)
 */
export default function AppError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const router = useRouter();
  const isForbidden = error instanceof ApiError && error.status === 403;

  useEffect(() => {
    // A 403 is an expected authorization outcome, not a defect — log it at a
    // lower severity so it doesn't masquerade as a crash. Everything else is a
    // real error worth surfacing to the console / error reporting.
    if (isForbidden) {
      console.warn("Access denied (403):", error.message);
    } else {
      console.error(error);
    }
  }, [error, isForbidden]);

  if (isForbidden) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="h-7 w-7" />
        </span>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">You don&apos;t have access to this page</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Your account role doesn&apos;t permit this section. If you think this
            is a mistake, ask an administrator to review your access.
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard")}>
          Back to dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <TriangleAlert className="h-7 w-7" />
      </span>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          {error.message || "An unexpected error occurred while loading this page."}
        </p>
      </div>
      <Button onClick={() => unstable_retry()}>Try again</Button>
    </div>
  );
}
