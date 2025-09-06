import {
  useGetCompetitionEditionsActive,
  usePostCompetitionEditions,
} from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";
import { CompetitionEditionBase } from "../api/hyperionSchemas";
import { toast } from "../components/ui/use-toast";
import { ErrorType, DetailedErrorType } from "../utils/errorTyping";

export const useEdition = () => {
  const { token, isTokenExpired } = useAuth();

  const {
    data: edition,
    isLoading,
    refetch: refetchEdition,
    error,
  } = useGetCompetitionEditionsActive(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: !isTokenExpired(),
      retry: 0,
      queryHash: "getEdition",
    },
  );

  const { mutate: mutateCreateEdition, isPending: isCreationLoading } =
    usePostCompetitionEditions();

  const createEdition = async (
    editionData: CompetitionEditionBase,
    callback: () => void,
  ) => {
    return mutateCreateEdition(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: editionData,
      },
      {
        onSettled: (data, error) => {
          if ((error as any).stack.body || (error as any).stack.detail) {
            console.log(error);
            toast({
              title: "Erreur lors de la création de l'édition",
              description:
                (error as unknown as ErrorType).stack.body ||
                (error as unknown as DetailedErrorType).stack.detail,
              variant: "destructive",
            });
          } else {
            refetchEdition();
            callback();
            toast({
              title: "Édition créée",
              description: "L'édition a été créée avec succès.",
            });
          }
        },
      },
    );
  };

  return {
    edition,
    error,
    isLoading,
    refetchEdition,
    isCreationLoading,
    createEdition,
  };
};
