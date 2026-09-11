/**
 * Shared helpers for resolving patient/seafarer photo URLs and embedding them
 * inline as base64 data URLs in PrintIO payloads.
 *
 * Used by the per-domain print dialogs (landbase, MLC, …) that flatten a record
 * into a PrintIO template payload. Kept framework-agnostic (no React) so it can
 * be imported from both payload builders and components.
 */

/**
 * Same-origin base for backend assets. Photos are served by the backend but
 * fetched through the Next.js proxy route (`/api/backend/[...path]`) so the
 * browser never talks to the backend host directly — the same rule the JSON
 * API client follows.
 */
const API_BASE = "/api/backend";

/**
 * Resolve a photo URL, prepending the proxy base when the value is a relative
 * path. Absolute `http(s)` URLs are returned unchanged; empty/undefined values
 * yield an empty string.
 *
 * @param url - A relative or absolute photo URL, or `undefined`
 * @returns A proxy-routed URL, or `""` when there is nothing to resolve
 */
export function resolvePhotoUrl(url: string | undefined): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

/**
 * Memoizes resolved photo → base64 conversions so printing several reports for
 * the same record (or reprinting one) reuses a single fetch + encode instead of
 * paying that round-trip on every print. Keyed by the resolved URL.
 */
const photoBase64Cache = new Map<string, Promise<string>>();

/**
 * Fetches an image from a URL and returns it as a base64 data URL.
 *
 * Resolves relative URLs against the API base, dedupes concurrent/repeat calls
 * via an in-memory cache, and returns an empty string if the URL is empty or
 * the fetch/encode fails (failed results are not cached, so a later retry can
 * succeed).
 *
 * @param url - A relative or absolute photo URL, or `undefined`
 * @returns A base64 data URL, or `""` when unavailable
 */
export function fetchPhotoAsBase64(url: string | undefined): Promise<string> {
  const resolved = resolvePhotoUrl(url);
  if (!resolved) return Promise.resolve("");

  const cached = photoBase64Cache.get(resolved);
  if (cached) return cached;

  const request = (async () => {
    try {
      const response = await fetch(resolved);
      if (!response.ok) return "";

      const blob = await response.blob();
      return await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve("");
        reader.readAsDataURL(blob);
      });
    } catch {
      return "";
    }
  })();

  // Cache the in-flight promise so concurrent/repeat calls dedupe; drop it on a
  // failed/empty result so a later retry can succeed.
  photoBase64Cache.set(resolved, request);
  void request.then((value) => {
    if (!value) photoBase64Cache.delete(resolved);
  });

  return request;
}
