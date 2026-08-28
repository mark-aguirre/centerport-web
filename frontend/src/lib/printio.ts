import { NextResponse } from "next/server";

const PRINTIO_BASE_URL = process.env.PRINTIO_BASE_URL ?? "INVALID_PRINTIO_BASE_URL";

/**
 * Configuration for a PrintIO print route.
 */
export interface PrintIoConfig {
  /** Environment variable name (or literal value) for the API key to use. */
  apiKey: string;
  /** Filename for the generated PDF (used in Content-Disposition header). */
  filename?: string;
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

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    console.error("PrintIO: Failed to parse request body");
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }

  try {
    // Step 1: Exchange API key for access token
    const tokenResponse = await fetch(`${PRINTIO_BASE_URL}/api/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("PrintIO token exchange failed:", tokenResponse.status, errorText);
      return NextResponse.json(
        { message: "Failed to authenticate with print service" },
        { status: 502 }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.accessToken;

    if (!accessToken) {
      console.error("PrintIO token response missing accessToken:", tokenData);
      return NextResponse.json(
        { message: "Invalid response from print service" },
        { status: 502 }
      );
    }

    // Step 2: Generate PDF
    const printResponse = await fetch(`${PRINTIO_BASE_URL}/api/print`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

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
