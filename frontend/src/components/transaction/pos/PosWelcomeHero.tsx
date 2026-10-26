"use client";

import type { ReactNode } from "react";

import { posArt } from "@/components/transaction/pos/pos-theme";

interface PosWelcomeHeroProps {
  /**
   * The client-entry row laid over the hero — the client search field and the
   * Add Out-Patient action. Passed as children so the `/sale` page keeps
   * ownership of the search state and the dialog trigger.
   */
  children: ReactNode;
}

/**
 * Welcome band at the top of the POS workspace.
 *
 * Opens the counter with the clinic's promise and the one control the operator
 * needs first: find the client. A photo of a clinic desk (`pos_banner_1.png`)
 * fills the right side of the band and is washed towards white across the
 * middle, so the headline and the search field below it keep full contrast
 * regardless of how wide the band gets.
 *
 * Notes on the backdrop:
 * - It is a CSS background rather than a `next/image`, which keeps it off the
 *   image optimizer (see `pos-theme.ts`).
 * - It is anchored right: the source is mostly empty wall on the left, so
 *   cropping from that side costs nothing while the stethoscope and the plant
 *   stay in frame.
 * - Below `md` the band is too narrow for the photo to read as a picture, so
 *   only the mint gradient shows.
 */
export function PosWelcomeHero({ children }: PosWelcomeHeroProps) {
  return (
    <div className="relative shrink-0 overflow-hidden rounded-xl border border-[#0f4435]/10 bg-gradient-to-r from-[#f1f8f4] via-[#f7fbf9] to-[#eaf4ef] shadow-sm">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-3/5 bg-cover bg-right bg-no-repeat md:block"
        style={{ backgroundImage: posArt("hero") }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-[#f4faf7] via-[#f4faf7]/85 to-transparent md:block"
      />

      <div className="relative px-6 py-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#2f8f6a]">
          Welcome to CenterPort
        </p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#0f4435] lg:text-4xl">
          Care Made Simple
        </h2>
        <p className="mt-1.5 text-sm text-[#0f4435]/70">
          Fast, reliable and secure billing for a healthier tomorrow.
        </p>

        <div className="mt-5 max-w-3xl">{children}</div>
      </div>
    </div>
  );
}
