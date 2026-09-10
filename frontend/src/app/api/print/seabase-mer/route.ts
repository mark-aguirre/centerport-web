import { type NextRequest } from "next/server";
import { handlePrintRequest } from "@/lib/printio";

/**
 * POST /api/print/seabase-mer
 *
 * Generates a Seabase MER (Medical Examination Report) PDF via PrintIO. Accepts
 * the seabase medical exam form data as JSON body and returns the PDF binary.
 */
export async function POST(request: NextRequest) {
  return handlePrintRequest(request, {
    apiKey: process.env.PRINTIO_API_KEY_SEABASE_MER!,
    filename: "seabase-mer.pdf",
  });
}
