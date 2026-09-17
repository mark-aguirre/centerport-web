/**
 * Lightweight HTTP client wrapping the Fetch API.
 *
 * All requests are directed at the same-origin Next.js proxy route
 * (`/api/backend/[...path]`), which forwards them to the backend server-side.
 * The browser never calls the backend host directly.
 *
 * Features:
 * - Automatic JSON serialization/deserialization
 * - Unwraps the backend ApiResponse wrapper (returns `data` field)
 * - Consistent error handling with status and message
 */

/**
 * All backend traffic is routed through the same-origin Next.js proxy Route
 * Handler at `/api/backend/[...path]` (see src/app/api/backend/[...path]/route.ts)
 * rather than hitting the backend directly. The proxy prepends the real backend
 * URL server-side, so the backend host is never exposed to the browser.
 *
 * A backend path like `/api/employers/search` therefore becomes
 * `/api/backend/api/employers/search`.
 */
const BASE_URL = "/api/backend";

/** True when this module is executing on the server (no browser `window`). */
const IS_SERVER = typeof window === "undefined";

/**
 * Resolves the request URL and headers for the current runtime.
 *
 * In the browser, requests go through the same-origin proxy at `/api/backend`
 * using a relative URL — the browser resolves it against the current origin and
 * automatically attaches the session cookie.
 *
 * On the server (Server Components / Route Handlers), a relative URL has no
 * origin to resolve against and `fetch` would throw, and the browser's session
 * cookie is not attached automatically. So we bypass the proxy hop and call the
 * backend directly via the server-only `BACKEND_API_URL`, forwarding the
 * incoming request's cookies so the backend session is preserved. The backend
 * path is used as-is (the `/api/backend` proxy prefix is a browser-only mount).
 */
async function resolveTarget(
  path: string
): Promise<{ url: string; headers: Record<string, string> }> {
  if (!IS_SERVER) {
    return { url: `${BASE_URL}${path}`, headers: {} };
  }

  const backendUrl = process.env.BACKEND_API_URL ?? "INVALID_BACKEND_API_URL";

  // Forward the incoming request's cookies so the backend session is preserved
  // during server-side rendering. `next/headers` is imported lazily so this
  // server-only dependency never enters a client bundle.
  const { cookies } = await import("next/headers");
  const cookieHeader = (await cookies()).toString();
  const headers: Record<string, string> = {};
  if (cookieHeader) headers.cookie = cookieHeader;

  return { url: `${backendUrl}${path}`, headers };
}

/**
 * Handles an expired / missing backend session (HTTP 401).
 *
 * The backend session (JSESSIONID) has an idle timeout, so a session that was
 * valid at page load can expire while the app is open. When any backend call
 * comes back 401, we send the user back to Keycloak login via a full-page
 * navigation instead of letting the 401 surface as a scattered error.
 *
 * The redirect is guarded so a burst of concurrent 401s (e.g. several requests
 * in flight when the session lapses) triggers exactly one navigation. Callers
 * still receive the thrown `ApiError` so in-flight work stops cleanly.
 */
let redirectingToLogin = false;

function handleUnauthorized(): void {
  // Only meaningful in the browser; guard for any server-side invocation.
  if (typeof window === "undefined") return;
  if (redirectingToLogin) return;
  redirectingToLogin = true;
  // Lazy import avoids pulling browser-navigation code into non-browser paths.
  void import("@/lib/auth").then(({ startLogin }) => startLogin());
}

/** A single field-level validation violation from the backend. */
export interface ValidationViolation {
  field: string;
  message: string;
  rejected: string;
}

/** Error thrown when an API request fails. */
export class ApiError extends Error {
  /** Field-level validation violations (present for 400 validation errors). */
  violations: ValidationViolation[];

  constructor(
    public status: number,
    message: string,
    violations: ValidationViolation[] = []
  ) {
    super(message);
    this.name = "ApiError";
    this.violations = violations;
  }
}

/**
 * Backend ApiResponse<T> wrapper shape.
 * All successful responses are wrapped in this structure.
 */
interface ApiResponseWrapper<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
  request_id?: string;
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  params?: Record<string, string | number | undefined>;
};

/**
 * Loosely-typed shape of a backend error body.
 *
 * Every field is optional because error responses come from multiple sources
 * (validation handler, RFC 9457 problem details, generic 500s) and are treated
 * as untrusted external data until narrowed.
 */
interface ErrorBody {
  message?: string;
  detail?: string;
  violations?: ValidationViolation[];
  properties?: { violations?: ValidationViolation[] };
}

/**
 * Parses a failed `Response` into a message and validation violations.
 *
 * Reads the JSON body defensively: any parse failure falls back to the
 * provided default message with no violations. Supports both the flat
 * `violations` array and the RFC 9457 `properties.violations` location.
 *
 * @param response - The non-OK fetch response
 * @param defaultMessage - Message to use when the body has none
 * @returns Parsed error message and any field-level violations
 */
async function parseErrorResponse(
  response: Response,
  defaultMessage: string
): Promise<{ message: string; violations: ValidationViolation[] }> {
  try {
    const body = (await response.json()) as ErrorBody;
    const message = body.detail ?? body.message ?? defaultMessage;
    const violations = Array.isArray(body.violations)
      ? body.violations
      : Array.isArray(body.properties?.violations)
        ? body.properties.violations
        : [];
    return { message, violations };
  } catch {
    // Body is missing or not JSON — fall back to the default message.
    return { message: defaultMessage, violations: [] };
  }
}

/**
 * Core fetch wrapper.
 * Automatically handles JSON, error responses, and the ApiResponse unwrap.
 */
async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, params, headers: customHeaders, ...rest } = options;

  // Build URL with query params
  const target = await resolveTarget(path);
  let url = target.url;
  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    }
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...target.headers,
    ...customHeaders,
  };

  const response = await fetch(url, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    if (response.status === 401) handleUnauthorized();
    const { message, violations } = await parseErrorResponse(
      response,
      `Request failed with status ${response.status}`
    );
    throw new ApiError(response.status, message, violations);
  }

  const json: ApiResponseWrapper<T> = await response.json();
  return json.data;
}

/** Upload a file using multipart/form-data (no JSON content-type). */
async function uploadFile(
  path: string,
  file: File
): Promise<{ file_url: string }> {
  const { url } = await resolveTarget(path);
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
    // Let the browser set the multipart boundary automatically
  });

  if (!response.ok) {
    if (response.status === 401) handleUnauthorized();
    const { message } = await parseErrorResponse(response, "File upload failed");
    throw new ApiError(response.status, message);
  }

  return response.json() as Promise<{ file_url: string }>;
}

/**
 * Download a binary file (e.g. PDF) and open it in a new browser tab.
 * Falls back to triggering a file download if the browser blocks the popup.
 */
async function downloadPdf(path: string, filename?: string): Promise<void> {
  const { url } = await resolveTarget(path);

  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/pdf" },
  });

  if (!response.ok) {
    if (response.status === 401) handleUnauthorized();
    const { message } = await parseErrorResponse(
      response,
      "Failed to generate report"
    );
    throw new ApiError(response.status, message);
  }

  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);

  // Try opening in a new tab for print/preview
  const newTab = window.open(blobUrl, "_blank");
  if (!newTab) {
    // Fallback: trigger download if popup was blocked
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename ?? "report.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Clean up blob URL after a delay to allow the tab/download to start
  setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
}

/**
 * Public HTTP client used across the app.
 *
 * `get`/`post`/`put`/`delete` send JSON, unwrap the backend `ApiResponse`
 * envelope, and throw `ApiError` on failure. `uploadFile` posts
 * multipart/form-data, and `downloadPdf` streams a binary file to a new tab.
 */
export const httpClient = {
  get: <T>(path: string, params?: Record<string, string | number | undefined>) =>
    request<T>(path, { method: "GET", params }),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body }),

  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body }),

  delete: <T>(path: string) =>
    request<T>(path, { method: "DELETE" }),

  uploadFile,
  downloadPdf,
};
