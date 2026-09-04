import { type NextRequest } from "next/server";
import { handlePrintRequest } from "@/lib/printio";

/**
 * POST /api/print/landbase-mlc
 *
 * Generates a Landbase MLC medical certificate PDF via PrintIO.
 * Accepts the landbase PEME form data as JSON body and returns the PDF binary.
 */
export async function POST(request: NextRequest) {
  return handlePrintRequest(request, {
    apiKey: process.env.PRINTIO_API_KEY_LANDBASE_MLC!,
    filename: "landbase-mlc-certificate.pdf",
  });
}
