"use client";

import { useSyncExternalStore } from "react";
import { format } from "date-fns";
import { CalendarDays, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** No-op subscription: the date is read once per render, never pushed. */
const NO_SUBSCRIBE = () => () => {};

/** Today's date as the browser sees it, e.g. "Saturday, Oct 24, 2026". */
const readToday = () => format(new Date(), "EEEE, MMMM d, yyyy");

/**
 * Server snapshot for the date.
 *
 * `null` because the server and the browser can sit in different time zones.
 * Rendering nothing server-side and filling the date in on the client keeps
 * the markup identical through hydration.
 */
const readTodayOnServer = () => null;

interface PageBannerProps {
  /** Page title, rendered as the band's `h1`. */
  title: string;
  /** One-line description shown under the title. */
  subtitle?: string;
  /** Icon for the tile left of the title. */
  icon: LucideIcon;
  /** Second line of the date card. */
  dateNote?: string;
  /** Extra classes for the band itself. */
  className?: string;
}

/**
 * Full-bleed page banner — the dashboard's welcome band generalized for
 * ordinary pages.
 *
 * Carries the same treatment as {@link WelcomeBanner}: the vessel photo in
 * `public/dashboard-banner.jpg` runs the width of the band under a scrim that
 * washes it towards the card colour, with the page title over it and today's
 * date on the right.
 *
 * Differences from the dashboard band, both deliberate:
 * - The photo is anchored bottom-**right** here, because this band leads with
 *   an icon-and-title pair at the left edge rather than a greeting inset past
 *   the hull. The scrim runs the other way to match — heaviest over the text,
 *   lightest over the vessel.
 * - Content is reserved away from the hull with right padding instead of the
 *   dashboard's left inset.
 *
 * The backdrop is a CSS background rather than a `next/image`, which keeps it
 * off the image optimizer — the standalone production build would otherwise
 * need `sharp` in the runtime image to serve it. Below `md` the visible slice
 * is too thin to read as a picture, so the container's gradient shows instead.
 *
 * ## Full-bleed contract
 *
 * The negative insets cancel the host page's own padding so the band meets the
 * left, right, and top edges of the content area. A page using this component
 * must therefore:
 * 1. be listed among the zero-gutter routes in `app-layout.tsx`, since a
 *    gutter on `<main>` cannot be cancelled from inside the page, and
 * 2. put its own side gutter on `PageContainer` as `px-[24px]`, which the
 *    `-mx-[24px]` below mirrors.
 *
 * Both values are px, not rem: `html` sits at 90% font size, so a rem inset
 * would not cancel cleanly. Keep them in step.
 *
 * The date is resolved on the client because the server and the browser can
 * sit in different time zones, which would otherwise produce a hydration
 * mismatch on the one piece of text most likely to differ.
 */
export function PageBanner({
  title,
  subtitle,
  icon: Icon,
  dateNote = "Have a productive day",
  className,
}: PageBannerProps) {
  const today = useSyncExternalStore(
    NO_SUBSCRIBE,
    readToday,
    readTodayOnServer
  );

  return (
    <div
      className={cn(
        "relative -mx-[24px] -mt-[10px] overflow-hidden border-b border-border",
        "bg-gradient-to-l from-primary/12 via-primary/5 to-card",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-[url('/dashboard-banner.jpg')] bg-cover bg-bottom-right bg-no-repeat md:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-card/90 via-card/60 to-card/25 md:block"
      />

      <div className="relative flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:gap-6 md:pr-[18%]">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/15">
            <Icon className="h-5 w-5 text-primary" />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-tight">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5 md:border-l md:border-border/60 md:pl-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-card/80 shadow-sm">
            <CalendarDays className="h-4 w-4 text-primary" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-xs font-semibold">{today ?? "\u00A0"}</span>
            <span className="text-[11px] text-muted-foreground">
              {dateNote}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
