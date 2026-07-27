/**
 * Lightweight HTTP client wrapping the Fetch API.
 *
 * All requests are directed at the backend base URL defined by
 * NEXT_PUBLIC_API_URL (defaults to http://localhost:8080 for local dev).
 *
 * Features:
 * - Automatic JSON serialization/deserialization
 * - Unwraps the backend ApiResponse wrapper (returns `data` field)
 * - Consistent error handling with status and message
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

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
 * Core fetch wrapper.
 * Automatically handles JSON, error responses, and the ApiResponse unwrap.
 */
async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, params, headers: customHeaders, ...rest } = options;

  // Build URL with query params
  let url = `${BASE_URL}${path}`;
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
    ...customHeaders,
  };

  const response = await fetch(url, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    let violations: ValidationViolation[] = [];
    try {
      const errorBody = await response.json();
      if (errorBody.message) message = errorBody.message;
      if (errorBody.detail) message = errorBody.detail;
      // Support both flat `violations` and RFC 9457 `properties.violations`
      if (Array.isArray(errorBody.violations)) {
        violations = errorBody.violations;
      } else if (Array.isArray(errorBody.properties?.violations)) {
        violations = errorBody.properties.violations;
      }
    } catch {
      // Ignore parse errors — use default message
    }
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
  const url = `${BASE_URL}${path}`;
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
    // Let the browser set the multipart boundary automatically
  });

  if (!response.ok) {
    let message = "File upload failed";
    try {
      const errorBody = await response.json();
      if (errorBody.message) message = errorBody.message;
    } catch {
      // Ignore
    }
    throw new ApiError(response.status, message);
  }

  return response.json();
}

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
};
