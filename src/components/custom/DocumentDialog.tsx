import {
  ControllerRenderProps,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";

import { Button } from "../ui/button";
import { DropzoneInput } from "../ui/dropzoneInput";
import Image from "next/image";
// import { useDocumentsStore } from "@/src/stores/documents";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
// import { PdfViewer } from "./PdfViewer";
import { ScrollArea } from "../ui/scroll-area";
import { useDocument } from "@/src/hooks/useDocument";
import { RegisteringFormValues } from "@/src/forms/registering";

interface DocumentDialogProps {
  setIsOpen: (value: boolean) => void;
  setIsUploading: (value: boolean) => void;
  field: ControllerRenderProps<FieldValues, string>;
  sportId?: string;
  form: UseFormReturn<RegisteringFormValues>;
}

export const DocumentDialog = ({
  setIsUploading,
  setIsOpen,
  field,
  sportId,
  form,
}: DocumentDialogProps) => {
  const { uploadDocument, data } = useDocument();
  // const { setDocument } = useDocumentStore();
  const [image, setImage] = useState<File | undefined>(data);

  return (
    <>
      {image?.size !== undefined ? (
        <div className="flex flex-col items-center gap-4">
          {image?.type === "application/pdf" ? (
            <ScrollArea className="h-[400px]">
              {/* <PdfViewer file={image} width={550} /> */}
            </ScrollArea>
          ) : (
            <Image
              src={URL.createObjectURL(image)}
              alt={field.name}
              width={300}
              height={200}
              className="rounded-lg w-auto max-h-[400px]"
            />
          )}
          <Button
            className="w-full"
            onClick={() => {
              field.onChange(null);
              form.setValue("sport.certificate", "Choisir un fichier");
              setImage(undefined);
            }}
          >
            Modifier
          </Button>
        </div>
      ) : (
        <>
          {sportId ? (
            <DropzoneInput
              setIsOpen={setIsOpen}
              onDropAccepted={(files, _) => {
                const file = files[0];
                setIsUploading(true);
                uploadDocument(file, sportId, () => {
                  // setDocument(file);
                  setImage(file);
                  form.setValue("sport.certificate", file.name);
                  setIsUploading(false);
                });
              }}
            />
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              Veuillez d&apos;abord sélectionner un sport
            </div>
          )}
        </>
      )}
    </>
  );
};
