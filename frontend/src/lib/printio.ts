import { NextResponse } from "next/server";
import { Agent } from "undici";

const PRINTIO_BASE_URL = process.env.PRINTIO_BASE_URL ?? "INVALID_PRINTIO_BASE_URL";

/** Default filename used when a route does not specify one. */
const DEFAULT_PDF_FILENAME = "report.pdf";

/** Generic message returned to callers when the token exchange fails. */
const AUTH_FAILURE_MESSAGE = "Failed to authenticate with print service";

/**
 * Time-to-live for a cached PrintIO access token, in milliseconds.
 *
 * PrintIO tokens are short-lived; we cache conservatively (well under the
 * server-side lifetime) and additionally recover from a stale token via the
 * 401-retry path in `handlePrintRequest`.
 */
const TOKEN_TTL_MS = 5 * 60_000;

/**
 * Dispatcher used for outbound requests to PrintIO.
 *
 * The PrintIO host presents a certificate chain that Node cannot verify against
 * its local trust store (`UNABLE_TO_GET_ISSUER_CERT_LOCALLY`). Rather than
 * disabling TLS verification globally via `NODE_TLS_REJECT_UNAUTHORIZED` — which
 * does not work when set in `.env.local` (Node reads it at process start, before
 * Next loads env files) and would weaken every outbound connection — we scope
 * the relaxed verification to PrintIO requests only.
 *
 * Enable by setting `PRINTIO_INSECURE_TLS=true` (intended for dev only).
 */
const printioDispatcher =
  process.env.PRINTIO_INSECURE_TLS === "true"
    ? new Agent({ connect: { rejectUnauthorized: false } })
    : undefined;

/**
 * `fetch` init extended with undici's `dispatcher` option.
 *
 * The `dispatcher` field is an undici extension not present on the standard
 * `RequestInit` type, so the cast is isolated here rather than repeated at each
 * call site.
 */
type UndiciRequestInit = RequestInit & { dispatcher?: typeof printioDispatcher };

/**
 * Issues a `fetch` against PrintIO using the scoped TLS dispatcher.
 *
 * @param url - Absolute PrintIO endpoint URL
 * @param init - Standard fetch init (dispatcher is applied automatically)
 * @returns The raw fetch `Response`
 */
function printioFetch(url: string, init: RequestInit): Promise<Response> {
  return fetch(url, { ...init, dispatcher: printioDispatcher } as UndiciRequestInit);
}

/**
 * Configuration for a PrintIO print route.
 */
export interface PrintIoConfig {
  /** Resolved PrintIO API key to exchange for an access token. */
  apiKey: string;
  /** Filename for the generated PDF (used in `Content-Disposition` header). */
  filename?: string;
}

/** Token-exchange response returned by PrintIO's auth endpoint. */
interface PrintIoTokenResponse {
  accessToken?: string;
}

/** A cached access token along with the epoch millis at which it expires. */
interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

/** Thrown when the token exchange with PrintIO fails. */
class TokenExchangeError extends Error {}

/**
 * In-memory token cache keyed by API key. Persists for the lifetime of the
 * server process, so back-to-back prints reuse a single token exchange instead
 * of paying a fresh round-trip on every request.
 */
const tokenCache = new Map<string, CachedToken>();

/**
 * De-duplicates concurrent token exchanges for the same API key so a burst of
 * simultaneous prints triggers at most one in-flight request to PrintIO.
 */
const inFlightTokenRequests = new Map<string, Promise<string>>();

/**
 * Type guard narrowing an untrusted JSON value to a `PrintIoTokenResponse`
 * carrying a usable `accessToken` string.
 *
 * @param value - Parsed JSON body from the token endpoint
 * @returns `true` when `value` has a non-empty `accessToken`
 */
function hasAccessToken(value: unknown): value is Required<PrintIoTokenResponse> {
  return (
    typeof value === "object" &&
    value !== null &&
    "accessToken" in value &&
    typeof (value as PrintIoTokenResponse).accessToken === "string" &&
    (value as PrintIoTokenResponse).accessToken !== ""
  );
}

/**
 * Performs the raw API-key to access-token exchange against PrintIO.
 *
 * @param apiKey - The PrintIO API key to exchange
 * @returns The issued access token
 * @throws TokenExchangeError when authentication fails or the response is malformed
 */
async function exchangeToken(apiKey: string): Promise<string> {
  const tokenResponse = await printioFetch(`${PRINTIO_BASE_URL}/api/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey }),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error("PrintIO token exchange failed:", tokenResponse.status, errorText);
    throw new TokenExchangeError(AUTH_FAILURE_MESSAGE);
  }

  const tokenData: unknown = await tokenResponse.json();

  if (!hasAccessToken(tokenData)) {
    console.error("PrintIO token response missing accessToken");
    throw new TokenExchangeError("Invalid response from print service");
  }

  return tokenData.accessToken;
}

/**
 * Returns a valid PrintIO access token, reusing the cached one when possible.
 *
 * @param apiKey - The PrintIO API key to exchange
 * @param forceRefresh - When `true`, bypasses the cache and fetches a fresh
 *   token (used to recover from a token the server has already expired)
 * @returns A valid access token
 */
async function getAccessToken(apiKey: string, forceRefresh = false): Promise<string> {
  if (!forceRefresh) {
    const cached = tokenCache.get(apiKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.accessToken;
    }
    const inFlight = inFlightTokenRequests.get(apiKey);
    if (inFlight) return inFlight;
  }

  const request = exchangeToken(apiKey)
    .then((accessToken) => {
      tokenCache.set(apiKey, {
        accessToken,
        expiresAt: Date.now() + TOKEN_TTL_MS,
      });
      return accessToken;
    })
    .finally(() => {
      inFlightTokenRequests.delete(apiKey);
    });

  inFlightTokenRequests.set(apiKey, request);
  return request;
}

/**
 * Maps a token-exchange failure to a `502` JSON response.
 *
 * Uses the {@link TokenExchangeError} message when available and falls back to
 * a generic auth-failure message for any other error.
 *
 * @param error - The error thrown by the token acquisition
 * @returns A `502` `NextResponse` describing the failure
 */
function tokenErrorResponse(error: unknown): NextResponse {
  const message = error instanceof TokenExchangeError ? error.message : AUTH_FAILURE_MESSAGE;
  return NextResponse.json({ message }, { status: 502 });
}

/**
 * Wraps a generated PDF buffer in a `200` `NextResponse` with PDF headers.
 *
 * @param pdfBuffer - The raw PDF bytes returned by PrintIO
 * @param filename - Filename advertised in the `Content-Disposition` header
 * @returns A `NextResponse` streaming the PDF inline
 */
function pdfResponse(pdfBuffer: ArrayBuffer, filename: string): NextResponse {
  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Content-Length": String(pdfBuffer.byteLength),
    },
  });
}

/**
 * Submits a print payload to PrintIO with the given access token.
 *
 * @param body - Pre-serialized JSON payload
 * @param accessToken - Bearer token from {@link getAccessToken}
 * @returns The raw print `Response`; a `401` signals an expired/invalid token
 */
function requestPrint(body: string, accessToken: string): Promise<Response> {
  return printioFetch(`${PRINTIO_BASE_URL}/api/print`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body,
  });
}

/**
 * Reusable server-side handler that proxies print requests to PrintIO.
 *
 * Flow:
 * 1. Exchanges the API key for a short-lived access token
 * 2. Submits the payload to PrintIO's `/api/print` endpoint
 * 3. Returns the generated PDF binary as a `NextResponse`
 *
 * A `401` from the print endpoint triggers a single token refresh and retry to
 * recover from a token the server has already expired.
 *
 * @param request - Incoming route request whose JSON body is the print payload
 * @param config - Route configuration (API key and optional filename)
 * @returns A PDF `NextResponse` on success, or a JSON error response otherwise
 *
 * @example
 * ```ts
 * import { handlePrintRequest } from "@/lib/printio";
 *
 * export async function POST(request: NextRequest) {
 *   return handlePrintRequest(request, {
 *     apiKey: process.env.PRINTIO_API_KEY_SEABASE_MLC!,
 *     filename: "mlc-certificate.pdf",
 *   });
 * }
 * ```
 */
export async function handlePrintRequest(
  request: Request,
  config: PrintIoConfig
): Promise<NextResponse> {
  const { apiKey, filename = DEFAULT_PDF_FILENAME } = config;

  if (!apiKey) {
    console.error("PrintIO: API key is missing or undefined");
    return NextResponse.json(
      { message: "Print service is not configured (missing API key)" },
      { status: 500 }
    );
  }

  // Kick off the token acquisition immediately so it overlaps with body
  // parsing (and any upstream network wait) instead of running strictly after.
  const tokenPromise = getAccessToken(apiKey);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    console.error("PrintIO: Failed to parse request body");
    // Surface the (rejected) token promise so we don't leak an unhandled
    // rejection when we bail out early on a bad body.
    void tokenPromise.catch(() => {});
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const body = JSON.stringify(payload);

  try {
    // Step 1: Obtain an access token (cached across requests).
    let accessToken: string;
    try {
      accessToken = await tokenPromise;
    } catch (error) {
      return tokenErrorResponse(error);
    }

    // Step 2: Generate the PDF. If the cached token was rejected (401), drop it
    // and retry once with a freshly minted token.
    let printResponse = await requestPrint(body, accessToken);
    if (printResponse.status === 401) {
      tokenCache.delete(apiKey);
      try {
        accessToken = await getAccessToken(apiKey, true);
      } catch (error) {
        return tokenErrorResponse(error);
      }
      printResponse = await requestPrint(body, accessToken);
    }

    if (!printResponse.ok) {
      const errorText = await printResponse.text();
      console.error("PrintIO PDF generation failed:", printResponse.status, errorText);
      return NextResponse.json(
        { message: "Failed to generate PDF report" },
        { status: 502 }
      );
    }

    const pdfBuffer = await printResponse.arrayBuffer();
    return pdfResponse(pdfBuffer, filename);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    console.error("PrintIO route error:", message);
    if (stack) console.error("PrintIO route stack:", stack);
    return NextResponse.json(
      { message: `Print service error: ${message}` },
      { status: 500 }
    );
  }
}
