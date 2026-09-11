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
]);

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
