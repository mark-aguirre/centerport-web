/**
 * Client-side utility for printing a PDF Blob via a hidden iframe.
 *
 * This is the most reliable cross-browser approach for printing a PDF's
 * original content (as opposed to a rasterized/re-rendered version). It works
 * in recent versions of Chrome, Firefox, Safari and Edge.
 *
 * Approach and browser quirks are based on the well-established community
 * pattern documented here:
 * https://gist.github.com/timdown/cfacd32f6b5e439bb02aaf142343ce4c
 *
 * Content was rephrased for compliance with licensing restrictions.
 */

/** Firefox fails with an uncatchable error if print() is called too soon after load. */
const FIREFOX_PRINT_DELAY_MS = 1000;

/** How long to keep the iframe and object URL alive after triggering print. */
const CLEANUP_DELAY_MS = 60_000;

function isFirefox(): boolean {
  return typeof navigator !== "undefined" && /Gecko\/\d/.test(navigator.userAgent);
}

/**
 * Loads a PDF blob into a hidden iframe and opens the browser's print dialog.
 *
 * Falls back to opening the PDF in a new tab if the iframe print path fails
 * (for example, if a popup/security policy blocks programmatic printing).
 *
 * @param blob - A Blob containing PDF data.
 * @returns A promise that resolves once the print dialog has been triggered.
 */
export function printPdfBlob(blob: Blob): Promise<void> {
  return new Promise((resolve) => {
    // Normalize to an explicit application/pdf blob so the browser renders it
    // inline (and prints it) rather than treating it as a download.
    const pdfBlob = blob.type === "application/pdf" ? blob : new Blob([blob], { type: "application/pdf" });
    const objectUrl = URL.createObjectURL(pdfBlob);

    const iframe = document.createElement("iframe");
    // A small, non-zero, visually hidden frame prints more reliably than a 0x0 frame.
    iframe.style.cssText =
      "width:1px;height:100px;position:fixed;left:0;top:0;opacity:0;border:0;margin:0;padding:0";

    const cleanup = () => {
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      URL.revokeObjectURL(objectUrl);
    };

    const triggerPrint = () => {
      try {
        iframe.focus();
        const frameWindow = iframe.contentWindow;
        if (!frameWindow) throw new Error("iframe content window unavailable");
        frameWindow.focus();
        frameWindow.print();
      } catch (error) {
        console.error("Print via iframe failed, opening in a new tab instead:", error);
        window.open(objectUrl, "_blank");
      } finally {
        // Keep the frame/URL alive briefly so the print job can read the data.
        setTimeout(cleanup, CLEANUP_DELAY_MS);
        resolve();
      }
    };

    iframe.addEventListener("load", () => {
      if (isFirefox()) {
        setTimeout(triggerPrint, FIREFOX_PRINT_DELAY_MS);
      } else {
        triggerPrint();
      }
    });

    iframe.src = objectUrl;
    document.body.appendChild(iframe);
  });
}

