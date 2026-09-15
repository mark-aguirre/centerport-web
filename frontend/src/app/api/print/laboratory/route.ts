import { type NextRequest } from "next/server";
import { handlePrintRequest } from "@/lib/printio";

/**
 * POST /api/print/laboratory
 *
 * Generates a Laboratory Report (Lab-06) PDF via PrintIO. Accepts the
 * laboratory report form data as JSON body and returns the PDF binary.
 */
export async function POST(request: NextRequest) {
  return handlePrintRequest(request, {
    apiKey: process.env.PRINTIO_API_KEY_LABORATORY!,
    filename: "laboratory-report.pdf",
  });
}
