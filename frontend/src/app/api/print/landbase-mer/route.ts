import { type NextRequest } from "next/server";
import { handlePrintRequest } from "@/lib/printio";

/**
 * POST /api/print/landbase-mer
 *
 * Generates a Landbase MER (Medical Examination Report) PDF via PrintIO.
 * Accepts the landbase PEME form data as JSON body and returns the PDF binary.
 */
export async function POST(request: NextRequest) {
  return handlePrintRequest(request, {
    apiKey: process.env.PRINTIO_API_KEY_LANDBASE_MER!,
    filename: "landbase-mer.pdf",
  });
}
