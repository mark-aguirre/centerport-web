import { type NextRequest, NextResponse } from "next/server";

/**
 * Catch-all proxy Route Handler for the Spring Boot backend.
 *
 * Every backend call from the browser goes through this handler
 * (`/api/backend/...`) instead of hitting the backend directly. This keeps the
 * backend URL server-side only, gives us one place to add cross-cutting
 * concerns (auth headers, logging), and satisfies the app convention that all
 * API traffic flows through a Next.js API route.
 *
 * The segment after `/api/backend/` is forwarded verbatim to the backend,
 * preserving the path, query string, request body, and method. For example:
 *   GET  /api/backend/api/employers/search?keyword=ma
 *     -> GET  {BACKEND_API_URL}/api/employers/search?keyword=ma
 *   POST /api/backend/api/profiles
 *     -> POST {BACKEND_API_URL}/api/profiles
 */

const BACKEND_URL = process.env.BACKEND_API_URL ?? "INVALID_BACKEND_API_URL";

/** Hop-by-hop / host-specific headers that must not be forwarded upstream. */
const STRIPPED_REQUEST_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "accept-encoding",
]);

/** Response headers that Next.js manages itself and must not be copied back. */
const STRIPPED_RESPONSE_HEADERS = new Set([
  "content-encoding",
  "content-length",
  "transfer-encoding",
  "connection",
  // Set-Cookie is handled separately (see relaySetCookies) so multiple cookies
  // and the Path/Domain rewrite are preserved correctly.
  "set-cookie",
]);

/** The proxy mount point. Backend session cookies are re-scoped to this path. */
const PROXY_BASE_PATH = "/api/backend";

/**
 * Relays `Set-Cookie` headers from the backend to the browser.
 *
 * The backend (Spring Boot) issues its session cookie (e.g. `JSESSIONID`) and
 * OAuth2 flow cookies with `Path=/` for its own domain. Because the browser
 * only ever talks to this same-origin proxy, we:
 *   - re-scope each cookie's `Path` to the proxy mount (`/api/backend`), so the
 *     browser sends it back on every backend call and OAuth redirect, and
 *   - strip any `Domain` attribute so the cookie binds to the current origin.
 *
 * Uses `getSetCookie()` so multiple `Set-Cookie` headers are preserved
 * individually (a plain `Headers` iteration collapses them into one string).
 */
function relaySetCookies(upstream: Response, responseHeaders: Headers): void {
  const cookies =
    typeof upstream.headers.getSetCookie === "function"
      ? upstream.headers.getSetCookie()
      : [];

  for (const cookie of cookies) {
    const rewritten = cookie
      // Drop Domain so the cookie is bound to the frontend origin.
      .replace(/;\s*Domain=[^;]*/i, "")
      // Re-scope Path to the proxy mount point.
      .replace(/;\s*Path=[^;]*/i, `; Path=${PROXY_BASE_PATH}`);
    responseHeaders.append("set-cookie", rewritten);
  }
}

/**
 * Forwards an incoming request to the backend and relays the response.
 *
 * @param request the incoming Next.js request
 * @param path    the captured path segments after `/api/backend/`
 */
async function proxy(
  request: NextRequest,
  path: string[]
): Promise<NextResponse> {
  const search = request.nextUrl.search;
  const targetUrl = `${BACKEND_URL}/${path.join("/")}${search}`;

  // Copy request headers, dropping host-specific / hop-by-hop ones.
  //
  // Authentication is session-cookie based (the Spring Boot backend runs the
  // Keycloak login and issues a session cookie). The cookie is forwarded here
  // like any other request header, so no bearer-token handling is needed.
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!STRIPPED_REQUEST_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  const hasBody = request.method !== "GET" && request.method !== "HEAD";

  let upstream: Response;
  try {
    upstream = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      redirect: "manual",
    });
  } catch (error) {
    console.error(`Backend proxy request failed: ${request.method} ${targetUrl}`, error);
    return NextResponse.json(
      { success: false, message: "Unable to reach the backend service." },
      { status: 502 }
    );
  }

  // Relay the upstream response, stripping headers Next.js re-computes.
  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!STRIPPED_RESPONSE_HEADERS.has(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  });

  // Relay session / OAuth cookies (re-scoped to the proxy path).
  relaySetCookies(upstream, responseHeaders);

  const bodyBuffer = await upstream.arrayBuffer();
  return new NextResponse(bodyBuffer, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export async function GET(
  request: NextRequest,
  ctx: RouteContext<"/api/backend/[...path]">
) {
  const { path } = await ctx.params;
  return proxy(request, path);
}

export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/backend/[...path]">
) {
  const { path } = await ctx.params;
  return proxy(request, path);
}

export async function PUT(
  request: NextRequest,
  ctx: RouteContext<"/api/backend/[...path]">
) {
  const { path } = await ctx.params;
  return proxy(request, path);
}

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/backend/[...path]">
) {
  const { path } = await ctx.params;
  return proxy(request, path);
}

export async function DELETE(
  request: NextRequest,
  ctx: RouteContext<"/api/backend/[...path]">
) {
  const { path } = await ctx.params;
  return proxy(request, path);
}
