import { type NextRequest } from "next/server";
import { handlePrintRequest } from "@/lib/printio";

/**
 * POST /api/print/mlc
 *
 * Generates an MLC certificate PDF via PrintIO.
 * Accepts the MLC form data as JSON body and returns the PDF binary.
 */
export async function POST(request: NextRequest) {
  return handlePrintRequest(request, {
    apiKey: process.env.PRINTIO_API_KEY_SEABASE_MLC!,
    filename: "mlc-certificate.pdf",
  });
}
