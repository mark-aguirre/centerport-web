/**
 * Shared visual constants for the counter POS workspace (`/sale`).
 *
 * The POS page is its own visual zone: a clinical green palette and photographic
 * backdrops, deliberately separate from the app-wide `primary` (blue) theme
 * tokens used everywhere else. Keeping the palette and the artwork paths here
 * means the header, rail, hero, tiles, cart panel, and the out-patient dialog
 * can stay in step without each one re-deriving its own greens.
 *
 * Palette, for reference when adding to the zone:
 * - `#0d4238` → `#06251f`  deep clinical green, the rail gradient
 * - `#0f4435`               headline / brand ink
 * - `#2f8f6a`               eyebrow and muted accents
 * - `#118a57` → `#0d7349`  the primary action green (Settle, Register)
 */

/**
 * Decorative artwork, served statically from `public/pos/`.
 *
 * These are CSS backgrounds rather than `next/image` sources, which keeps them
 * off the image optimizer — the standalone production build would otherwise
 * need `sharp` in the runtime image.
 */
export const POS_ART = {
  /** Clinic desk with stethoscope and plant — the wide hero strip. */
  hero: "/pos/pos_banner_1.png",
  /** Soft leaf wash on mint — dialog header bands. */
  leafWash: "/pos/pos_banner_2.png",
  /** Faint medical crosses — empty-state panels. */
  crosses: "/pos/pos_banner_3.png",
  /** Blurred clinic lobby — reserved for wider promo bands. */
  lobby: "/pos/pos_banner_4.png",
  /** Green leaves on mint — the rail watermark. */
  leaves: "/pos/pos_banner_5.png",
} as const;

/** Asset keys accepted by {@link posArt}. */
export type PosArt = keyof typeof POS_ART;

/**
 * A `background-image` value for a POS art asset.
 *
 * Applied through inline `style` rather than a Tailwind arbitrary background
 * utility: the path comes from {@link POS_ART}, and Tailwind only sees
 * arbitrary values written as literal class strings. Do not spell such a
 * utility out in prose here either — the scanner reads comments too, and an
 * illustrative one with a placeholder path becomes a real rule with an
 * unresolvable `url()` that fails the build.
 */
export function posArt(asset: PosArt): string {
  return `url('${POS_ART[asset]}')`;
}

/** Clinic identity shown in the POS header, rail footer, and dialogs. */
export const POS_CLINIC = {
  name: "Healthy People Clinic",
  tagline: "Care Today. A Healthier Tomorrow.",
} as const;

/** Short motto lines stacked in the rail footer. */
export const POS_MOTTO = ["Better Care", "Brighter Tomorrows"] as const;
