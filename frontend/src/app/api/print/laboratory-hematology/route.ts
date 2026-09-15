import { type NextRequest } from "next/server";
import { handlePrintRequest } from "@/lib/printio";

/**
 * POST /api/print/laboratory-hematology
 *
 * Generates a Laboratory Hematology report PDF via PrintIO. Accepts the
 * laboratory report form data as JSON body and returns the PDF binary.
 */
export async function POST(request: NextRequest) {
  return handlePrintRequest(request, {
    apiKey: process.env.PRINTIO_API_KEY_LABORATORY_HEMATOLOGY!,
    filename: "laboratory-hematology-report.pdf",
  });
}
