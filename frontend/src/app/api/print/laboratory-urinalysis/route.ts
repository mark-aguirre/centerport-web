import { type NextRequest } from "next/server";
import { handlePrintRequest } from "@/lib/printio";

/**
 * POST /api/print/laboratory-urinalysis
 *
 * Generates a Laboratory Urinalysis report PDF via PrintIO. Accepts the
 * laboratory report form data (urinalysis panels) as JSON body and returns the
 * PDF binary.
 */
export async function POST(request: NextRequest) {
  return handlePrintRequest(request, {
    apiKey: process.env.PRINTIO_API_KEY_LABORATORY_URINALYSIS!,
    filename: "laboratory-urinalysis-report.pdf",
  });
}
