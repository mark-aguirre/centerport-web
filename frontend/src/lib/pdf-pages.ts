/**
 * Client-side helpers for inspecting and slicing a generated PDF blob by page.
 *
 * Report PDFs come back from the print routes as a single multi-page blob (see
 * `print-request.ts`). When the user wants to print just one page, we load the
 * blob with `pdf-lib`, copy the chosen page into a fresh one-page document, and
 * hand that back as a new blob for `printPdfBlob`.
 *
 * @see printPdfBlob — opens the browser print dialog for a PDF blob
 * @see PdfPreviewDialog — surfaces the page selector that calls these helpers
 */

import { PDFDocument } from "pdf-lib";

/**
 * Reads the number of pages in a PDF blob.
 *
 * @param blob - A Blob containing PDF data.
 * @returns The page count (0 if the document has no pages).
 */
export async function getPdfPageCount(blob: Blob): Promise<number> {
  const bytes = await blob.arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  return doc.getPageCount();
}

/**
 * Extracts a single page from a PDF blob into a new one-page PDF blob.
 *
 * The returned blob is a standalone `application/pdf` document containing only
 * the requested page, suitable for preview or printing.
 *
 * @param blob - A Blob containing the full multi-page PDF.
 * @param pageIndex - Zero-based index of the page to extract.
 * @returns A new Blob containing just that page.
 * @throws RangeError when `pageIndex` is outside the document's pages.
 */
export async function extractPdfPage(blob: Blob, pageIndex: number): Promise<Blob> {
  const bytes = await blob.arrayBuffer();
  const source = await PDFDocument.load(bytes);

  if (pageIndex < 0 || pageIndex >= source.getPageCount()) {
    throw new RangeError(
      `Page index ${pageIndex} is out of range (document has ${source.getPageCount()} page(s)).`,
    );
  }

  const output = await PDFDocument.create();
  const [page] = await output.copyPages(source, [pageIndex]);
  output.addPage(page);

  const outputBytes = await output.save();
  // Copy into a fresh ArrayBuffer so the Blob owns a plain ArrayBuffer, not a
  // view over pdf-lib's internal Uint8Array.
  const buffer = outputBytes.slice().buffer;
  return new Blob([buffer], { type: "application/pdf" });
}
