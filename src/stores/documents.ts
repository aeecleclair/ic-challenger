// import { create } from "zustand";
// import { devtools, persist } from "zustand/middleware";

// interface DocumentsStore {
//   document?: File;
//   setDocument: (newDoc: File) => void;
// }

// export const useDocumentsStore = create<DocumentsStore>()(
//   devtools(
//     persist(
//       (set) => ({
//         document: undefined,
//         setDocument: (newDoc: File) => {
//           set((state) => ({
//             document: newDoc,
//           }));
//         },
//       }),
//       {
//         name: "challenger-documents-storage",
//       },
//     ),
//   ),
// );
