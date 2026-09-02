import { type NextRequest } from "next/server";
import { handlePrintRequest } from "@/lib/printio";

/**
 * POST /api/print/panama
 *
 * Generates a Panama medical certificate PDF via PrintIO.
 * Accepts the Panama certificate form data as JSON body and returns the PDF binary.
 */
export async function POST(request: NextRequest) {
  return handlePrintRequest(request, {
    apiKey: process.env.PRINTIO_API_KEY_PANAMA!,
    filename: "panama-certificate.pdf",
  });
}
