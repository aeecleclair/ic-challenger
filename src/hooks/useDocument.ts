import {
  useGetCompetitionParticipantsUsersUserIdCertificate,
} from "../api/hyperionComponents";
import axios from "axios";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";
import { useDocumentsStore } from "../stores/documents";

export const useDocument = () => {
  const backUrl: string =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://hyperion.myecl.fr";
  const { token, userId } = useAuth();
  const { document, setDocument, reset } = useDocumentsStore();

  const uploadDocument = (
    file: File,
    sportId: string,
    callback: () => void,
  ) => {
    const formData = new FormData();
    formData.append("certificate", file);
    axios
      .post(
        `${backUrl}/competition/participants/sports/${sportId}/certificate`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        if (response.status > 300) {
          console.error(response.data);
          toast({
            title: "Erreur lors de l'ajout du document",
            description:
              "Une erreur est survenue, veuillez réessayer plus tard",
            variant: "destructive",
          });
          return;
        }
        refetch();
        callback();
        // setDocument(file);
      });
  };

  const { data, refetch, isPending } =
    useGetCompetitionParticipantsUsersUserIdCertificate<File>(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParams: {
          userId: userId!,
        },
      },
      {
        enabled: !!userId,
        queryHash: "getDocument",
      },
    );

  //   const { mutate: mutateValidateDocument, isPending: isValidationLoading } =
  //     usePostRaidDocumentDocumentIdValidate();

  //   const setDocumentValidation = (
  //     documentId: string,
  //     validation: DocumentValidation,
  //     callback: () => void,
  //   ) => {
  //     mutateValidateDocument(
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         pathParams: {
  //           documentId: documentId,
  //         },
  //         queryParams: {
  //           validation: validation,
  //         },
  //       },
  //       {
  //         onSettled: () => {
  //           callback();
  //         },
  //       },
  //     );
  //   };

  //   const getDocument = (userId: string, key: string) => {
  //     if (key === "" || key === undefined) return undefined;
  //     if (documents[userId!] === undefined) return undefined;
  //     return documents[userId!][key]?.file;
  //   };

  return {
    uploadDocument,
    // getDocument,
    document,
    setDocument,
    resetDocument: reset,
    data,
    refetch,
    isLoading: isPending,
    // setDocumentId,
    // documentId,
    // setDocumentValidation,
    // isValidationLoading,
  };
};
