/**
 * Client-side helper for generating a report PDF via the Next.js print routes.
 *
 * Every domain print dialog (landbase, MLC, Panama, …) shares the same flow:
 * POST a flat PrintIO payload to a `/api/print/*` route, surface a friendly
 * error on failure, then hand the returned PDF blob to `printPdfBlob`. This
 * consolidates that flow so the dialogs only build their payload and pick a
 * route.
 *
 * @see printPdfBlob — opens the browser print dialog for the returned PDF
 * @see handlePrintRequest (`@/lib/printio`) — the server-side PrintIO proxy
 */

import { printPdfBlob } from "@/lib/print-pdf";

/** Shape of the JSON error body returned by the print routes. */
interface PrintErrorBody {
  message?: string;
}

/** Fallback message shown when the print route fails without a usable body. */
const DEFAULT_ERROR_MESSAGE = "Failed to generate report";

/**
 * Reads the error message from a failed print response, defensively.
 *
 * Any parse failure (missing or non-JSON body) falls back to the generic
 * message so a broken error body never masks the underlying failure.
 *
 * @param response - The non-OK fetch response from a print route
 * @returns The server-provided message, or the generic fallback
 */
async function parsePrintError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as PrintErrorBody;
    return body.message ?? DEFAULT_ERROR_MESSAGE;
  } catch {
    return DEFAULT_ERROR_MESSAGE;
  }
}

/**
 * Posts a print payload to a Next.js print route and prints the returned PDF.
 *
 * Sends `payload` as JSON to `/api/print/{route}`, throws an `Error` with the
 * server-provided message on a non-OK response, then loads the returned PDF
 * blob into a hidden iframe and opens the browser print dialog.
 *
 * Callers own the surrounding loading state and error toast; this helper only
 * throws on failure so the caller can present it however it likes.
 *
 * @param route - Print route slug appended to `/api/print/` (e.g. `"mlc"`)
 * @param payload - The flat PrintIO template payload
 * @returns A promise that resolves once the print dialog has been triggered
 * @throws Error when the print route responds with a non-OK status
 *
 * @example
 * ```ts
 * await requestPrint("mlc", buildMlcPayload(data));
 * ```
 */
export async function requestPrint(
  route: string,
  payload: Record<string, string>
): Promise<void> {
  const response = await fetch(`/api/print/${route}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parsePrintError(response));
  }

  const blob = await response.blob();
  await printPdfBlob(blob);
}
