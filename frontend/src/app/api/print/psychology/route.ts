import { type NextRequest } from "next/server";
import { handlePrintRequest } from "@/lib/printio";

/**
 * POST /api/print/psychology
 *
 * Generates a Psychological Evaluation report PDF via PrintIO.
 * Accepts the psychology evaluation form data as JSON body and returns the PDF binary.
 */
export async function POST(request: NextRequest) {
  return handlePrintRequest(request, {
    apiKey: process.env.PRINTIO_API_KEY_PSYCHOLOGY!,
    filename: "psychological-evaluation.pdf",
  });
}
