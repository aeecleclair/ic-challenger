// import { ControllerRenderProps, FieldValues } from "react-hook-form";

// import { Button } from "../ui/button";
// import { DropzoneInput } from "../ui/dropzoneInput";
// import { useDocument } from "@/src/hooks/useDocument";
// import Image from "next/image";
// import { useDocumentsStore } from "@/src/stores/documents";
// import { useState } from "react";
// import { Skeleton } from "../ui/skeleton";
// import { PdfViewer } from "./PdfViewer";
// import { ScrollArea } from "../ui/scroll-area";

// interface DocumentDialogProps {
//   setIsOpen: (value: boolean) => void;
//   setIsUploading: (value: boolean) => void;
//   field: ControllerRenderProps<FieldValues, string>;
//   fileType: string;
//   documentId?: string;
//   participantId: string;
// }

// export const DocumentDialog = ({
//   setIsUploading,
//   setIsOpen,
//   field,
//   fileType,
//   documentId,
//   participantId,
// }: DocumentDialogProps) => {
//   const {
//     uploadDocument,
//     getDocument,
//     data,
//     setDocumentId,
//     documentId: docId,
//   } = useDocument();
//   const { setDocument } = useDocumentsStore();
//   const file = getDocument(participantId, fileType);
//   const [image, setImage] = useState<File | undefined>(file);
//   const [isLoading, setIsLoading] = useState(data?.size === undefined);
//   if (
//     file?.size === undefined &&
//     docId !== documentId &&
//     data?.size === undefined
//   ) {
//     setDocumentId(field.value.id);
//     setIsLoading(true);
//   }

//   if (data?.size !== undefined && isLoading) {
//     setDocument(participantId, fileType, field.value.id, data);
//     setImage(data);
//     setIsLoading(false);
//   }

//   return (
//     <>
//       {image?.size !== undefined ? (
//         <div className="flex flex-col items-center gap-4">
//           {image?.type === "application/pdf" ? (
//             <ScrollArea className="h-[400px]">
//               <PdfViewer file={image} width={550} />
//             </ScrollArea>
//           ) : (
//             <Image
//               src={URL.createObjectURL(image)}
//               alt={field.name}
//               width={300}
//               height={200}
//               className="rounded-lg w-auto max-h-[400px]"
//             />
//           )}
//           <Button
//             className="w-full"
//             onClick={() => {
//               field.onChange(null);
//               setImage(undefined);
//             }}
//           >
//             Modifier
//           </Button>
//         </div>
//       ) : (
//         <>
//           {documentId ? (
//             <div className="flex flex-col items-center gap-4">
//               <Skeleton className="w-full h-80" />
//               <Button
//                 className="w-full"
//                 onClick={() => {
//                   field.onChange(null);
//                   setImage(undefined);
//                 }}
//               >
//                 Modifier
//               </Button>
//             </div>
//           ) : (
//             <DropzoneInput
//               setIsOpen={setIsOpen}
//               onDropAccepted={(files, _) => {
//                 const file = files[0];
//                 setIsUploading(true);
//                 uploadDocument(file, fileType, (documentId) => {
//                   field.onChange({
//                     name: file.name,
//                     id: documentId,
//                     type: fileType,
//                     updated: true,
//                   });
//                   setDocument(participantId, fileType, documentId, file);
//                   setDocumentId(documentId);
//                   setIsUploading(false);
//                 });
//               }}
//             />
//           )}
//         </>
//       )}
//     </>
//   );
// };
