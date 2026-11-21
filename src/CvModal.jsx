import React, { useEffect, useRef } from "react";
import { setStored, useStored } from "./book/formStore";

// The CV, previewed in a modal over whichever view is showing. CV links keep a
// real href, so cmd/ctrl/middle-click still opens the PDF in a new tab.

export const CV_URL = new URL("../CV-Nur Ahmad Khatim.pdf", import.meta.url).href;
const CV_FILENAME = "CV-Nur Ahmad Khatim.pdf";

export function openCv(e) {
  if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) return; // let the browser open a tab
  e?.preventDefault();
  setStored("cv.open", true);
}

const closeCv = () => setStored("cv.open", false);

// Browsers without a built-in PDF viewer (e.g. Chrome on Android) can't show it
// in a frame, so they get open/download buttons instead.
const canPreviewPdf = () => navigator.pdfViewerEnabled !== false;

export default function CvModal() {
  const [open] = useStored("cv.open", false);
  const closeRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const before = document.activeElement;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    closeRef.current?.focus();

    // Capture keys before the book's page-turn shortcuts see them.
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); closeCv(); }
      if (e.key === "Tab") {
        const els = dialogRef.current?.querySelectorAll("a[href], button, iframe");
        if (els?.length) {
          const first = els[0], last = els[els.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
        return;
      }
      e.stopPropagation();
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      html.style.overflow = prevOverflow;
      before?.focus?.();
    };
  }, [open]);

  if (!open) return null;
  const preview = canPreviewPdf();

  return (
    <div className="cv-modal" onPointerDown={(e) => { if (e.target === e.currentTarget) closeCv(); }}>
      <div className="cv-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="cv-modal-title" ref={dialogRef}>
        <div className="cv-modal-head">
          <div>
            <div className="cv-modal-kicker">curriculum vitae</div>
            <h2 id="cv-modal-title">Nur Ahmad Khatim</h2>
          </div>
          <div className="cv-modal-actions">
            <a className="cv-modal-icon" href={CV_URL} download={CV_FILENAME} title="Download PDF" aria-label="Download PDF">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" /></svg>
            </a>
            <a className="cv-modal-icon" href={CV_URL} target="_blank" rel="noopener noreferrer" title="Open in a new tab" aria-label="Open in a new tab">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
            </a>
            <button type="button" className="cv-modal-icon" onClick={closeCv} ref={closeRef} title="Close (Esc)" aria-label="Close">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
        </div>
        <div className="cv-modal-body">
          {preview ? (
            <iframe className="cv-modal-frame" src={`${CV_URL}#view=FitH`} title="CV of Nur Ahmad Khatim (PDF)" />
          ) : (
            <div className="cv-modal-fallback">
              <p>This browser can't preview PDFs inside the page.</p>
              <div className="cv-modal-fallback-actions">
                <a className="btn-ink" href={CV_URL} target="_blank" rel="noopener noreferrer">open the pdf</a>
                <a className="btn-ink btn-paper" href={CV_URL} download={CV_FILENAME}>download</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
