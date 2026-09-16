import { type NextRequest } from "next/server";
import { handlePrintRequest } from "@/lib/printio";

/**
 * POST /api/print/laboratory-fecalysis
 *
 * Generates a Laboratory Fecalysis report PDF via PrintIO. Accepts the
 * laboratory report form data (fecalysis panel) as JSON body and returns the
 * PDF binary.
 */
export async function POST(request: NextRequest) {
  return handlePrintRequest(request, {
    apiKey: process.env.PRINTIO_API_KEY_LABORATORY_FECALYSIS!,
    filename: "laboratory-fecalysis-report.pdf",
  });
}
