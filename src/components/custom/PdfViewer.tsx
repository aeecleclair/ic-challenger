// import { useState } from "react";
// import { Skeleton } from "../ui/skeleton";
// import { Document, Page } from "react-pdf";
// import { DocumentCallback } from "react-pdf/dist/esm/shared/types.js";
// import type * as reactPdfType from "react-pdf";
// // Workaround for https://github.com/wojtekmaj/react-pdf/issues/1811
// let reactPdf: typeof reactPdfType | undefined;
// if (typeof window !== "undefined") {
//   reactPdf = require("react-pdf");
// }

// // URL for the worker file (if you're using the CDN)
// // We need to use the CDN link to try and work around
// // this issue: https://github.com/vercel/next.js/discussions/61549
// if (reactPdf?.pdfjs && typeof window !== "undefined") {
//   const workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${reactPdf.pdfjs.version}/pdf.worker.min.mjs`;
//   reactPdf.pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
// }

// interface PdfViewerProps {
//   file: File;
//   width?: number;
// }

// export const PdfViewer = ({ file, width }: PdfViewerProps) => {
//   const [numPages, setNumPages] = useState<number>();
//   if (typeof window === "undefined") {
//     // SSR: return null or a fallback
//     return null;
//   }

//   function onDocumentLoadSuccess({
//     numPages: nextNumPages,
//   }: DocumentCallback): void {
//     setNumPages(nextNumPages);
//   }
//   // get the width of the parent element
//   const maxWidth = self?.innerWidth ?? width ?? 550;
//   return (
//     <Document
//       file={file}
//       onLoadSuccess={onDocumentLoadSuccess}
//     //   options={options}
//       loading={<Skeleton className="w-full h-80" />}
//     >
//       {Array.from(new Array(numPages), (el, index) => (
//         <Page
//           key={`page_${index + 1}`}
//           pageNumber={index + 1}
//           renderTextLayer={false}
//           className="max-w-full aspect-auto"
//           width={width}
//         />
//       ))}
//     </Document>
//   );
// };
