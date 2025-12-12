"use client";

import { useDocument } from "@/src/hooks/useDocument";
import { useDocumentsStore } from "@/src/stores/documents";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { PdfViewer } from "./PdfViewer";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

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

interface DocumentViewProps {
  documentKey: string;
  width?: number;
}

export const DocumentView = ({
  documentKey,
  width,
}: DocumentViewProps) => {
  const { data } = useDocument();
  const { setDocument } = useDocumentsStore();
  const [isLoading, setIsLoading] = useState(data?.size === undefined);

  if (data?.size !== undefined && isLoading) {
    setDocument(data);
    setIsLoading(false);
  }

  return (
    <>
      {data?.size ? (
        data.type === "application/pdf" ? (
          <ScrollArea className="h-[calc(100vh-180px)] flex mx-auto">
            <PdfViewer file={data} width={width} />
          </ScrollArea>
        ) : (
          <Image
            src={URL.createObjectURL(data)}
            alt={documentKey}
            width={300}
            height={200}
            className="rounded-lg w-auto max-h-[400px] m-auto"
          />
        )
      ) : (
        <Skeleton className="w-full h-80" />
      )}
    </>
  );
};
