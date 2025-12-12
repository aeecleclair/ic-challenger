import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Document, Page, pdfjs } from "react-pdf";
import { DocumentCallback } from "react-pdf/dist/esm/shared/types.js";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

// pdfjs-dist : From Local _OR_ pdfjs-dist : From CDN pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`
/* pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  //"npm:pdfjs-dist/build/pdf.worker.min.mjs",
 //"pdfjs-dist/legacy/build/pdf.worker.min.mjs",
  import.meta.url
).toString();  */

//pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

/* const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
}  */

interface PdfViewerProps {
  file: File;
  width?: number;
}

export const PdfViewer = ({ file, width }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number>();
  if (typeof window === "undefined") {
    // SSR: return null or a fallback
    return null;
  }

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: DocumentCallback): void {
    setNumPages(nextNumPages);
  }
  // get the width of the parent element
  const maxWidth = self?.innerWidth ?? width ?? 550;
  return (
    <Document
      file={file}
      onLoadSuccess={onDocumentLoadSuccess}
    //   options={options}
      loading={<Skeleton className="w-full h-80" />}
    >
      {Array.from(new Array(numPages), (el, index) => (
        <Page
          key={`page_${index + 1}`}
          pageNumber={index + 1}
          renderTextLayer={false}
          className="max-w-full aspect-auto"
          width={width}
        />
      ))}
    </Document>
  );
};
