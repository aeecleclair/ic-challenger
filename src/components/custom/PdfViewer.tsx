import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { DocumentCallback } from "react-pdf/dist/esm/shared/types.js";

if (typeof Promise.withResolvers === "undefined") {
  if (window)
    // @ts-expect-error This does not exist outside of polyfill which this is doing
    window.Promise.withResolvers = function () {
      let resolve, reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
}

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

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
      options={options}
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
