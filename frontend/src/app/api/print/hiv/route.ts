import { type NextRequest } from "next/server";
import { handlePrintRequest } from "@/lib/printio";

/**
 * POST /api/print/hiv
 *
 * Generates an HIV screening report PDF via PrintIO.
 * Accepts the HIV report form data as JSON body and returns the PDF binary.
 */
export async function POST(request: NextRequest) {
  return handlePrintRequest(request, {
    apiKey: process.env.PRINTIO_API_KEY_HIV!,
    filename: "hiv-report.pdf",
  });
}
