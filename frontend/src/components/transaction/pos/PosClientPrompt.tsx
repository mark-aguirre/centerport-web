"use client";

import { ClipboardPlus, Leaf } from "lucide-react";

import { posArt } from "@/components/transaction/pos/pos-theme";

/**
 * Empty state shown in the product area until a client is chosen.
 *
 * Selecting a client is the prerequisite for adding products, and the client
 * search already sits in the welcome hero above — so this panel points back up
 * there rather than duplicating the control. A faint medical-cross pattern
 * (`pos_banner_3.png`) keeps the large blank panel from reading as a loading
 * state, and the clinic line closes it out.
 */
export function PosClientPrompt() {
  return (
    <div className="relative flex h-full min-h-72 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#118a57]/25 bg-white/70 px-6 py-12 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: posArt("crosses") }}
      />

      <div className="relative flex flex-col items-center">
        {/* Clipboard-and-leaf mark: a soft green blob behind a white card, with
            a leaf tucked beside it. Decorative, so it is hidden from screen
            readers — the heading below carries the message. */}
        <div aria-hidden="true" className="relative mb-6 h-28 w-36">
          <span className="absolute left-1/2 top-1/2 h-24 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#118a57]/8 blur-xl" />
          <span className="absolute left-4 top-1 flex h-24 w-20 items-center justify-center rounded-xl border-2 border-[#0f4435]/20 bg-white shadow-sm">
            <ClipboardPlus
              className="h-10 w-10 text-[#118a57]"
              strokeWidth={1.75}
            />
          </span>
          <Leaf
            className="absolute bottom-1 right-3 h-11 w-11 -rotate-12 text-[#2f8f6a]"
            strokeWidth={1.5}
          />
        </div>

        <p className="text-xl font-bold text-[#0f4435]">
          Select a client to begin
        </p>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#0f4435]/65">
          Use the search field above to find a client by name, application
          number, or agency — or add a new out-patient if they aren&apos;t
          registered yet.
        </p>

        <span
          aria-hidden="true"
          className="mt-7 h-px w-12 bg-[#0f4435]/15"
        />
        <p
          aria-hidden="true"
          className="mt-5 text-sm font-medium italic text-[#2f8f6a]"
        >
          Your Partner in Healthier Communities
        </p>
      </div>
    </div>
  );
}
