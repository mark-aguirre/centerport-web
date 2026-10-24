"use client";

import { useSyncExternalStore } from "react";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

/** The clinic's motto, shown as three stacked lines in the banner. */
const MOTTO = ["Healthy People", "Safer Seas", "Brighter Tomorrows"];

/** No-op subscription: the date is read once per render, never pushed. */
const NO_SUBSCRIBE = () => () => {};

/** Today's date as the browser sees it, e.g. "Saturday, Oct 24, 2026". */
const readToday = () => format(new Date(), "EEEE, MMM d, yyyy");

/**
 * Server snapshot for the date.
 *
 * `null` because the server and the browser can sit in different time zones.
 * Rendering nothing server-side and filling the date in on the client keeps
 * the markup identical through hydration.
 */
const readTodayOnServer = () => null;

/**
 * Dashboard greeting banner.
 *
 * A panoramic photo of a vessel at sea (`public/dashboard-banner.jpg`) runs
 * the full width of the band, with the greeting, the clinic motto, and today's
 * date laid over it.
 *
 * Notes on the backdrop:
 * - It is a CSS background rather than a `next/image`, which keeps it off the
 *   image optimizer — the standalone production build would otherwise need
 *   `sharp` in the runtime image to serve it.
 * - The source is cropped so the vessel starts at the left edge and occupies
 *   roughly the first 18% of the width at any viewport size. The greeting is
 *   inset past that point so text never sits on the hull.
 * - It is anchored bottom-left: on very wide screens `cover` trims the
 *   vertical edges, and losing sky costs nothing while the hull and the ice
 *   line carry the image.
 * - A left-to-right scrim washes the photo towards the card colour, lightest
 *   over the vessel and heaviest behind the date, so every piece of text keeps
 *   full contrast.
 * - Below `md` the visible slice is too thin to read as a picture, so the
 *   container's gradient shows instead.
 *
 * The date is resolved on the client because the server and the browser can
 * sit in different time zones, which would otherwise produce a hydration
 * mismatch on the one piece of text most likely to differ.
 */
export function WelcomeBanner() {
  const { user } = useAuth();
  const today = useSyncExternalStore(
    NO_SUBSCRIBE,
    readToday,
    readTodayOnServer
  );

  const displayName = user?.full_name || user?.username || "there";

  return (
    // Full-bleed band: the negative insets cancel the dashboard page's own
    // padding so the banner meets the left, right, and top edges of the
    // content area with no gap, while the widgets below it keep their gutter.
    // `-mx-[24px]` mirrors `px-[24px]` on the dashboard's PageContainer and
    // `-mt-[10px]` its `p-[10px]` top; AppLayout contributes no side gutter on
    // this route. All in px, since `html` sits at 90% font size and a rem
    // inset would not cancel cleanly. The bottom border is kept as the one
    // edge that still separates the banner from anything.
    <div className="relative -mx-[24px] -mt-[10px] overflow-hidden border-b border-border bg-gradient-to-r from-primary/12 via-primary/5 to-card">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-[url('/dashboard-banner.jpg')] bg-cover bg-bottom-left bg-no-repeat md:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-card/20 via-card/55 to-card/85 md:block"
      />

      <div className="relative flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:gap-6 md:pl-[19%]">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">Welcome back,</p>
          <h1 className="truncate text-2xl font-semibold tracking-tight">
            {displayName}
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Here is what is happening at CenterPort today.
          </p>
        </div>

        <p className="hidden shrink-0 flex-col items-center text-center text-xs font-semibold text-primary/85 italic lg:flex">
          <span>&ldquo;{MOTTO[0]}</span>
          {MOTTO.slice(1, -1).map((line) => (
            <span key={line}>{line}</span>
          ))}
          <span>{MOTTO[MOTTO.length - 1]}&rdquo;</span>
        </p>

        <div className="flex shrink-0 items-center gap-2.5 md:border-l md:border-border/60 md:pl-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-card/80 shadow-sm">
            <CalendarDays className="h-4 w-4 text-primary" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-xs font-semibold">{today ?? "\u00A0"}</span>
            <span className="text-[11px] text-muted-foreground">
              Have a productive day
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
