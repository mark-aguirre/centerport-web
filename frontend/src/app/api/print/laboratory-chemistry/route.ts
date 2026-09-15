import { type NextRequest } from "next/server";
import { handlePrintRequest } from "@/lib/printio";

/**
 * POST /api/print/laboratory-chemistry
 *
 * Generates a Laboratory Chemistry report PDF via PrintIO. Accepts the
 * laboratory report form data (clinical chemistry panel) as JSON body and
 * returns the PDF binary.
 */
export async function POST(request: NextRequest) {
  return handlePrintRequest(request, {
    apiKey: process.env.PRINTIO_API_KEY_LABORATORY_CHEMISTRY!,
    filename: "laboratory-chemistry-report.pdf",
  });
}
