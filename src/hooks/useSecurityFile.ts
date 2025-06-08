import { usePostRaidSecurityFile } from "@/src/api/hyperionComponents";
import { SecurityFileBase } from "../api/hyperionSchemas";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { toast } from "../components/ui/use-toast";

export const useSecurityFile = () => {
  const { token } = useAuth();

  const {
    mutate: mutateAssignSecurityFile,
    isPending: isCreationLoading,
    isSuccess: isCreationSuccess,
  } = usePostRaidSecurityFile({});

  const setSecurityFile = (
    securityFile: SecurityFileBase,
    participantId: string,
    callback: (securityFileId: string) => void,
  ) => {
    mutateAssignSecurityFile(
      {
        body: securityFile,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        queryParams: {
          participant_id: participantId,
        },
      },
      {
        // FIXME: Not trigger, to investigate
        onSuccess(data, variables, context) {
          callback(data.id);
        },
        onError(error, variables, context) {
          console.log(error);
          toast({
            title: "Erreur lors de la création de la fiche de sécurité",
            description:
              "Une erreur est survenue, veuillez réessayer plus tard",
            variant: "destructive",
          });
        },
      },
    );
  };

  return {
    setSecurityFile,
    isCreationLoading,
    isCreationSuccess,
  };
};
