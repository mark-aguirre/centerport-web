import { Loader2 } from "lucide-react";

/**
 * Shared route-level loading fallback.
 *
 * Rendered by each route's `loading.tsx` file. Next.js shows this instantly
 * while the route segment streams in, so users get immediate feedback on
 * navigation instead of a blank content area. Mirrors the centered spinner
 * pattern already used in per-page Suspense fallbacks.
 */
export function RouteLoading() {
  return (
    <div
      className="flex items-center justify-center py-32"
      role="status"
      aria-label="Loading"
    >
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
