import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface DocumentsStore {
  document?: File;
  setDocument: (newDoc: File) => void;
  reset: () => void;
}

export const useDocumentsStore = create<DocumentsStore>()(
  devtools(
    persist(
      (set) => ({
        document: undefined,
        setDocument: (newDoc: File) => {
          set((state) => ({
            document: newDoc,
          }));
        },
        reset: () => set(() => ({ document: undefined })),
      }),
      {
        name: "challenger-documents-storage",
      },
    ),
  ),
);
