"use client";

import type { ReactNode } from "react";
import { Heart } from "lucide-react";

import { posArt, type PosArt } from "@/components/transaction/pos/pos-theme";
import { cn } from "@/lib/utils";

interface PosPageBannerProps {
  /** Page name, e.g. "Transactions". */
  title: string;
  /** One line on what the page shows. */
  description: string;
  /**
   * Which artwork backs the band. Defaults to the blurred clinic interior,
   * which is the quietest of the set behind a long title.
   */
  art?: PosArt;
  /**
   * Page-level actions, placed opposite the title. Supplying them replaces the
   * script clinic line, which would otherwise sit under the buttons.
   */
  actions?: ReactNode;
}

/**
 * Titled banner for the POS workspace's embedded views.
 *
 * A full-bleed band that replaces the plain `PageTitle` inside the POS zone:
 * the page name and its one-line description on the left, a photographic clinic
 * backdrop filling the right, and the clinic line set in script over it.
 *
 * Notes on the layout:
 * - The negative insets cancel the scroll container's `p-4`, so the band meets
 *   the top, left, and right edges of the content area while the cards below it
 *   keep their gutter. All in px, since `html` sits at 90% font size and a rem
 *   inset would not cancel cleanly.
 * - A left-to-right scrim washes the photo towards mint, heaviest behind the
 *   title, so the text keeps full contrast at any width.
 * - Below `md` the visible slice is too thin to read as a photo, so only the
 *   gradient shows; the script line drops out below `lg`.
 */
export function PosPageBanner({
  title,
  description,
  art = "lobby",
  actions,
}: PosPageBannerProps) {
  return (
    <div className="relative -mx-[16px] -mt-[16px] overflow-hidden border-b border-[#0f4435]/10 bg-gradient-to-r from-[#f1f8f4] via-[#f6fbf8] to-[#eaf4ef]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-3/4 bg-cover bg-center bg-no-repeat md:block"
        style={{ backgroundImage: posArt(art) }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-[#f1f8f4] via-[#f1f8f4]/80 to-transparent md:block"
      />

      {/* Clinic line in script, set clear of both the title and the right edge
          of the photo. Decorative, so it is hidden from assistive tech. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute right-[18%] top-1/2 hidden -translate-y-1/2 flex-col items-center",
          !actions && "lg:flex"
        )}
      >
        <p
          className="text-center text-lg leading-snug text-[#2f8f6a]"
          style={{ fontFamily: "'Segoe Script', 'Brush Script MT', cursive" }}
        >
          Care
          <br />
          Today.
          <br />
          A Healthier
          <br />
          Tomorrow.
        </p>
        <Heart className="mt-1 h-5 w-5 text-[#2f8f6a]/80" strokeWidth={1.5} />
      </div>

      <div className="relative flex flex-col gap-4 px-6 py-7 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-3xl font-bold tracking-tight text-[#0f4435]">
            {title}
          </h2>
          <p className="mt-1.5 text-sm text-[#0f4435]/70">{description}</p>
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
