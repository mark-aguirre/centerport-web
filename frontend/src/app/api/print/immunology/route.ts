import { type NextRequest } from "next/server";
import { handlePrintRequest } from "@/lib/printio";

/**
 * POST /api/print/immunology
 *
 * Generates an Immunology / Serology report PDF via PrintIO.
 * Accepts the immunology report form data as JSON body and returns the PDF binary.
 */
export async function POST(request: NextRequest) {
  return handlePrintRequest(request, {
    apiKey: process.env.PRINTIO_API_KEY_IMMUNOLOGY!,
    filename: "immunology-report.pdf",
  });
}
