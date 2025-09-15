// "use client";

// import { useDocument } from "@/src/hooks/useDocument";
// import { useDocumentsStore } from "@/src/stores/documents";
// import Image from "next/image";
// import { Skeleton } from "../ui/skeleton";
// import { PdfViewer } from "./PdfViewer";
// import { useState } from "react";
// import { ScrollArea } from "../ui/scroll-area";

// interface DocumentViewProps {
//   userId: string;
//   documentKey: string;
//   id: string;
//   file?: File;
//   width?: number;
// }

// export const DocumentView = ({
//   userId,
//   documentKey,
//   id,
//   file,
//   width,
// }: DocumentViewProps) => {
//   const { data, setDocumentId, documentId } = useDocument();
//   const { setDocument } = useDocumentsStore();
//   const [isLoading, setIsLoading] = useState(data?.size === undefined);

//   if (file?.size === undefined && documentId !== id) {
//     setDocumentId(id);
//     setIsLoading(true);
//   }

//   if (data?.size !== undefined && isLoading) {
//     setDocument(userId, documentKey, id, data);
//     setIsLoading(false);
//   }

//   return (
//     <>
//       {file?.size ? (
//         file?.type === "application/pdf" ? (
//           <ScrollArea className="h-[calc(100vh-180px)] flex mx-auto">
//             <PdfViewer file={file} width={width} />
//           </ScrollArea>
//         ) : (
//           <Image
//             src={URL.createObjectURL(file)}
//             alt={documentKey}
//             width={300}
//             height={200}
//             className="rounded-lg w-auto max-h-[400px] m-auto"
//           />
//         )
//       ) : (
//         <Skeleton className="w-full h-80" />
//       )}
//     </>
//   );
// };
