import { NextResponse } from "next/server";
import { Agent } from "undici";

const PRINTIO_BASE_URL = process.env.PRINTIO_BASE_URL ?? "INVALID_PRINTIO_BASE_URL";

/**
 * Dispatcher used for outbound requests to PrintIO.
 *
 * The PrintIO host presents a certificate chain that Node cannot verify against
 * its local trust store (UNABLE_TO_GET_ISSUER_CERT_LOCALLY). Rather than
 * disabling TLS verification globally via NODE_TLS_REJECT_UNAUTHORIZED — which
 * does not work when set in .env.local (Node reads it at process start, before
 * Next loads env files) and would weaken every outbound connection — we scope
 * the relaxed verification to PrintIO requests only.
 *
 * Enable by setting PRINTIO_INSECURE_TLS=true (intended for dev only).
 */
const printioDispatcher =
  process.env.PRINTIO_INSECURE_TLS === "true"
    ? new Agent({ connect: { rejectUnauthorized: false } })
    : undefined;

/**
 * Configuration for a PrintIO print route.
 */
export interface PrintIoConfig {
  /** Environment variable name (or literal value) for the API key to use. */
  apiKey: string;
  /** Filename for the generated PDF (used in Content-Disposition header). */
  filename?: string;
}

/** Token-exchange response returned by PrintIO's auth endpoint. */
interface PrintIoTokenResponse {
  accessToken?: string;
}

/**
 * Type guard narrowing an untrusted JSON value to a `PrintIoTokenResponse`
 * carrying a usable `accessToken` string.
 *
 * @param value - Parsed JSON body from the token endpoint
 * @returns `true` when `value` has a non-empty `accessToken`
 */
function hasAccessToken(
  value: unknown
): value is Required<PrintIoTokenResponse> {
  return (
    typeof value === "object" &&
    value !== null &&
    "accessToken" in value &&
    typeof (value as PrintIoTokenResponse).accessToken === "string" &&
    (value as PrintIoTokenResponse).accessToken !== ""
  );
}

/**
 * Time-to-live for a cached PrintIO access token, in milliseconds.
 *
 * PrintIO tokens are short-lived; we cache conservatively (well under the
 * server-side lifetime) and additionally recover from a stale token via the
 * 401-retry path in {@link handlePrintRequest}.
 */
const TOKEN_TTL_MS = 5 * 60_000;

/** A cached access token along with the epoch millis at which it expires. */
interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

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

/** Thrown when the token exchange with PrintIO fails. */
class TokenExchangeError extends Error {}

/**
 * Performs the raw API-key → access-token exchange against PrintIO.
 */
async function exchangeToken(apiKey: string): Promise<string> {
  const tokenResponse = await fetch(`${PRINTIO_BASE_URL}/api/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey }),
    dispatcher: printioDispatcher,
  } as RequestInit);

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error("PrintIO token exchange failed:", tokenResponse.status, errorText);
    throw new TokenExchangeError("Failed to authenticate with print service");
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
 * @param apiKey - The PrintIO API key to exchange.
 * @param forceRefresh - When `true`, bypasses the cache and fetches a fresh
 *   token (used to recover from a token the server has already expired).
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
 * Reusable server-side handler that proxies print requests to PrintIO.
 *
 * Flow:
 * 1. Exchanges the API key for a short-lived access token
 * 2. Submits the payload to PrintIO's /api/print endpoint
 * 3. Returns the generated PDF binary as a NextResponse
 *
 * Usage in a route.ts:
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
  const { apiKey, filename = "report.pdf" } = config;

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
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }

  const body = JSON.stringify(payload);

  /**
   * Submits the print payload with the given token. A 401 means the token was
   * expired/invalid server-side, signalled to the caller for a single refresh.
   */
  const requestPrint = async (accessToken: string) =>
    fetch(`${PRINTIO_BASE_URL}/api/print`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body,
      dispatcher: printioDispatcher,
    } as RequestInit);

  try {
    // Step 1: Obtain an access token (cached across requests).
    let accessToken: string;
    try {
      accessToken = await tokenPromise;
    } catch (error) {
      const message =
        error instanceof TokenExchangeError ? error.message : "Failed to authenticate with print service";
      return NextResponse.json({ message }, { status: 502 });
    }

    // Step 2: Generate the PDF. If the cached token was rejected (401), drop it
    // and retry once with a freshly minted token.
    let printResponse = await requestPrint(accessToken);
    if (printResponse.status === 401) {
      tokenCache.delete(apiKey);
      try {
        accessToken = await getAccessToken(apiKey, true);
      } catch (error) {
        const message =
          error instanceof TokenExchangeError ? error.message : "Failed to authenticate with print service";
        return NextResponse.json({ message }, { status: 502 });
      }
      printResponse = await requestPrint(accessToken);
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

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.byteLength),
      },
    });
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
