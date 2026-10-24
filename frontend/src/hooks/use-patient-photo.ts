"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";

/**
 * Resolved photo URLs keyed by seafarer profile UUID.
 *
 * Module-level so switching between records (or between modules) does not
 * refetch a profile whose photo is already known. An empty string is cached
 * too — it means "this patient has no photo", which is just as worth
 * remembering as a hit.
 */
const photoCache = new Map<string, string>();

/**
 * Photo URL of the seafarer behind a module record.
 *
 * Some module records (e.g. the Panama certificate) store only the seafarer's
 * profile UUID and none of the display fields, so the photo has to come from
 * the profile itself. Modules whose record already carries `photo_url` should
 * use that directly instead of calling this.
 *
 * @param profileId - `seafarer_profile_id` of the loaded record
 * @returns the profile's photo URL, `""` when the patient has none, or
 *          `undefined` while it is still being resolved
 */
export function usePatientPhoto(profileId?: string): string | undefined {
  const [photo, setPhoto] = useState<{ id: string; url: string } | null>(null);

  useEffect(() => {
    if (!profileId) return;

    let cancelled = false;
    const cached = photoCache.get(profileId);

    // A cache hit still resolves through a promise so the state update never
    // happens synchronously inside the effect.
    const load =
      cached !== undefined
        ? Promise.resolve(cached)
        : api.entities.SeafarerProfile.filter({ id: profileId }).then((rows) => {
            const url = rows[0]?.photo_url ?? "";
            photoCache.set(profileId, url);
            return url;
          });

    load
      .then((url) => {
        if (!cancelled) setPhoto({ id: profileId, url });
      })
      .catch((error: unknown) => {
        console.warn(
          "Failed to load patient photo:",
          error instanceof Error ? error.message : error
        );
      });

    return () => {
      cancelled = true;
    };
  }, [profileId]);

  // Ignore a photo resolved for a previously loaded patient.
  return photo && photo.id === profileId ? photo.url : undefined;
}
