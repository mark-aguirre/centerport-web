import { type NextRequest } from "next/server";
import { handlePrintRequest } from "@/lib/printio";

/**
 * POST /api/print/landbase-summary
 *
 * Generates a Landbase summary report PDF via PrintIO.
 * Accepts the landbase PEME form data as JSON body and returns the PDF binary.
 */
export async function POST(request: NextRequest) {
  return handlePrintRequest(request, {
    apiKey: process.env.PRINTIO_API_KEY_LANDBASE_SUMMARY!,
    filename: "landbase-summary.pdf",
  });
}
