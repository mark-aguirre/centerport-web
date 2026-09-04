import { type NextRequest } from "next/server";
import { handlePrintRequest } from "@/lib/printio";

/**
 * POST /api/print/landbase-detailed
 *
 * Generates a Landbase detailed PEME report PDF via PrintIO.
 * Accepts the landbase PEME form data as JSON body and returns the PDF binary.
 */
export async function POST(request: NextRequest) {
  return handlePrintRequest(request, {
    apiKey: process.env.PRINTIO_API_KEY_LANDBASE_DETAILED!,
    filename: "landbase-detailed.pdf",
  });
}
