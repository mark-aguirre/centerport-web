import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Closing panel for the dashboard's right rail.
 *
 * Carries the clinic's mission statement and a route into the patient
 * directory, giving the column a deliberate end instead of trailing white
 * space. Purely static — no data fetching.
 *
 * The backdrop is a photo of a vessel at anchor
 * (`public/dashboard-banner-2.jpg`), cropped so the vessel sits right of
 * centre and downscaled to 820px for a panel this size. It is a CSS background
 * rather than a `next/image`, which keeps it off the image optimizer — the
 * standalone production build would otherwise need `sharp` in the runtime
 * image to serve it.
 *
 * A light left-to-right scrim in the brand colour sits over it — enough to
 * anchor the white copy on the left, thinning out towards the vessel so the
 * photograph stays a photograph rather than a blue wash. The copy also carries
 * a drop shadow, which is what keeps it legible now that the scrim is this
 * transparent.
 */
export function CommunityCard() {
  return (
    <section className="relative min-h-52 overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-sm">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[url('/dashboard-banner-2.jpg')] bg-cover bg-center bg-no-repeat"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/75 via-primary/45 to-primary/10"
      />

      <div className="relative flex h-full flex-col p-5">
        <h2 className="text-base leading-snug font-medium drop-shadow-sm">
          Together for a
          <br />
          <span className="font-bold">Healthier Maritime Community</span>
        </h2>
        <p className="mt-2 max-w-60 text-xs text-primary-foreground/85 drop-shadow-sm">
          Delivering quality care for seafarers everywhere.
        </p>
        <Link
          href="/profile"
          className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-md transition-colors hover:bg-card/90"
        >
          Browse Patients
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
